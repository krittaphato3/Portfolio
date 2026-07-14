import { chromium } from 'playwright';

async function testPortfolio() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  const warnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
    if (msg.type() === 'warning') warnings.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log('🔍 Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 20000 });
  console.log('📄 Page Title:', await page.title());
  await page.waitForTimeout(3000);

  // ─── Console ───
  console.log('\n═══════════════════════════════════════');
  console.log('  CONSOLE ERRORS:', errors.length);
  console.log('═══════════════════════════════════════');
  errors.forEach((e, i) => console.log(`  ❌ ${i+1}. ${e.substring(0, 300)}`));
  if (errors.length === 0) console.log('  ✅ Zero errors');

  console.log('\n═══════════════════════════════════════');
  console.log('  CONSOLE WARNINGS:', warnings.length);
  console.log('═══════════════════════════════════════');
  warnings.forEach((w, i) => console.log(`  ⚠️ ${i+1}. ${w.substring(0, 300)}`));
  if (warnings.length === 0) console.log('  ✅ Zero warnings');

  // ─── UI Element Check ───
  console.log('\n═══════════════════════════════════════');
  console.log('  UI ELEMENT CHECK');
  console.log('═══════════════════════════════════════');

  const checks = [
    { name: 'Header', selector: 'header' },
    { name: 'Profile name', selector: 'text=Krittaphat' },
    { name: 'Location Bangkok', selector: 'text=Bangkok' },
    { name: 'Total Projects stat', selector: 'text=Total Projects' },
    { name: 'Certifications stat', selector: 'text=Certifications' },
    { name: 'Languages stat', selector: 'text=Languages' },
    { name: 'Feature Work section', selector: 'text=Feature Work' },
    { name: 'Recent Updates section', selector: 'text=Recent Updates' },
    { name: 'Skills section', selector: 'text=Technical Expertise' },
    { name: 'Cert Panel', selector: 'text=All Certificates' },
    { name: 'Theme toggle', selector: 'button >> nth=0' },
    { name: 'Portfolio Command Center', selector: 'text=Portfolio Command Center' },
  ];

  for (const check of checks) {
    const el = await page.$(check.selector);
    console.log(`  ${el ? '✅' : '❌'} ${check.name}`);
  }

  // ─── Feature Work Links ───
  console.log('\n═══════════════════════════════════════');
  console.log('  FEATURE WORK LINKS');
  console.log('═══════════════════════════════════════');
  const ghLinks = await page.$$('a[href*="github.com/krittaphato3"]');
  console.log(`  Found ${ghLinks.length} GitHub profile links`);
  for (const link of ghLinks.slice(0, 3)) {
    const href = await link.getAttribute('href');
    const text = await link.textContent();
    console.log(`    → ${text?.trim().substring(0, 40)} → ${href}`);
  }

  // ─── Certificate Panel ───
  console.log('\n═══════════════════════════════════════');
  console.log('  CERTIFICATE PANEL');
  console.log('═══════════════════════════════════════');
  const certTabs = await page.$$('[role="tab"]');
  console.log(`  Category tabs: ${certTabs.length}`);
  for (const tab of certTabs) {
    const text = await tab.textContent();
    const selected = await tab.getAttribute('aria-selected');
    console.log(`    → ${text?.trim()} ${selected === 'true' ? '(active)' : ''}`);
  }

  // Check size selector buttons
  const sizeBtns = await page.$$('button >> text=/^[SML]$/');
  console.log(`  Size selector buttons: ${sizeBtns.length}`);

  // Check View All
  const viewAll = await page.$('button:has-text("View All"), button:has-text("Show All")');
  console.log(`  View All button: ${viewAll ? '✅' : '❌'}`);

  // ─── Theme Test ───
  console.log('\n═══════════════════════════════════════');
  console.log('  THEME TOGGLE TEST');
  console.log('═══════════════════════════════════════');
  const htmlBefore = await page.evaluate(() => document.documentElement.className);
  console.log(`  Before: "${htmlBefore || '(no class)'}"`);

  // Find theme toggle - it's the button with sun/moon icon in the header
  const headerBtns = await page.$$('header button');
  for (const btn of headerBtns) {
    const label = await btn.getAttribute('aria-label');
    if (label && label.toLowerCase().includes('theme')) {
      await btn.click();
      await page.waitForTimeout(500);
      const htmlAfter = await page.evaluate(() => document.documentElement.className);
      console.log(`  After:  "${htmlAfter || '(no class)'}"`);
      console.log(`  ${htmlBefore !== htmlAfter ? '✅ Theme changed' : '⚠️ Theme class same'}`);
      break;
    }
  }

  // ─── Search Modal ───
  console.log('\n═══════════════════════════════════════');
  console.log('  SEARCH MODAL (Ctrl+K)');
  console.log('═══════════════════════════════════════');
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(500);
  const searchModal = await page.$('[role="dialog"]');
  console.log(`  Modal opened: ${searchModal ? '✅' : '❌'}`);
  if (searchModal) {
    const input = await page.$('[role="dialog"] input');
    console.log(`  Search input: ${input ? '✅' : '❌'}`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // ─── Screenshots ───
  console.log('\n═══════════════════════════════════════');
  console.log('  SCREENSHOTS');
  console.log('═══════════════════════════════════════');
  await page.screenshot({ path: 'D:/Portfolio/test-desktop.png', fullPage: true });
  console.log('  📸 Desktop (1440px): test-desktop.png');

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'D:/Portfolio/test-tablet.png', fullPage: true });
  console.log('  📸 Tablet (768px): test-tablet.png');

  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'D:/Portfolio/test-mobile.png', fullPage: true });
  console.log('  📸 Mobile (375px): test-mobile.png');

  await browser.close();
  console.log('\n✅ Full audit complete!');
}

testPortfolio().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
