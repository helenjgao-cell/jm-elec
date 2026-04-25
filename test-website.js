
const http = require('http');
const fs = require('fs');
const path = require('path');

// 测试配置
const BASE_URL = 'http://localhost:3000';
const ADMIN_URL = 'http://localhost:3000/admin';
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'jingming2024!'
};

// 测试结果
const testResults = {
    passed: 0,
    failed: 0,
    details: []
};

// 辅助函数：发送HTTP请求
function request(url, method = 'GET', data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: url.replace(BASE_URL, ''),
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const result = {
                        status: res.statusCode,
                        headers: res.headers,
                        body: body,
                        json: body ? JSON.parse(body) : null
                    };
                    resolve(result);
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: body,
                        json: null,
                        error: e
                    });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// 辅助函数：断言测试
function assert(condition, message) {
    if (condition) {
        testResults.passed++;
        testResults.details.push(`✓ ${message}`);
        console.log(`✓ ${message}`);
    } else {
        testResults.failed++;
        testResults.details.push(`✗ ${message}`);
        console.log(`✗ ${message}`);
    }
}

// 辅助函数：等待
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 测试函数集合
const tests = [
    {
        name: '测试网站首页是否可访问',
        test: async () => {
            const res = await request(BASE_URL);
            assert(res.status === 200, '首页应返回200状态码');
            assert(res.body.includes('浙江精铭电子科技有限公司'), '首页应包含公司名称');
        }
    },
    {
        name: '测试后台登录功能',
        test: async () => {
            // 先获取登录页
            const loginPage = await request(`${ADMIN_URL}/login`);
            assert(loginPage.status === 200, '登录页应可访问');

            // 尝试登录
            const loginRes = await request(`${ADMIN_URL}/login`, 'POST', ADMIN_CREDENTIALS, {
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            // 检查是否登录成功（通过重定向或页面内容）
            assert(loginRes.status === 302 || loginRes.body.includes('dashboard'), '登录应成功并重定向到仪表板');
        }
    },
    {
        name: '测试后台仪表板',
        test: async () => {
            // 先登录
            await request(`${ADMIN_URL}/login`, 'POST', ADMIN_CREDENTIALS, {
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            // 访问仪表板
            const dashboard = await request(`${ADMIN_URL}`);
            assert(dashboard.status === 200, '仪表板应可访问');
            assert(dashboard.body.includes('统计概览'), '仪表板应包含统计信息');
        }
    },
    {
        name: '测试产品管理页面',
        test: async () => {
            // 先登录
            await request(`${ADMIN_URL}/login`, 'POST', ADMIN_CREDENTIALS, {
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            // 访问产品管理页面
            const productsPage = await request(`${ADMIN_URL}/products`);
            assert(productsPage.status === 200, '产品管理页应可访问');
            assert(productsPage.body.includes('产品管理'), '产品管理页应包含标题');
        }
    },
    {
        name: '测试产品编辑功能',
        test: async () => {
            // 先登录
            await request(`${ADMIN_URL}/login`, 'POST', ADMIN_CREDENTIALS, {
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            // 获取产品列表
            const productsPage = await request(`${ADMIN_URL}/products`);
            const productIdMatch = productsPage.body.match(/data-id="(\d+)"/);
            if (productIdMatch) {
                const productId = productIdMatch[1];

                // 获取产品详情
                const productDetail = await request(`${ADMIN_URL}/products/${productId}`);
                assert(productDetail.status === 200, `产品详情页应可访问，ID: ${productId}`);

                // 尝试更新产品
                const updateData = {
                    name: '测试产品更新',
                    category: 'pct',
                    specs: JSON.stringify(['测试规格1', '测试规格2']),
                    description: '这是一个测试产品更新',
                    sort_order: 1,
                    id: productId
                };

                const updateRes = await request(`${ADMIN_URL}/products`, 'POST', updateData, {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': productsPage.headers['set-cookie'] ? productsPage.headers['set-cookie'][0] : ''
                });

                // 检查更新是否成功
                assert(updateRes.status === 302 || updateRes.body.includes('成功'), `产品更新应成功，ID: ${productId}`);

                // 验证更新是否生效
                const updatedProduct = await request(`${ADMIN_URL}/products/${productId}`);
                if (updatedProduct.body) {
                    assert(updatedProduct.body.includes('测试产品更新'), `产品名称应已更新为"测试产品更新"`);
                }
            } else {
                assert(false, '未找到产品ID，无法测试编辑功能');
            }
        }
    },
    {
        name: '测试询盘功能',
        test: async () => {
            // 先登录
            await request(`${ADMIN_URL}/login`, 'POST', ADMIN_CREDENTIALS, {
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            // 访问询盘管理页面
            const inquiriesPage = await request(`${ADMIN_URL}/inquiries`);
            assert(inquiriesPage.status === 200, '询盘管理页应可访问');
            assert(inquiriesPage.body.includes('询盘管理'), '询盘管理页应包含标题');

            // 提交一个测试询盘
            const testInquiry = {
                name: '测试用户',
                phone: '13800138000',
                email: 'test@example.com',
                company: '测试公司',
                product_name: '测试产品',
                quantity: '100',
                message: '这是一个测试询盘'
            };

            const inquiryRes = await request(`${BASE_URL}/api/inquiry`, 'POST', testInquiry);
            assert(inquiryRes.status === 200, '询盘提交应成功');
            assert(inquiryRes.json.success === true, '询盘提交应返回成功状态');

            // 检查询盘是否出现在管理页面
            await sleep(1000); // 等待数据库更新
            const updatedInquiriesPage = await request(`${ADMIN_URL}/inquiries`);
            assert(updatedInquiriesPage.body.includes('测试用户'), '询盘管理页应显示测试询盘');

            // 更新询盘状态
            const inquiryIdMatch = updatedInquiriesPage.body.match(/data-id="(\d+)"/);
            if (inquiryIdMatch) {
                const inquiryId = inquiryIdMatch[1];
                const statusRes = await request(`${ADMIN_URL}/inquiries/${inquiryId}/status`, 'POST', { status: 'done' });
                assert(statusRes.status === 200, '询盘状态更新应成功');
                assert(statusRes.json.success === true, '询盘状态更新应返回成功状态');

                // 删除测试询盘
                const deleteRes = await request(`${ADMIN_URL}/inquiries/${inquiryId}/delete`, 'POST');
                assert(deleteRes.status === 200, '询盘删除应成功');
                assert(deleteRes.json.success === true, '询盘删除应返回成功状态');
            } else {
                assert(false, '未找到询盘ID，无法测试状态更新和删除功能');
            }
        }
    },
    {
        name: '测试联系我们页面',
        test: async () => {
            const contactPage = await request(`${BASE_URL}/contact`);
            assert(contactPage.status === 200, '联系我们页应可访问');
            assert(contactPage.body.includes('在线留言'), '联系我们页应包含在线留言表单');

            // 检查表单提交功能
            const testContact = {
                name: '测试用户',
                phone: '13800138000',
                email: 'test@example.com',
                company: '测试公司',
                product_name: '测试产品',
                quantity: '100',
                message: '这是一个测试留言'
            };

            const contactRes = await request(`${BASE_URL}/api/inquiry`, 'POST', testContact);
            assert(contactRes.status === 200, '联系我们表单提交应成功');
            assert(contactRes.json.success === true, '联系我们表单提交应返回成功状态');
        }
    },
    {
        name: '测试产品详情页',
        test: async () => {
            // 先获取产品列表页
            const productsPage = await request(`${BASE_URL}/products`);
            const productLinkMatch = productsPage.body.match(/href="\/product\/(\d+)"/);

            if (productLinkMatch) {
                const productId = productLinkMatch[1];
                const productDetailPage = await request(`${BASE_URL}/product/${productId}`);
                assert(productDetailPage.status === 200, `产品详情页应可访问，ID: ${productId}`);
                assert(productDetailPage.body.includes('产品详情'), '产品详情页应包含产品详情');
            } else {
                assert(false, '未找到产品链接，无法测试产品详情页');
            }
        }
    },
    {
        name: '测试关于我们页面',
        test: async () => {
            const aboutPage = await request(`${BASE_URL}/about`);
            assert(aboutPage.status === 200, '关于我们页应可访问');
            assert(aboutPage.body.includes('关于我们'), '关于我们页应包含标题');
        }
    }
];

// 主测试函数
async function runTests() {
    console.log('开始测试网站功能...\n');

    for (const test of tests) {
        console.log(`
测试: ${test.name}`);
        try {
            await test.test();
        } catch (error) {
            console.error(`测试出错: ${error.message}`);
            console.error(error.stack);
            testResults.failed++;
            testResults.details.push(`✗ ${test.name} - 错误: ${error.message}`);
        }

        // 添加延迟，避免请求过快
        await sleep(500);
    }

    // 输出测试结果
    console.log('\n\n测试结果:');
    console.log(`通过: ${testResults.passed}`);
    console.log(`失败: ${testResults.failed}`);
    console.log(`总计: ${testResults.passed + testResults.failed}`);

    if (testResults.failed > 0) {
        console.log('\n失败详情:');
        testResults.details.filter(detail => detail.startsWith('✗')).forEach(detail => {
            console.log(detail);
        });
    }

    // 生成测试报告
    const report = `
# 网站功能测试报告

测试时间: ${new Date().toLocaleString()}
测试结果: ${testResults.failed === 0 ? '全部通过' : '存在失败项'}

## 测试统计
- 通过测试: ${testResults.passed}
- 失败测试: ${testResults.failed}
- 总计测试: ${testResults.passed + testResults.failed}

## 测试详情
${testResults.details.map(detail => `- ${detail}`).join('\n')}

## 结论
${testResults.failed === 0 ? '网站功能正常，具备上线条件。' : '网站存在功能问题，需要修复后才能上线。'}
    `;

    // 保存测试报告
    fs.writeFileSync(path.join(__dirname, 'test-report.md'), report);
    console.log('\n测试报告已保存到 test-report.md');
}

// 运行测试
runTests().catch(console.error);
