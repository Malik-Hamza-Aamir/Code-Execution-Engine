{{USER_CODE}}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line) => {
  try {
    const args = line.split(',').map(s => s.trim());
    const res = {{FUNCTION_NAME}};
    console.log(JSON.stringify(res));
  } catch (e) {
    console.error("ERROR:", e && e.stack ? e.stack : e);
  }
});