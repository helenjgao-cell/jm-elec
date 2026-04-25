// 多语言支持
const i18n = {
    zh: {
        // 导航
        nav_home: '首页',
        nav_about: '关于我们',
        nav_products: '产品中心',
        nav_contact: '联系我们',
        lang_label: '语言',

        // 首页
        advantage_title: '我们的优势',
        adv_factory: '工厂直销',
        adv_factory_desc: '源头厂家，品质保证，价格更具竞争力',
        adv_quality: '质量认证',
        adv_quality_desc: '通过ISO9001质量管理体系认证，产品符合国际标准',
        adv_fast: '快速发货',
        adv_fast_desc: '月均发货速度2天，库存充足，极速响应',
        adv_cross: '跨境供应',
        adv_cross_desc: '支持跨境电商平台，提供定制化包装服务',
        hot_products: '热门产品',
        view_all: '查看全部产品',
        stat_sales: '年销量',
        stat_customers: '合作客户',
        stat_experience: '行业经验',
        stat_specs: '产品规格',
        contact_title: '联系我们',
        contact_cta: '欢迎来电咨询，我们期待与您的合作！',
        contact_btn: '立即咨询',

        // 产品页
        products_title: '产品中心',
        products_subtitle: '专业电气连接产品，品质保证',
        filter_all: '全部产品',
        filter_box: '跨境电商盒装',
        filter_pct: '快速接线端子',
        filter_pt: 'PT导轨系列',
        filter_aviation: '防水航空插座',
        filter_heatshrink: '热缩管中间端子',
        inquiry_btn: '立即询盘',
        inquiry_modal_title: '产品询盘',
        inquiry_product: '询盘产品',
        inquiry_name: '您的姓名',
        inquiry_phone: '联系电话',
        inquiry_email: '电子邮箱',
        inquiry_company: '公司名称',
        inquiry_qty: '采购数量',
        inquiry_message: '留言内容',
        inquiry_submit: '提交询盘',
        inquiry_placeholder: '请描述您的需求...',
        qty_placeholder: '如：1000只',
        custom_service: '需要定制产品？',
        custom_desc: '我们支持OEM/ODM定制服务，可根据您的需求开发专属产品',
        custom_btn: '联系定制',

        // 产品详情
        product_features: '产品特点',
        product_desc: '产品说明',
        related_products: '相关产品',
        back_list: '返回列表',

        // 关于我们
        about_title: '关于我们',
        about_subtitle: '二十年专注电气连接解决方案',
        about_slogan: '精制造 · 铭天下',
        about_p1: '浙江精铭电子科技有限公司成立于2004年，坐落于素有"中国电器之都"美誉的浙江省乐清市柳市镇。公司专注于电气连接产品的研发、生产和销售，是国内领先的接线端子制造商之一。',
        about_p2: '二十年来，我们始终坚持"精益求精、铭刻品质"的经营理念，不断引进先进生产设备，完善质量管理体系，现已发展成为集研发、生产、销售于一体的现代化企业。',
        about_p3: '公司拥有完善的生产线和检测设备，产品涵盖快速接线端子、LED免焊接端子、冷压端子、导轨式弹簧端子等多个系列，广泛应用于建筑电气、LED照明、家用电器、工业自动化等领域。',
        values_title: '企业价值观',
        val_quality: '品质为本',
        val_quality_desc: '严格执行ISO9001质量管理体系，从原材料采购到成品出厂，每个环节都严格把控，确保产品质量稳定可靠。',
        val_customer: '客户至上',
        val_customer_desc: '以客户需求为导向，提供个性化定制服务，快速响应客户反馈，建立长期稳定的合作关系。',
        val_innovation: '持续创新',
        val_innovation_desc: '不断投入研发力量，紧跟行业发展趋势，开发新产品、新工艺，为客户提供更优质的连接解决方案。',
        history_title: '发展历程',
        hist_2004: '公司成立',
        hist_2004_desc: '浙江精铭电子科技有限公司正式成立，开始从事接线端子产品的研发与生产。',
        hist_2010: '规模扩张',
        hist_2010_desc: '扩大生产规模，引进自动化生产线，年产能突破5000万只。',
        hist_2015: '品质认证',
        hist_2015_desc: '通过ISO9001质量管理体系认证，产品品质获得国际认可。',
        hist_2020: '跨境电商',
        hist_2020_desc: '开拓跨境电商业务，产品远销欧美、东南亚等国家和地区。',
        hist_2024: '全新起点',
        hist_2024_desc: '持续创新，致力于成为全球领先的电气连接解决方案提供商。',

        // 联系我们
        contact_page_title: '联系我们',
        contact_page_subtitle: '期待与您的合作',
        form_title: '在线留言',
        form_name: '您的姓名',
        form_phone: '联系电话',
        form_email: '电子邮箱',
        form_company: '公司名称',
        form_message: '留言内容',
        form_placeholder: '请描述您的需求，如产品型号、数量、用途等...',
        form_submit: '提交留言',
        info_title: '联系方式',
        info_phone: '电话咨询',
        info_address: '公司地址',
        info_company: '公司名称',
        info_worktime: '工作时间',
        biz_title: '业务合作',
        biz_wholesale: '批发采购',
        biz_wholesale_desc: '欢迎各大电商平台、贸易公司洽谈合作',
        biz_custom: '定制开发',
        biz_custom_desc: '支持OEM/ODM，可根据需求定制产品',
        biz_cross: '跨境供应',
        biz_cross_desc: '支持亚马逊、速卖通等跨境电商平台供货',

        // Footer
        footer_slogan: '精制造 · 铭天下',
        footer_desc: '专业接线端子制造商',
        quick_links: '快速链接',
        contact_info: '联系方式',
        copyright: '版权所有',
        icp: '浙ICP备XXXXXXXX号-1',
    },
    en: {
        // Nav
        nav_home: 'Home',
        nav_about: 'About',
        nav_products: 'Products',
        nav_contact: 'Contact',
        lang_label: 'Language',

        // Home
        advantage_title: 'Our Advantages',
        adv_factory: 'Factory Direct',
        adv_factory_desc: 'Source manufacturer, quality assurance, more competitive prices',
        adv_quality: 'Quality Certified',
        adv_quality_desc: 'ISO9001 certified, products meet international standards',
        adv_fast: 'Fast Delivery',
        adv_fast_desc: 'Average 2-day shipping, sufficient stock, rapid response',
        adv_cross: 'Cross-border Supply',
        adv_cross_desc: 'Support cross-border e-commerce platforms with customized packaging',
        hot_products: 'Hot Products',
        view_all: 'View All Products',
        stat_sales: 'Annual Sales',
        stat_customers: 'Partners',
        stat_experience: 'Years Experience',
        stat_specs: 'Product Specs',
        contact_title: 'Contact Us',
        contact_cta: 'Welcome to inquire, we look forward to cooperating with you!',
        contact_btn: 'Contact Now',

        // Products
        products_title: 'Products',
        products_subtitle: 'Professional Electrical Connection Products, Quality Guaranteed',
        filter_all: 'All Products',
        filter_box: 'Cross-border Box Sets',
        filter_pct: 'Quick Wire Connectors',
        filter_pt: 'PT DIN Rail Series',
        filter_aviation: 'Waterproof Connectors',
        filter_heatshrink: 'Heat Shrink Terminals',
        inquiry_btn: 'Inquiry Now',
        inquiry_modal_title: 'Product Inquiry',
        inquiry_product: 'Product',
        inquiry_name: 'Your Name',
        inquiry_phone: 'Phone',
        inquiry_email: 'Email',
        inquiry_company: 'Company',
        inquiry_qty: 'Quantity',
        inquiry_message: 'Message',
        inquiry_submit: 'Submit Inquiry',
        inquiry_placeholder: 'Please describe your needs...',
        qty_placeholder: 'e.g. 1000 pcs',
        custom_service: 'Need Custom Products?',
        custom_desc: 'We support OEM/ODM services, developing exclusive products according to your needs',
        custom_btn: 'Contact for Customization',

        // Product detail
        product_features: 'Product Features',
        product_desc: 'Description',
        related_products: 'Related Products',
        back_list: 'Back to List',

        // About
        about_title: 'About Us',
        about_subtitle: '20 Years Focused on Electrical Connection Solutions',
        about_slogan: 'Excellence in Manufacturing',
        about_p1: 'Founded in 2004, Zhejiang Jingming Electronic Technology Co., Ltd. is located in Liushi Town, Yueqing City, Zhejiang Province, known as the "Capital of Electrical Appliances in China". The company specializes in the R&D, production and sales of electrical connection products, and is one of the leading terminal block manufacturers in China.',
        about_p2: 'For twenty years, we have always adhered to the business philosophy of "Excellence in Manufacturing, Quality Engraved", continuously introducing advanced production equipment and improving quality management systems. We have now developed into a modern enterprise integrating R&D, production and sales.',
        about_p3: 'The company has complete production lines and testing equipment. Products cover quick wire connectors, LED solderless terminals, crimp terminals, DIN rail spring terminals and other series, widely used in building electrical, LED lighting, household appliances, industrial automation and other fields.',
        values_title: 'Corporate Values',
        val_quality: 'Quality First',
        val_quality_desc: 'Strictly implement ISO9001 quality management system, strictly control every link from raw material procurement to finished product delivery to ensure stable and reliable product quality.',
        val_customer: 'Customer Oriented',
        val_customer_desc: 'Oriented by customer needs, provide personalized customization services, respond quickly to customer feedback, and establish long-term stable cooperative relationships.',
        val_innovation: 'Continuous Innovation',
        val_innovation_desc: 'Continuously invest in R&D, keep up with industry development trends, develop new products and processes, and provide customers with better connection solutions.',
        history_title: 'Development History',
        hist_2004: 'Founded',
        hist_2004_desc: 'Zhejiang Jingming Electronic Technology Co., Ltd. was formally established and began R&D and production of terminal block products.',
        hist_2010: 'Scale Expansion',
        hist_2010_desc: 'Expanded production scale, introduced automated production lines, annual production capacity exceeded 50 million units.',
        hist_2015: 'Quality Certification',
        hist_2015_desc: 'Passed ISO9001 quality management system certification, product quality recognized internationally.',
        hist_2020: 'Cross-border E-commerce',
        hist_2020_desc: 'Developed cross-border e-commerce business, products exported to Europe, America, Southeast Asia and other countries and regions.',
        hist_2024: 'New Starting Point',
        hist_2024_desc: 'Continuous innovation, committed to becoming a global leading provider of electrical connection solutions.',

        // Contact
        contact_page_title: 'Contact Us',
        contact_page_subtitle: 'Looking Forward to Cooperating with You',
        form_title: 'Online Message',
        form_name: 'Your Name',
        form_phone: 'Phone Number',
        form_email: 'Email',
        form_company: 'Company Name',
        form_message: 'Message',
        form_placeholder: 'Please describe your needs, such as product model, quantity, usage, etc.',
        form_submit: 'Submit Message',
        info_title: 'Contact Information',
        info_phone: 'Phone',
        info_address: 'Address',
        info_company: 'Company',
        info_worktime: 'Working Hours',
        biz_title: 'Business Cooperation',
        biz_wholesale: 'Wholesale',
        biz_wholesale_desc: 'Welcome major e-commerce platforms and trading companies to discuss cooperation',
        biz_custom: 'Custom Development',
        biz_custom_desc: 'Support OEM/ODM, products can be customized according to needs',
        biz_cross: 'Cross-border Supply',
        biz_cross_desc: 'Support Amazon, AliExpress and other cross-border e-commerce platforms',

        // Footer
        footer_slogan: 'Excellence in Manufacturing',
        footer_desc: 'Professional Terminal Block Manufacturer',
        quick_links: 'Quick Links',
        contact_info: 'Contact Info',
        copyright: 'All Rights Reserved',
        icp: 'Zhejiang ICP No. XXXXXXXX-1',
    }
};

let currentLang = localStorage.getItem('jm-lang') || 'zh';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('jm-lang', lang);
    applyLanguage();
    updateLangSelector();
}

function applyLanguage() {
    const dict = i18n[currentLang];
    if (!dict) return;

    // 处理所有 data-i18n 元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.getAttribute('data-i18n-attr') === 'placeholder') {
                    el.placeholder = dict[key];
                } else {
                    el.value = dict[key];
                }
            } else {
                el.textContent = dict[key];
            }
        }
    });

    // 处理 data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key];
    });

    // 处理页面标题
    const titleEl = document.querySelector('[data-i18n-page-title]');
    if (titleEl && dict[titleEl.getAttribute('data-i18n-page-title')]) {
        document.title = dict[titleEl.getAttribute('data-i18n-page-title')];
    }
}

function updateLangSelector() {
    const selector = document.getElementById('langSelector');
    if (selector) selector.value = currentLang;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    applyLanguage();
    updateLangSelector();
});
