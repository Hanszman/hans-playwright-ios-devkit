const { webkit } = require('playwright');
const { getDeviceDescriptor } = require('../devices/catalog');

async function createBrowser() {
  return webkit.launch({ headless: false });
}

async function createContext(browser, options) {
  const { deviceName, isLandscape } = options;
  const selectedDevice = getDeviceDescriptor(deviceName);

  if (!selectedDevice) {
    throw new Error(`Unknown Playwright device: ${deviceName}`);
  }

  return browser.newContext({
    ...selectedDevice,
    isLandscape,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    ignoreHTTPSErrors: true,
  });
}

module.exports = {
  createBrowser,
  createContext,
};
