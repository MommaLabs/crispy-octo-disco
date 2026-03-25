const sdk = require("timefi-sdk");

console.log("Bot running...");
if (typeof sdk.hello === 'function') {
  console.log(sdk.hello());
} else {
  console.log("TimeFi SDK active 🚀");
  console.log("Available Methods:", Object.keys(sdk));
}