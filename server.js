import { homedir } from "os";
import { chdir } from "process";

const userHomeDir = homedir();
chdir(userHomeDir);

const argument = process.argv.find((item) => item.startsWith("--username")).split("=")[1];
let username = argument.split("");
username.splice(0, 1, argument[0].toUpperCase());
username = username.join("");

console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${userHomeDir}`);

process.on("exit", () => console.log(`Thank you for using File Manager, ${username}, goodbye!`));
process.on("SIGINT", () => {
  process.exit();
});
// process.on("message", (message) => {
//   if (message.type === "invalid_input") {
//     console.log("Invalid input");
//   } else if (message.type === "operation_failed") {
//     console.log("Operation failed");
//   }
// });

process.stdin.on("data", () => {});
