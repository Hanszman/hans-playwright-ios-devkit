const { runDevkit } = require('./src/app/run-devkit');

runDevkit().catch((error) => {
  console.error('Fatal error:', error.message);
  process.exitCode = 1;
});
