const { webkit, devices } = require('playwright');

(async () => {
  const iPhone = devices['iPhone 14'];
  const browser = await webkit.launch({ headless: false });
  const context = await browser.newContext({
    ...iPhone,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });

  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();

  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('requestfailed', req => {
    const failure = req.failure();
    console.log('REQUEST FAILED:', req.url(), failure?.errorText);
  });
  page.on('response', res => {
    if (res.status() >= 400) {
      console.log('RESPONSE:', res.status(), res.url());
    }
  });

  page.on('crash', async () => {
    console.log('PAGE CRASHED');
    await page.screenshot({ path: 'crash.png', fullPage: true }).catch(() => {});
    await context.tracing.stop({ path: 'trace.zip' }).catch(() => {});
  });

  await page.goto('https://www.google.com', {
    waitUntil: 'networkidle',
    timeout: 120000,
  });

  await page.waitForTimeout(10 * 60 * 1000);
  await context.tracing.stop({ path: 'trace.zip' });
  await browser.close();
})();