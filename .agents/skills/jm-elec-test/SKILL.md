---
name: jm-elec-test
description: Test automation skill for the jm-elec website (浙江精铭电子科技有限公司). Use when the user wants to test, verify, or validate any functionality of the jm-elec website including frontend pages, admin dashboard, inquiry forms, product management, and image uploads.
---

# jm-elec Website Test Skill

This skill provides automated testing and manual verification checklists for the jm-elec website.

## Quick Start

Run the automated test script:
```bash
python .agents/skills/jm-elec-test/scripts/test-website.py
```

The script tests all critical paths and outputs a report.

## Manual Verification Checklist

When automated testing is insufficient, verify these items manually:

### Frontend Pages
- [ ] Homepage loads with carousel, features, hot products, stats
- [ ] Product list page filters by category correctly
- [ ] Product detail page shows image, specs, inquiry button
- [ ] About page shows timeline and factory gallery
- [ ] Contact page form submits and saves to database
- [ ] Mobile hamburger menu opens and closes
- [ ] Breadcrumb navigation visible on all sub-pages
- [ ] Footer copyright year is current year
- [ ] All images load correctly (no 404)

### Inquiry Functionality
- [ ] Product page "立即询盘" button opens modal
- [ ] Modal pre-fills product name
- [ ] Inquiry form submits successfully
- [ ] Submitted inquiry appears in admin panel

### Admin Dashboard
- [ ] Login with admin/jingming2024! succeeds
- [ ] Dashboard shows product count and pending inquiries
- [ ] Inquiry management lists all inquiries
- [ ] Can mark inquiry as processed/unprocessed
- [ ] Product management CRUD works
- [ ] Image upload works and shows preview
- [ ] Website settings save and reflect on frontend

### SEO & Performance
- [ ] Each page has unique title and meta description
- [ ] Images have loading="lazy" attribute
- [ ] No console errors in browser dev tools

## Test Reports

Save test output to `test-reports/` directory with timestamp.
