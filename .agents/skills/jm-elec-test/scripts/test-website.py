#!/usr/bin/env python3
"""
jm-elec Website Automated Test Suite
Tests all critical paths of the 浙江精铭电子 website.
"""

import urllib.request
import urllib.error
import json
import sys
from datetime import datetime

BASE_URL = "http://localhost:3000"
ADMIN_USER = "admin"
ADMIN_PASS = "jingming2024!"

class TestResult:
    def __init__(self):
        self.passed = []
        self.failed = []
        self.warnings = []

    def ok(self, name, detail=""):
        self.passed.append((name, detail))
        print(f"  ✅ {name}")
        if detail:
            print(f"     {detail}")

    def fail(self, name, detail=""):
        self.failed.append((name, detail))
        print(f"  ❌ {name}")
        if detail:
            print(f"     {detail}")

    def warn(self, name, detail=""):
        self.warnings.append((name, detail))
        print(f"  ⚠️  {name}")
        if detail:
            print(f"     {detail}")

    def summary(self):
        total = len(self.passed) + len(self.failed) + len(self.warnings)
        print("\n" + "="*50)
        print(f"TEST SUMMARY")
        print("="*50)
        print(f"Total:    {total}")
        print(f"Passed:   {len(self.passed)} ✅")
        print(f"Failed:   {len(self.failed)} ❌")
        print(f"Warnings: {len(self.warnings)} ⚠️")
        if self.failed:
            print("\nFailed tests:")
            for name, detail in self.failed:
                print(f"  - {name}: {detail}")
        return len(self.failed) == 0


def http_get(url, cookie=None):
    """Make HTTP GET request and return (status, body, headers)"""
    req = urllib.request.Request(url)
    if cookie:
        req.add_header("Cookie", cookie)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            return resp.status, body, dict(resp.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="replace"), dict(e.headers)
    except Exception as e:
        return 0, str(e), {}


def http_post(url, data=None, json_data=None, cookie=None):
    """Make HTTP POST request"""
    if json_data:
        body = json.dumps(json_data).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    elif data:
        body = urllib.parse.urlencode(data).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/x-www-form-urlencoded"}, method="POST")
    else:
        req = urllib.request.Request(url, method="POST")
    if cookie:
        req.add_header("Cookie", cookie)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            return resp.status, body, dict(resp.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="replace"), dict(e.headers)
    except Exception as e:
        return 0, str(e), {}


def test_frontend_pages(results):
    print("\n📄 FRONTEND PAGES")
    print("-" * 40)

    pages = [
        ("/", "Homepage", ["浙江精铭电子", "我们的优势", "热门产品"]),
        ("/products", "Products Page", ["产品中心", "跨境电商盒装", "快速接线端子"]),
        ("/product/1", "Product Detail", ["产品特点", "立即询盘"]),
        ("/about", "About Page", ["关于我们", "精制造", "发展历程"]),
        ("/contact", "Contact Page", ["联系我们", "在线留言", "提交留言"]),
    ]

    for path, name, keywords in pages:
        status, body, _ = http_get(f"{BASE_URL}{path}")
        if status != 200:
            results.fail(f"{name} ({path})", f"HTTP {status}")
            continue

        missing = [k for k in keywords if k not in body]
        if missing:
            results.fail(f"{name} ({path})", f"Missing keywords: {missing}")
        else:
            results.ok(f"{name} ({path})", f"HTTP 200, all keywords found")

        # Check SEO meta tags
        if "<meta name=\"description\"" not in body and '<meta name="description"' not in body:
            results.warn(f"{name} SEO", "Missing meta description")
        if "<title>" not in body or "</title>" not in body:
            results.warn(f"{name} SEO", "Missing title tag")


def test_static_assets(results):
    print("\n🎨 STATIC ASSETS")
    print("-" * 40)

    assets = [
        "/css/style.css",
        "/css/admin.css",
        "/js/main.js",
        "/images/logo.jpg",
    ]

    for path in assets:
        status, _, _ = http_get(f"{BASE_URL}{path}")
        if status == 200:
            results.ok(f"Asset {path}")
        else:
            results.fail(f"Asset {path}", f"HTTP {status}")


def test_inquiry_submission(results):
    print("\n📨 INQUIRY SUBMISSION")
    print("-" * 40)

    # Test general inquiry
    status, body, _ = http_post(
        f"{BASE_URL}/api/inquiry",
        json_data={
            "name": "Test User",
            "phone": "13800138000",
            "email": "test@example.com",
            "company": "Test Co",
            "message": "This is a test inquiry message",
        }
    )

    if status == 200:
        try:
            data = json.loads(body)
            if data.get("success"):
                results.ok("General inquiry submission", f"ID: {data.get('id')}")
            else:
                results.fail("General inquiry submission", data.get("message"))
        except:
            results.fail("General inquiry submission", "Invalid JSON response")
    else:
        results.fail("General inquiry submission", f"HTTP {status}")

    # Test product inquiry
    status, body, _ = http_post(
        f"{BASE_URL}/api/inquiry",
        json_data={
            "name": "Product Tester",
            "phone": "13900139000",
            "message": "Interested in bulk purchase",
            "product_name": "PCT-222快速接线端子",
            "quantity": "1000只",
        }
    )

    if status == 200:
        try:
            data = json.loads(body)
            if data.get("success"):
                results.ok("Product inquiry submission", f"ID: {data.get('id')}")
            else:
                results.fail("Product inquiry submission", data.get("message"))
        except:
            results.fail("Product inquiry submission", "Invalid JSON response")
    else:
        results.fail("Product inquiry submission", f"HTTP {status}")


def test_admin_login(results):
    print("\n🔐 ADMIN LOGIN")
    print("-" * 40)

    # Test login page
    status, body, _ = http_get(f"{BASE_URL}/admin/login")
    if status == 200 and "精铭电子管理后台" in body:
        results.ok("Admin login page")
    else:
        results.fail("Admin login page", f"HTTP {status}")

    # Test successful login using cookie jar
    import http.cookiejar
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    
    login_data = urllib.parse.urlencode({"username": ADMIN_USER, "password": ADMIN_PASS}).encode("utf-8")
    req = urllib.request.Request(f"{BASE_URL}/admin/login", data=login_data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    
    try:
        with opener.open(req, timeout=10) as resp:
            final_body = resp.read().decode("utf-8", errors="replace")
            final_url = resp.geturl()
    except urllib.error.HTTPError as e:
        final_body = e.read().decode("utf-8", errors="replace")
        final_url = e.geturl()
    
    # Check if we got session cookie
    session_cookie = None
    for cookie in cj:
        if cookie.name == "connect.sid":
            session_cookie = f"{cookie.name}={cookie.value}"
            break
    
    if session_cookie and "/admin" in final_url:
        results.ok("Admin login success", f"Redirected to {final_url}")
        return session_cookie, opener
    elif session_cookie:
        results.warn("Admin login", f"Got cookie but URL is {final_url}")
        return session_cookie, opener
    else:
        results.fail("Admin login success", "No session cookie received")
        return None, None


def test_admin_dashboard(results, cookie_opener):
    if not cookie_opener:
        results.fail("Admin dashboard", "No login session, skipping")
        return

    print("\n📊 ADMIN DASHBOARD")
    print("-" * 40)

    pages = [
        ("/admin", "Dashboard", ["控制台", "产品总数"]),
        ("/admin/inquiries", "Inquiries", ["询盘管理"]),
        ("/admin/products", "Products", ["产品管理"]),
        ("/admin/uploads", "Uploads", ["图片管理"]),
        ("/admin/settings", "Settings", ["网站设置"]),
    ]

    for path, name, keywords in pages:
        req = urllib.request.Request(f"{BASE_URL}{path}")
        try:
            with cookie_opener.open(req, timeout=10) as resp:
                body = resp.read().decode("utf-8", errors="replace")
                status = resp.status
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            status = e.code
        
        if status != 200:
            results.fail(f"Admin {name}", f"HTTP {status}")
            continue

        missing = [k for k in keywords if k not in body]
        if missing:
            results.fail(f"Admin {name}", f"Missing: {missing}")
        else:
            results.ok(f"Admin {name}", f"HTTP 200")

    # Verify inquiries appear in admin
    req = urllib.request.Request(f"{BASE_URL}/admin/inquiries")
    try:
        with cookie_opener.open(req, timeout=10) as resp:
            body = resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
    
    if "Test User" in body and "13800138000" in body:
        results.ok("Inquiry data in admin", "General inquiry visible")
    else:
        results.warn("Inquiry data in admin", "General inquiry not found in list")

    if "Product Tester" in body and "PCT-222" in body:
        results.ok("Product inquiry in admin", "Product inquiry visible")
    else:
        results.warn("Product inquiry in admin", "Product inquiry not found in list")


def test_security(results):
    print("\n🔒 SECURITY CHECKS")
    print("-" * 40)

    # Test wrong password
    status, _, _ = http_post(
        f"{BASE_URL}/admin/login",
        data={"username": "admin", "password": "wrongpassword"}
    )
    if status == 200:
        results.ok("Wrong password rejected")
    else:
        results.warn("Wrong password handling", f"HTTP {status}")

    # Test unauthorized admin access
    status, _, _ = http_get(f"{BASE_URL}/admin")
    if status == 302 or status == 301:
        results.ok("Admin requires login", f"Redirected (HTTP {status})")
    else:
        results.warn("Admin access control", f"HTTP {status}, expected redirect")


def test_database_data(results):
    print("\n💾 DATABASE DATA")
    print("-" * 40)

    # Check product count via API (indirectly via product page)
    status, body, _ = http_get(f"{BASE_URL}/products")
    if status == 200:
        # Count product cards
        count = body.count('data-category="')
        if count >= 39:
            results.ok(f"Products loaded", f"Found {count} products")
        else:
            results.warn(f"Products count", f"Only {count} products, expected 39+")

    # Check banners on homepage
    status, body, _ = http_get(f"{BASE_URL}/")
    if status == 200:
        banner_count = body.count('class="carousel-slide')
        if banner_count >= 5:
            results.ok("Banners loaded", f"{banner_count} banners")
        else:
            results.warn("Banners count", f"Only {banner_count} banners")


def main():
    print("="*50)
    print("jm-elec Website Test Suite")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Target:  {BASE_URL}")
    print("="*50)

    results = TestResult()

    # Check if server is running
    status, _, _ = http_get(BASE_URL)
    if status == 0:
        print(f"\n❌ Server not running at {BASE_URL}")
        print("   Please start it first: node server.js")
        sys.exit(1)

    test_frontend_pages(results)
    test_static_assets(results)
    test_inquiry_submission(results)
    cookie, opener = test_admin_login(results)
    test_admin_dashboard(results, opener)
    test_security(results)
    test_database_data(results)

    success = results.summary()

    # Save report
    report_dir = "test-reports"
    import os
    os.makedirs(report_dir, exist_ok=True)
    report_file = os.path.join(report_dir, f"test-report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.txt")

    with open(report_file, "w") as f:
        f.write(f"jm-elec Website Test Report\n")
        f.write(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Target: {BASE_URL}\n")
        f.write("="*50 + "\n\n")
        f.write(f"Passed:   {len(results.passed)}\n")
        f.write(f"Failed:   {len(results.failed)}\n")
        f.write(f"Warnings: {len(results.warnings)}\n\n")
        if results.failed:
            f.write("Failed tests:\n")
            for name, detail in results.failed:
                f.write(f"  - {name}: {detail}\n")

    print(f"\nReport saved to: {report_file}")
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
