
#!/bin/bash

# 测试配置
BASE_URL="http://localhost:3000"
ADMIN_URL="http://localhost:3000/admin"
ADMIN_CREDENTIALS="admin=jingming2024!"

# 测试结果
PASSED=0
FAILED=0

# 辅助函数：测试URL
test_url() {
    local url=$1
    local description=$2
    local expected_code=${3:-200}

    echo "测试: $description"
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    if [ "$response_code" = "$expected_code" ]; then
        echo "✓ $description - 通过 ($response_code)"
        ((PASSED++))
        return 0
    else
        echo "✗ $description - 失败 ($response_code)"
        ((FAILED++))
        return 1
    fi
}

# 辅助函数：测试表单提交
test_form() {
    local url=$1
    local data=$2
    local description=$3

    echo "测试: $description"
    response_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -d "$data" -H "Content-Type: application/x-www-form-urlencoded" "$url")

    if [ "$response_code" = "200" ] || [ "$response_code" = "302" ]; then
        echo "✓ $description - 通过 ($response_code)"
        ((PASSED++))
        return 0
    else
        echo "✗ $description - 失败 ($response_code)"
        ((FAILED++))
        return 1
    fi
}

# 辅助函数：测试API
test_api() {
    local url=$1
    local data=$2
    local description=$3

    echo "测试: $description"
    response_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -d "$data" -H "Content-Type: application/json" "$url")

    if [ "$response_code" = "200" ]; then
        echo "✓ $description - 通过 ($response_code)"
        ((PASSED++))
        return 0
    else
        echo "✗ $description - 失败 ($response_code)"
        ((FAILED++))
        return 1
    fi
}

echo "开始测试网站功能..."

# 测试网站基本页面
test_url "$BASE_URL" "网站首页是否可访问"
test_url "$BASE_URL/about" "关于我们页面是否可访问"
test_url "$BASE_URL/contact" "联系我们页面是否可访问"
test_url "$BASE_URL/products" "产品页面是否可访问"

# 测试后台登录
test_form "$ADMIN_URL/login" "username=admin&password=jingming2024!" "后台登录功能"

# 测试产品管理
test_url "$ADMIN_URL/products" "产品管理页面是否可访问" 302

# 测试询盘功能
test_api "$BASE_URL/api/inquiry" '{"name":"测试用户","phone":"13800138000","email":"test@example.com","company":"测试公司","product_name":"测试产品","quantity":"100","message":"这是一个测试询盘"}' "询盘功能"

# 测试联系我们表单
test_api "$BASE_URL/api/inquiry" '{"name":"测试用户2","phone":"13900139000","email":"test2@example.com","company":"测试公司2","product_name":"测试产品2","quantity":"200","message":"这是另一个测试询盘"}' "联系我们表单"

# 输出测试结果
echo ""
echo "测试结果:"
echo "通过: $PASSED"
echo "失败: $FAILED"
echo "总计: $((PASSED + FAILED))"

# 生成测试报告
cat > test-report-simple.md << EOF
# 网站功能测试报告

测试时间: $(date)
测试结果: $([ $FAILED -eq 0 ] && echo "全部通过" || echo "存在失败项")

## 测试统计
- 通过测试: $PASSED
- 失败测试: $FAILED
- 总计测试: $((PASSED + FAILED))

## 结论
$([ $FAILED -eq 0 ] && echo "网站功能正常，具备上线条件。" || echo "网站存在功能问题，需要修复后才能上线。")
EOF

echo "测试报告已保存到 test-report-simple.md"
