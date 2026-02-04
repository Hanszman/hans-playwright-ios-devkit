async function registerPageEvents(page, context) {
  page.on('console', (msg) => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

  page.on('requestfailed', (req) => {
    const failure = req.failure();
    console.log('REQUEST FAILED:', req.url(), failure?.errorText);
  });

  page.on('response', (res) => {
    if (res.status() >= 400) {
      console.log('RESPONSE:', res.status(), res.url());
    }
  });

  page.on('crash', async () => {
    console.log('PAGE CRASHED');
    await page.screenshot({ path: 'crash.png', fullPage: true }).catch(() => {});
    await context.tracing.stop({ path: 'trace.zip' }).catch(() => {});
  });
}

module.exports = {
  registerPageEvents,
};
