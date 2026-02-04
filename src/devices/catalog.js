const { devices } = require('playwright');

function isIosDevice(name) {
  return /iPhone|iPad|iPod/i.test(name);
}

function isMobileOrTabletDevice(descriptor) {
  const userAgent = descriptor.userAgent || '';
  return /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
}

function listDevices(mode) {
  const allNames = Object.keys(devices).sort((a, b) => a.localeCompare(b));

  if (mode === 'ios') {
    return allNames.filter(isIosDevice);
  }

  if (mode === 'mobile-tablet') {
    return allNames.filter((name) => isMobileOrTabletDevice(devices[name]));
  }

  return allNames;
}

function getDeviceDescriptor(deviceName) {
  return devices[deviceName];
}

module.exports = {
  listDevices,
  getDeviceDescriptor,
};
