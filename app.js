require("console-stamp")(console, { pattern: "dd/mm/yyyy HH:MM:ss.l" });
const fs = require("fs");

/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful,
 * such as when you deploy to a server, or a PaaS like Heroku.
 *
 * For example:
 *   => `node app.js`
 *   => `npm start`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *
 * The same command-line arguments and env vars are supported, e.g.:
 * `NODE_ENV=production node app.js --port=80 --verbose`
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/app.js
 */

// Ensure we're in the project directory, so cwd-relative paths work as expected
// no matter where we actually lift from.
// > Note: This is not required in order to lift, but it is a convenient default.
process.chdir(__dirname);

// Attempt to import `sails` dependency, as well as `rc` (for loading `.sailsrc` files).
var sails;
var rc;
try {
  sails = require("sails");
  rc = require("sails/accessible/rc");
} catch (err) {
  console.error("Encountered an error when attempting to require('sails'):");
  console.error(err.stack);
  console.error("--");
  console.error(
    "To run an app using `node app.js`, you need to have Sails installed"
  );
  console.error(
    "locally (`./node_modules/sails`).  To do that, just make sure you're"
  );
  console.error("in the same directory as your app and run `npm install`.");
  console.error();
  console.error(
    "If Sails is installed globally (i.e. `npm install -g sails`) you can"
  );
  console.error(
    "also run this app with `sails lift`.  Running with `sails lift` will"
  );
  console.error(
    "not run this file (`app.js`), but it will do exactly the same thing."
  );
  console.error(
    "(It even uses your app directory's local Sails install, if possible.)"
  );
  return;
} //-•

// Start server
sails.lift(rc("sails"));

/*
___________        .__   __      ___ ___                      .___.__
\_   _____/___  ___|__|_/  |_   /   |   \ _____     ____    __| _/|  |    ____ _______
 |    __)_ \  \/  /|  |\   __\ /    ~    \\__  \   /    \  / __ | |  |  _/ __ \\_  __ \
 |        \ >    < |  | |  |   \    Y    / / __ \_|   |  \/ /_/ | |  |__\  ___/ |  | \/
/_______  //__/\_ \|__| |__|    \___|_  / (____  /|___|  /\____ | |____/ \___  >|__|
        \/       \/                   \/       \/      \/      \/            \/
 */

// Exit Process handler
process.stdin.resume(); // So the program will not close instantly
// Do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));
// Catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
// Catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
// Catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { unhandled: true }));
// Catches uncaught rejection
process.on("unhandledRejection", exitHandler.bind(null, { unhandled: true }));

// Uncomment to simulate any error
// setTimeout(() => {
//   throw unhandleExceptions("unhandleExceptions")
//   throw SyntaxError("SyntaxError")
//   throw TypeError("TypeError")
//   // throw Error("Error")
// }, 5000);

function exitHandler(options, exitCode) {
  // if (options.cleanup) console.log('clean');
  // if (exitCode || exitCode === 0) console.log(exitCode);
  console.log("\033[31m", exitCode, "\033[0m");

  if (options.unhandled) {
    console.log("\033[33m", "<<<<< WARNING FOR SERVER >>>>>", "\033[0m");
    console.log("\033[33m", "UNHANDLED CODE:", exitCode.toString(), "\033[0m");

    fs.appendFile(
      "./logs/unhandled.txt",
      "\n" +
        JSON.stringify({
          date: new Date().toISOString(),
          exitCode: exitCode.toString()
        }),
      "utf8",
      err => {
        if (err) {
          console.log("!!! SOMETHING WRONG WHILE SAVING LOGS !!!");
          console.log(JSON.stringify(err));
        }
        console.log(
          "\033[32m",
          "Reporting unhandled: [FILE ./logs/unhandled.txt]",
          "\033[0m"
        );
      }
    );
  }

  if (options.exit) {
    console.log("\033[31m", "<<<<< CLOSING SERVER >>>>>", "\033[0m");
    console.log("\033[31m", "EXIT CODE:", exitCode.toString(), "\033[0m");

    fs.appendFile(
      "./logs/exit.txt",
      "\n" +
        JSON.stringify({
          date: new Date().toISOString(),
          exitCode: exitCode.toString()
        }),
      "utf8",
      err => {
        if (err) {
          console.log("!!! SOMETHING WRONG WHILE SAVING LOGS !!!");
          console.log(JSON.stringify(err));
        }
        console.log(
          "\033[32m",
          "Reporting exit: [FILE ./logs/exit.txt]",
          "\033[0m"
        );
        process.exit();
      }
    );
  }
}
