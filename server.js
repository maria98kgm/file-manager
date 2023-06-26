import { homedir } from "os";
import { chdir } from "process";
import { changeDir, displayDirContent, moveUp } from "./nwd.js";
import { displayCurrentDirectory, displayError } from "./log.js";
import { createFile, removeFile, renameFile, copyFile, readFile } from "./file-operations.js";
import { getOsInfo } from "./os.js";
import { calculateHash } from "./hash.js";
import { compress, decompress } from "./compress-decompress.js";

const userHomeDir = homedir();
chdir(userHomeDir);

const argument = process.argv.find((item) => item.startsWith("--username")).split("=")[1];
let username = argument.split("");
username.splice(0, 1, argument[0].toUpperCase());
username = username.join("");

console.log(`Welcome to the File Manager, ${username}!`);
displayCurrentDirectory(userHomeDir);

process.on("exit", () => console.log(`Thank you for using File Manager, ${username}, goodbye!`));
process.on("SIGINT", () => {
  process.exit();
});

process.stdin.on("data", (input) => {
  const command = input.toString().replaceAll(/\s+/g, " ");
  const args = command
    .split(" ")
    .slice(1)
    .filter((item) => item !== "");

  if (command.startsWith("up")) moveUp();
  else if (command.startsWith("cd")) changeDir(args);
  else if (command.startsWith("ls")) displayDirContent();
  else if (command.startsWith("cat")) readFile(args);
  else if (command.startsWith("add")) createFile(args);
  else if (command.startsWith("rn")) renameFile(args);
  else if (command.startsWith("cp")) copyFile(args, false);
  else if (command.startsWith("mv")) copyFile(args, true);
  else if (command.startsWith("rm")) removeFile(args);
  else if (command.startsWith("os")) getOsInfo(args[0]);
  else if (command.startsWith("hash")) calculateHash(args.join(" "));
  else if (command.startsWith("compress")) compress(args);
  else if (command.startsWith("decompress")) decompress(args);
  else displayError("invalid_input");
});
