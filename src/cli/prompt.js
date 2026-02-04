const { createInterface } = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
const { DEFAULT_URL } = require('../config/constants');
const { listDevices } = require('../devices/catalog');

async function askSelection(rl, title, options, defaultIndex = 0) {
  console.log(`\n${title}`);
  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });

  const answer = (await rl.question(`Select an option [${defaultIndex + 1}]: `)).trim();
  if (!answer) return defaultIndex;

  const parsed = Number.parseInt(answer, 10);
  if (Number.isNaN(parsed) || parsed < 1 || parsed > options.length) {
    console.log('Invalid option. Using default.');
    return defaultIndex;
  }

  return parsed - 1;
}

function modeFromSelection(selectionIndex) {
  if (selectionIndex === 0) return 'ios';
  if (selectionIndex === 1) return 'mobile-tablet';
  return 'all';
}

async function askRunConfig() {
  const rl = createInterface({ input, output });

  try {
    const modeSelection = await askSelection(
      rl,
      'Device list mode',
      ['iOS only (iPhone/iPad)', 'Mobile + Tablet (all vendors)', 'All Playwright devices'],
      0,
    );

    const mode = modeFromSelection(modeSelection);
    const deviceNames = listDevices(mode);

    if (!deviceNames.length) {
      throw new Error('No devices found for selected mode.');
    }

    const deviceIndex = await askSelection(rl, 'Device', deviceNames, 0);
    const orientationIndex = await askSelection(rl, 'Orientation', ['Portrait', 'Landscape'], 0);

    const typedUrl = (await rl.question(`\nTarget URL [${DEFAULT_URL}]: `)).trim();

    return {
      deviceName: deviceNames[deviceIndex],
      isLandscape: orientationIndex === 1,
      url: typedUrl || DEFAULT_URL,
    };
  } finally {
    rl.close();
  }
}

module.exports = {
  askRunConfig,
};
