const express = require('express');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const expressLayouts = require('express-ejs-layouts');
const { initDatabase, db } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// 初始化数据库
initDatabase();

// 配置上传
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('仅允许上传图片文件'));
    }
});

// 中间件
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'jm-elec-secret-2024!@#',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24小时
}));

// EJS 模板
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'admin/layout');
app.set('layout extractScripts', false);
app.set('layout extractStyles', false);

// 静态文件
app.use(express.static(path.join(__dirname, 'public')));
// 兼容旧的图片路径
app.use('/images', express.static(path.join(__dirname, 'images')));

// 全局模板变量
app.use(async (req, res, next) => {
    res.locals.settings = await require('./database').getAllSettings();
    res.locals.user = req.session.user || null;
    next();
});

// ========== 前台路由 ==========

// 首页
app.get('/', async (req, res) => {
    const banners = await require('./database').getAllBanners();
    const allProducts = await require('./database').getAllProducts();
    // 热门产品取前4个
    const hotProducts = allProducts.slice(0, 4);
    res.render('index', {
        layout: false,
        activePage: 'index',
        title: '浙江精铭电子科技有限公司 - 专业接线端子制造商',
        description: '浙江精铭电子科技有限公司，专业接线端子制造商，二十年行业经验，产品涵盖快速接线端子、LED免焊接端子、导轨式弹簧端子等。',
        keywords: '接线端子,快速接线端子,导轨式端子,LED端子,电气连接器,浙江精铭电子',
        banners,
        hotProducts,
        settings: res.locals.settings
    });
});

// 关于我们
app.get('/about', async (req, res) => {
    res.render('about', {
        layout: false,
        activePage: 'about',
        title: '关于我们 - 浙江精铭电子科技有限公司',
        description: '浙江精铭电子科技有限公司成立于2004年，二十年专注电气连接解决方案，是国内领先的接线端子制造商。',
        keywords: '关于精铭电子,接线端子厂家,电气连接器制造商,乐清电子厂'
    });
});

// 产品中心
app.get('/products', async (req, res) => {
    const category = req.query.category || 'all';
    const products = await require('./database').getAllProducts(category);
    const categories = await require('./database').getAllCategories();
    res.render('products', {
        layout: false,
        activePage: 'products',
        title: '产品中心 - 浙江精铭电子科技有限公司',
        description: '精铭电子产品中心，提供快速接线端子、LED免焊接端子、导轨式弹簧端子、防水航空插座等全系列产品。',
        keywords: '快速接线端子,LED端子,导轨式端子,防水航空插座,热缩管端子,跨境电商盒装',
        products,
        category,
        categories
    });
});

// 产品详情
app.get('/product/:id', async (req, res) => {
    const product = await require('./database').getProductById(req.params.id);
    if (!product) return res.status(404).redirect('/products');
    const relatedProducts = await require('./database').getAllProducts(product.category);
    res.render('product-detail', {
        layout: false,
        activePage: 'products',
        title: `${product.name} - 浙江精铭电子科技有限公司`,
        description: `${product.name}，${JSON.parse(product.specs || '[]').join('，')}。浙江精铭电子专业制造。`,
        keywords: `${product.name},接线端子,精铭电子`,
        product,
        specs: JSON.parse(product.specs || '[]'),
        relatedProducts: relatedProducts.filter(p => p.id != product.id).slice(0, 4)
    });
});

// 联系我们
app.get('/contact', async (req, res) => {
    res.render('contact', {
        layout: false,
        activePage: 'contact',
        title: '联系我们 - 浙江精铭电子科技有限公司',
        description: '欢迎联系浙江精铭电子科技有限公司，电话：13388575831，地址：浙江省乐清市柳市歧头工业区。支持批发采购、定制开发、跨境供应。',
        keywords: '联系精铭电子,接线端子批发,接线端子定制,跨境供应'
    });
});

// 提交询盘
app.post('/api/inquiry', async (req, res) => {
    try {
        const { name, phone, email, company, product_name, quantity, message } = req.body;
        if (!name || !phone || !message) {
            return res.json({ success: false, message: '请填写必填项' });
        }
        const id = await require('./database').addInquiry({
            name, phone, email, company, product_name, quantity, message
        });
        res.json({ success: true, message: '提交成功，我们会尽快与您联系！', id });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: '提交失败，请稍后重试' });
    }
});

// ========== 后台路由 ==========

// 登录页
app.get('/admin/login', (req, res) => {
    if (req.session.user) return res.redirect('/admin');
    res.render('admin/login', { layout: false, error: null });
});

// 登录提交
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await require('./database').getAdminByUsername(username);
    
    if (!admin) {
        return res.render('admin/login', { layout: false, error: '用户名或密码错误' });
    }
    
    // 检查是否锁定
    if (admin.locked_until > Date.now()) {
        return res.render('admin/login', { layout: false, error: '账号已锁定，请10分钟后再试' });
    }
    
    const valid = bcrypt.compareSync(password, admin.password_hash);
    if (!valid) {
        const attempts = (admin.login_attempts || 0) + 1;
        let lockedUntil = 0;
        if (attempts >= 5) {
            lockedUntil = Date.now() + 10 * 60 * 1000; // 锁定10分钟
        }
        await require('./database').updateLoginAttempts(admin.id, attempts, lockedUntil);
        return res.render('admin/login', { layout: false, error: '用户名或密码错误' });
    }
    
    // 登录成功，重置尝试次数
    await require('./database').updateLoginAttempts(admin.id, 0, 0);
    req.session.user = { id: admin.id, username: admin.username };
    res.redirect('/admin');
});

// 退出登录
app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// 后台首页
app.get('/admin', require('./middleware/auth'), async (req, res) => {
    const stats = await require('./database').getStats();
    const recentInquiries = await require('./database').getAllInquiries();
    res.render('admin/dashboard', {
        layout: 'admin/layout',
        activeAdminPage: 'dashboard',
        stats,
        recentInquiries: recentInquiries.slice(0, 5)
    });
});

// 询盘管理
app.get('/admin/inquiries', require('./middleware/auth'), async (req, res) => {
    const inquiries = await require('./database').getAllInquiries();
    res.render('admin/inquiries', {
        layout: 'admin/layout',
        activeAdminPage: 'inquiries',
        inquiries
    });
});

// 询盘详情
app.get('/admin/inquiries/:id', require('./middleware/auth'), async (req, res) => {
    const inquiry = await require('./database').getInquiryById(req.params.id);
    if (!inquiry) return res.status(404).redirect('/admin/inquiries');
    res.render('admin/inquiry-detail', {
        layout: 'admin/layout',
        activeAdminPage: 'inquiries',
        inquiry
    });
});

app.post('/admin/inquiries/:id/status', require('./middleware/auth'), async (req, res) => {
    await require('./database').updateInquiryStatus(req.params.id, req.body.status);
    res.json({ success: true });
});

app.post('/admin/inquiries/:id/delete', require('./middleware/auth'), async (req, res) => {
    await require('./database').deleteInquiry(req.params.id);
    res.json({ success: true });
});

// 产品管理
app.get('/admin/products', require('./middleware/auth'), async (req, res) => {
    const products = await require('./database').getAllProducts();
    const categories = await require('./database').getAllCategories();
    res.render('admin/products', {
        layout: 'admin/layout',
        activeAdminPage: 'products',
        products,
        categories
    });
});

app.post('/admin/products', require('./middleware/auth'), upload.single('image'), async (req, res) => {
    try {
        const { name, category, specs, description, sort_order, id } = req.body;
        const image = req.file ? '/uploads/' + req.file.filename : req.body.existing_image;
        
        if (id) {
            await require('./database').updateProduct(id, {
                name, category, specs, image, description,
                sort_order: parseInt(sort_order) || 0,
                is_active: 1
            });
        } else {
            await require('./database').addProduct({
                name, category, specs, image, description,
                sort_order: parseInt(sort_order) || 0
            });
        }
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('操作失败');
    }
});

app.post('/admin/products/:id/delete', require('./middleware/auth'), async (req, res) => {
    await require('./database').deleteProduct(req.params.id);
    res.json({ success: true });
});

app.get('/admin/products/:id', require('./middleware/auth'), async (req, res) => {
    const product = await require('./database').getProductById(req.params.id);
    res.json(product);
});

// 图片管理
app.get('/admin/uploads', require('./middleware/auth'), (req, res) => {
    const fs = require('fs');
    const uploadsDir = path.join(__dirname, 'public/uploads');
    let files = [];
    try {
        files = fs.readdirSync(uploadsDir).map(f => ({
            name: f,
            url: '/uploads/' + f,
            size: fs.statSync(path.join(uploadsDir, f)).size
        }));
    } catch (e) {}
    res.render('admin/uploads', {
        layout: 'admin/layout',
        activeAdminPage: 'uploads',
        files
    });
});

app.post('/admin/upload', require('./middleware/auth'), upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: '上传失败' });
    res.json({ success: true, url: '/uploads/' + req.file.filename });
});

app.post('/admin/uploads/:name/delete', require('./middleware/auth'), (req, res) => {
    const fs = require('fs');
    const filePath = path.join(__dirname, 'public/uploads', req.params.name);
    try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false });
    }
});

// 分类管理
app.get('/admin/categories', require('./middleware/auth'), async (req, res) => {
    const categories = await require('./database').getAllCategories();
    res.render('admin/categories', {
        layout: 'admin/layout',
        activeAdminPage: 'categories',
        categories
    });
});

app.post('/admin/categories', require('./middleware/auth'), async (req, res) => {
    try {
        const { name, slug, sort_order, id } = req.body;
        if (id) {
            await require('./database').updateCategory(id, { name, slug, sort_order: parseInt(sort_order) || 0 });
        } else {
            await require('./database').addCategory({ name, slug, sort_order: parseInt(sort_order) || 0 });
        }
        res.redirect('/admin/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('操作失败: ' + err.message);
    }
});

app.get('/admin/categories/:id', require('./middleware/auth'), async (req, res) => {
    const category = await require('./database').getCategoryBySlug(req.params.id);
    // 如果按slug找不到，尝试按id找
    if (!category && !isNaN(req.params.id)) {
        const cats = await require('./database').getAllCategories();
        const found = cats.find(c => c.id == req.params.id);
        return res.json(found || null);
    }
    res.json(category);
});

app.post('/admin/categories/:id/delete', require('./middleware/auth'), async (req, res) => {
    try {
        await require('./database').deleteCategory(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 网站设置
app.get('/admin/settings', require('./middleware/auth'), async (req, res) => {
    const settings = await require('./database').getSettingsRaw();
    res.render('admin/settings', {
        layout: 'admin/layout',
        activeAdminPage: 'settings',
        settings
    });
});

app.post('/admin/settings', require('./middleware/auth'), async (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
        await require('./database').updateSetting(key, value);
    }
    res.redirect('/admin/settings');
});

// 404
app.use((req, res) => {
    res.status(404).redirect('/');
});

// 启动
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`后台地址: http://localhost:${PORT}/admin`);
    console.log(`默认账号: admin / jingming2024!`);
});
