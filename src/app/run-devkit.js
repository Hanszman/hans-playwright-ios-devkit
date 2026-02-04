const { askRunConfig } = require('../cli/prompt');
const { createBrowser, createContext } = require('../browser/context');
const { registerPageEvents } = require('../browser/events');
const { NAVIGATION_TIMEOUT_MS, RUN_TIMEOUT_MS } = require('../config/constants');

async function runDevkit() {
  const runConfig = await askRunConfig();

  console.log('\nStarting WebKit with:');
  console.log(`- Device: ${runConfig.deviceName}`);
  console.log(`- Orientation: ${runConfig.isLandscape ? 'Landscape' : 'Portrait'}`);
  console.log(`- URL: ${runConfig.url}`);

  const browser = await createBrowser();

  try {
    const context = await createContext(browser, runConfig);

    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

    const page = await context.newPage();

    await registerPageEvents(page, context);

    await page.goto(runConfig.url, {
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT_MS,
    });

    await page.waitForTimeout(RUN_TIMEOUT_MS);
    await context.tracing.stop({ path: 'trace.zip' });
  } finally {
    await browser.close();
  }
}

module.exports = {
  runDevkit,
};
