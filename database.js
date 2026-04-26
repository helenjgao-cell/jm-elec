const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// 初始化数据库表
function initDatabase() {
    db.serialize(() => {
        // 产品表
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            specs TEXT,
            image TEXT,
            description TEXT,
            sort_order INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 询盘表
        db.run(`CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            company TEXT,
            product_name TEXT,
            quantity TEXT,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Banner表
        db.run(`CREATE TABLE IF NOT EXISTS banners (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            image TEXT NOT NULL,
            link TEXT,
            sort_order INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 网站设置表
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT,
            label TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 分类表
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            sort_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 管理员表
        db.run(`CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            login_attempts INTEGER DEFAULT 0,
            locked_until INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 检查是否已有数据
        db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
            if (err) return console.error(err);
            if (row.count === 0) {
                seedData();
            }
        });

        // 检查是否已有分类数据
        db.get("SELECT COUNT(*) as count FROM categories", (err, row) => {
            if (err) return console.error(err);
            if (row.count === 0) {
                seedCategories();
            }
        });
    });
}

// 初始化默认数据
function seedData() {
    const products = [
        // 跨境电商盒装
        {name: '跨境LT-211拼接套盒', category: 'box', image: 'images/products/box/box1.jpg', specs: JSON.stringify(['自由组合拼接设计', '34/40/50/55/60/100PCS多规格可选', '快速接线端子', '跨境电商热销'])},
        {name: '跨境快速电线连接器套装121只装', category: 'box', image: 'images/products/box/box2.jpg', specs: JSON.stringify(['PCT-212/213/215组合套装', '软硬线通用接线端子', '121只装大容量', '家装工程必备'])},
        {name: '跨境快速电线连接器PCT套装', category: 'box', image: 'images/products/box/box3.jpg', specs: JSON.stringify(['PCT-212/213/215系列组合', '软硬线通用接线', '快速插拔式连接', '跨境电商爆款'])},
        {name: '快速接线端子PCT-412/413', category: 'box', image: 'images/products/box/box4.jpg', specs: JSON.stringify(['二通/三通设计可选', '家装电线接头专用', '灯具分线端子', '快速接线器'])},
        {name: 'ClemasDiygo211拼接型连接器', category: 'box', image: 'images/products/box/box5.jpg', specs: JSON.stringify(['灰色黑色双色可选', '带互连跳线设计', '10灰色+10黑色组合', '跨境电商专供'])},
        {name: '螺旋接线帽压线帽套装', category: 'box', image: 'images/products/box/box6.jpg', specs: JSON.stringify(['旋转式压线设计', '330只装组合', '电线接线头专用', '多规格通用'])},
        {name: '冷压接线端子压线钳套装', category: 'box', image: 'images/products/box/box7.jpg', specs: JSON.stringify(['针型压线钳配套', 'VE管型端子压接', '电线铜鼻子专用', '专业接线神器'])},
        {name: '子弹型公母对接端子', category: 'box', image: 'images/products/box/box8.jpg', specs: JSON.stringify(['120/100/200只装可选', '电线接线头连接器', '可插拔式设计', '快速对接方便'])},
        // 快速接线端子
        {name: 'PCT-222快速接线端子', category: 'pct', image: 'images/products/pct/pct1.jpg', specs: JSON.stringify(['二进二出设计', '软硬线通用', 'JM2-2型号', '快速接线无需工具'])},
        {name: '快速接线端子PCT-JM-212', category: 'pct', image: 'images/products/pct/pct2.jpg', specs: JSON.stringify(['硬软电线并线分线', '按压式接线设计', '跨境热销款', '安装简单快捷'])},
        {name: '螺旋接线帽套装', category: 'pct', image: 'images/products/pct/pct3.jpg', specs: JSON.stringify(['弹簧螺式接线头', '旋转式压线设计', 'P1/P2/P3/P4/P6套装组合', '多规格适用'])},
        {name: 'CH-2/CH-3快速接线端子', category: 'pct', image: 'images/products/pct/pct4.jpg', specs: JSON.stringify(['LED阻燃两位接线柱', '2P/3P规格可选', '自锁按压式设计', '厂家直供品质保证'])},
        {name: 'PCT-212快速连接器', category: 'pct', image: 'images/products/pct/pct5.jpg', specs: JSON.stringify(['电源硬线接头专用', '灯具分并线神器', '蓝色绿色可选', '电线连接器精品'])},
        {name: '923按压式快速接线端子', category: 'pct', image: 'images/products/pct/pct6.jpg', specs: JSON.stringify(['2/3/4/5位规格齐全', '免螺丝快速连接', 'P02灯具专用', '按压式操作简便'])},
        {name: 'PCT-412/413快速接线端子', category: 'pct', image: 'images/products/pct/pct7.jpg', specs: JSON.stringify(['二通/三通设计', '家装电线接头专用', '灯具分线端子', '快速接线器精品'])},
        {name: 'JM-15一进五出快速接线端子', category: 'pct', image: 'images/products/pct/pct8.jpg', specs: JSON.stringify(['一进五出设计', '软硬线通用', '多路分线神器', '家装工程必备'])},
        // PT导轨系列
        {name: 'UKK导轨式分线盒', category: 'pt', image: 'images/products/pt/pt1.jpg', specs: JSON.stringify(['80A/125A/160A/250A/400A/500A多规格', '一进多出接线设计', '35mm标准导轨安装', '大电流分线专用'])},
        {name: 'PT2.5免工具直插式端子', category: 'pt', image: 'images/products/pt/pt2.jpg', specs: JSON.stringify(['免工具弹簧连接', '2.5mm平方适用', '组合型轨道式设计', '快速直插接线'])},
        {name: 'MRK大电流导轨式端子', category: 'pt', image: 'images/products/pt/pt3.jpg', specs: JSON.stringify(['大电流大平方设计', '导轨式安装', '工业级品质', '重载连接专用'])},
        {name: 'JH6-1.5/601接线端子排', category: 'pt', image: 'images/products/pt/pt4.jpg', specs: JSON.stringify(['2.5平方适用', '组合型导轨式设计', '电压接线专用', '轨道连接器'])},
        {name: 'ST2.5DIO-LR元件端子', category: 'pt', image: 'images/products/pt/pt5.jpg', specs: JSON.stringify(['带集成二极管', '纯铜阻燃材质', '导轨式安装', '电子元件专用'])},
        {name: 'PT免螺丝直通弹簧端子', category: 'pt', image: 'images/products/pt/pt6.jpg', specs: JSON.stringify(['2.5-10mm平方适用', '35mm导轨安装', '免工具直插', '弹簧连接快速接线'])},
        {name: 'STTB-2.5双层接线端子', category: 'pt', image: 'images/products/pt/pt7.jpg', specs: JSON.stringify(['上下双层设计', '2.5mm平方适用', '二进二出连接', '弹簧式快速接线'])},
        {name: 'PTTB2.5PE双层弹簧接地端子', category: 'pt', image: 'images/products/pt/pt8.jpg', specs: JSON.stringify(['双层弹簧接地设计', '2.5mm平方适用', '免工具快速直插', '35mm标准导轨安装'])},
        // 防水航空插座
        {name: '户外防水接线端子', category: 'aviation', image: 'images/products/aviation/aviation1.jpg', specs: JSON.stringify(['2进2出接线设计', '防雨地埋适用', '冷压电缆接线', '户外专用防水'])},
        {name: 'IP68防水接线端子', category: 'aviation', image: 'images/products/aviation/aviation2.jpg', specs: JSON.stringify(['IP68级防水标准', '路灯防雨专用', '可地埋可泡水', '2P/3P规格可选'])},
        {name: '户外防水电缆接线端子', category: 'aviation', image: 'images/products/aviation/aviation3.jpg', specs: JSON.stringify(['2进2出接线方式', '防雨地埋设计', '冷压电缆连接', '户外工程专用'])},
        {name: 'IP68防水塑料接线盒', category: 'aviation', image: 'images/products/aviation/aviation4.jpg', specs: JSON.stringify(['IP68级防水标准', '地埋防水设计', '室外路灯专用', '密封分线保护'])},
        {name: '防水盒连接器', category: 'aviation', image: 'images/products/aviation/aviation5.jpg', specs: JSON.stringify(['IP68级防水', '户外拔插式接头', '防雨地埋适用', '快速接线设计'])},
        {name: '灌胶式防水接线端子', category: 'aviation', image: 'images/products/aviation/aviation6.jpg', specs: JSON.stringify(['CDF-B系列灌胶密封', '一进二出/二进二出', '多规格可选', '灌胶防水保护'])},
        {name: '防水盒快速接线端子', category: 'aviation', image: 'images/products/aviation/aviation7.jpg', specs: JSON.stringify(['IP68级防水标准', '2/3/4芯可选', '户外接头专用', '地埋对接设计'])},
        {name: '免焊对接防水航空插头', category: 'aviation', image: 'images/products/aviation/aviation8.jpg', specs: JSON.stringify(['公母对插设计', '免焊接快速接线', '防水防尘保护', '多芯连接器'])},
        // 热缩管中间端子
        {name: '盒装彩色热缩管', category: 'heatshrink', image: 'images/products/heatshrink/heatshrink1.jpg', specs: JSON.stringify(['2倍收缩PE材质', '热缩绝缘套管', '袋装/盒装多规格', '跨境电商热销'])},
        {name: 'SST焊锡环防水端子', category: 'heatshrink', image: 'images/products/heatshrink/heatshrink2.jpg', specs: JSON.stringify(['防水免压设计', '中间接管快接', '焊锡环热缩端子', '跨境专供品质'])},
        {name: 'BHT热缩防水中间端子50只', category: 'heatshrink', image: 'images/products/heatshrink/heatshrink3.jpg', specs: JSON.stringify(['热缩防水保护', '电线接头连接器', '绝缘冷压端子', '紫铜材质50只盒装'])},
        {name: 'BHT防水热缩中间端子200PCS', category: 'heatshrink', image: 'images/products/heatshrink/heatshrink4.jpg', specs: JSON.stringify(['绝缘阻燃尼龙材质', '快速接线端子', '200PCS大包装', '跨境电商热销'])},
        {name: 'BHT热缩防水端子270PCS', category: 'heatshrink', image: 'images/products/heatshrink/heatshrink5.jpg', specs: JSON.stringify(['热缩防水保护', '跨境电商货源', '亚马逊eBay热销', '270PCS盒装'])},
        {name: 'BHT热缩防水中间端子50只盒', category: 'heatshrink', image: 'images/products/heatshrink/heatshrink6.jpg', specs: JSON.stringify(['热缩防水设计', '电线接头连接器', '紫铜绝缘冷压', '50只/盒装'])},
        {name: 'T型接线器子弹头套装', category: 'heatshrink', image: 'images/products/heatshrink/heatshrink7.jpg', specs: JSON.stringify(['子弹头形冷压设计', '快速对接公母头', '电线接线端子', '连接器套装组合'])},
    ];

    const stmt = db.prepare(`INSERT INTO products (name, category, specs, image, sort_order) VALUES (?, ?, ?, ?, ?)`);
    products.forEach((p, i) => {
        stmt.run(p.name, p.category, p.specs, p.image, i);
    });
    stmt.finalize();

    // 初始化 Banner
    const banners = [
        {image: 'images/banner1.jpg', sort_order: 0},
        {image: 'images/banner2.jpg', sort_order: 1},
        {image: 'images/banner3.jpg', sort_order: 2},
        {image: 'images/banner4.jpg', sort_order: 3},
        {image: 'images/banner5.jpg', sort_order: 4},
    ];
    const bannerStmt = db.prepare(`INSERT INTO banners (image, sort_order, is_active) VALUES (?, ?, ?)`);
    banners.forEach(b => bannerStmt.run(b.image, b.sort_order, 1));
    bannerStmt.finalize();

    // 初始化设置
    const settings = [
        {key: 'company_name', value: '浙江精铭电子科技有限公司', label: '公司名称'},
        {key: 'company_slogan', value: '精制造 · 铭天下', label: '公司口号'},
        {key: 'contact_person', value: '李先生', label: '联系人'},
        {key: 'contact_phone', value: '13388575831', label: '联系电话'},
        {key: 'company_address', value: '浙江省乐清市柳市歧头工业区', label: '公司地址'},
        {key: 'work_time', value: '周一至周六 8:00 - 18:00', label: '工作时间'},
        {key: 'stat_sales', value: '10万+', label: '年销量'},
        {key: 'stat_customers', value: '500+', label: '合作客户'},
        {key: 'stat_experience', value: '20年', label: '行业经验'},
        {key: 'stat_specs', value: '100+', label: '产品规格'},
    ];
    const settingStmt = db.prepare(`INSERT INTO settings (key, value, label) VALUES (?, ?, ?)`);
    settings.forEach(s => settingStmt.run(s.key, s.value, s.label));
    settingStmt.finalize();

    // 初始化管理员 admin / jingming2024!
    const adminPassword = bcrypt.hashSync('jingming2024!', 10);
    db.run(`INSERT INTO admins (username, password_hash) VALUES (?, ?)`, ['admin', adminPassword]);

    console.log('数据库初始化完成');
}

// 初始化默认分类
function seedCategories() {
    const categories = [
        {name: '跨境电商盒装', slug: 'box', sort_order: 1},
        {name: '快速接线端子', slug: 'pct', sort_order: 2},
        {name: 'PT导轨系列', slug: 'pt', sort_order: 3},
        {name: '固定面板快速接线端子', slug: 'panel', sort_order: 4},
        {name: '防水航空插座', slug: 'aviation', sort_order: 5},
        {name: '热缩管中间端子', slug: 'heatshrink', sort_order: 6},
        {name: '空中对接快速接线端子', slug: 'air', sort_order: 7},
        {name: '贯通式大电流端子', slug: 'through', sort_order: 8},
        {name: '免破线快速接线端子', slug: 'wire-free', sort_order: 9},
        {name: '暗盒修复器', slug: 'box-repair', sort_order: 10},
        {name: '冷压端子+套盒', slug: 'crimp-box', sort_order: 11},
        {name: '弹簧式PT导轨端子', slug: 'spring-pt', sort_order: 12},
        {name: '冷压端子系列', slug: 'crimp', sort_order: 13},
        {name: '暗盒修复器系列', slug: 'box-repair-series', sort_order: 14},
        {name: '压线帽系列', slug: 'wire-cap', sort_order: 15},
        {name: '拔插式PCB端子', slug: 'pcb-plug', sort_order: 16},
        {name: '螺钉式PCB端子', slug: 'pcb-screw', sort_order: 17},
        {name: '栅栏式PCB端子', slug: 'pcb-fence', sort_order: 18},
        {name: '免螺丝式PCB端子', slug: 'pcb-spring', sort_order: 19},
        {name: '大电流螺钉式端子', slug: 'high-current', sort_order: 20},
        {name: '手柄式快速接线端子', slug: 'handle', sort_order: 21},
        {name: 'MCS免螺丝接线端子', slug: 'mcs', sort_order: 22},
        {name: '未分类', slug: 'uncategorized', sort_order: 99},
    ];
    const stmt = db.prepare(`INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)`);
    categories.forEach(c => stmt.run(c.name, c.slug, c.sort_order));
    stmt.finalize();
    console.log('默认分类初始化完成');
}

// 数据库操作方法
const dbMethods = {
    // 分类相关
    getAllCategories: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM categories ORDER BY sort_order, id', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    getCategoryBySlug: (slug) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM categories WHERE slug = ?', [slug], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    addCategory: (category) => {
        return new Promise((resolve, reject) => {
            const {name, slug, sort_order} = category;
            db.run(
                'INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)',
                [name, slug, sort_order || 0],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },
    updateCategory: (id, category) => {
        return new Promise((resolve, reject) => {
            const {name, slug, sort_order} = category;
            db.run(
                'UPDATE categories SET name = ?, slug = ?, sort_order = ? WHERE id = ?',
                [name, slug, sort_order, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    },
    deleteCategory: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM categories WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    // 产品相关
    getAllProducts: (category) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM products WHERE is_active = 1';
            let params = [];
            if (category && category !== 'all') {
                sql += ' AND category = ?';
                params.push(category);
            }
            sql += ' ORDER BY sort_order, id';
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    getProductById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    addProduct: (product) => {
        return new Promise((resolve, reject) => {
            const {name, category, specs, image, description, sort_order} = product;
            db.run(
                'INSERT INTO products (name, category, specs, image, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
                [name, category, specs, image, description, sort_order || 0],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },
    updateProduct: (id, product) => {
        return new Promise((resolve, reject) => {
            const {name, category, specs, image, description, sort_order, is_active} = product;
            db.run(
                'UPDATE products SET name = ?, category = ?, specs = ?, image = ?, description = ?, sort_order = ?, is_active = ? WHERE id = ?',
                [name, category, specs, image, description, sort_order, is_active, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    },
    deleteProduct: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    // Banner相关
    getAllBanners: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    // 设置相关
    getAllSettings: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM settings', [], (err, rows) => {
                if (err) reject(err);
                else {
                    const settings = {};
                    rows.forEach(r => settings[r.key] = r.value);
                    resolve(settings);
                }
            });
        });
    },
    getSettingsRaw: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM settings', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    updateSetting: (key, value) => {
        return new Promise((resolve, reject) => {
            db.run('UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?', [value, key], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    // 询盘相关
    addInquiry: (inquiry) => {
        return new Promise((resolve, reject) => {
            const {name, phone, email, company, product_name, quantity, message} = inquiry;
            db.run(
                'INSERT INTO inquiries (name, phone, email, company, product_name, quantity, message) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, phone, email, company, product_name, quantity, message],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },
    getAllInquiries: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM inquiries ORDER BY created_at DESC', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    getInquiryById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM inquiries WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    updateInquiryStatus: (id, status) => {
        return new Promise((resolve, reject) => {
            db.run('UPDATE inquiries SET status = ? WHERE id = ?', [status, id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },
    deleteInquiry: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM inquiries WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    // 管理员相关
    getAdminByUsername: (username) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM admins WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    updateLoginAttempts: (id, attempts, lockedUntil) => {
        return new Promise((resolve, reject) => {
            db.run('UPDATE admins SET login_attempts = ?, locked_until = ? WHERE id = ?', [attempts, lockedUntil, id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    // 统计
    getStats: () => {
        return new Promise((resolve, reject) => {
            db.get('SELECT COUNT(*) as productCount FROM products WHERE is_active = 1', (err1, row1) => {
                if (err1) return reject(err1);
                db.get('SELECT COUNT(*) as inquiryCount FROM inquiries WHERE status = "pending"', (err2, row2) => {
                    if (err2) return reject(err2);
                    resolve({
                        productCount: row1.productCount,
                        pendingInquiryCount: row2.inquiryCount
                    });
                });
            });
        });
    }
};

module.exports = { db, initDatabase, ...dbMethods };
