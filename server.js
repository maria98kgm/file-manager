import { homedir } from "os";
import { chdir, cwd } from "process";
import { resolve, join } from "path";
import { access, readdir } from "fs";

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
// process.on("message", (message) => {
//   if (message.type === "invalid_input") {
//     console.log("Invalid input");
//   } else if (message.type === "operation_failed") {
//     console.log("Operation failed");
//   }
// });

process.stdin.on("data", (input) => {
  const command = input.toString().replaceAll(/\s+/g, " ");

  if (command.startsWith("up")) {
    const upPath = join(cwd(), "../");
    const currentPath = cwd()
      .split("\\")
      .filter((item) => item !== "");

    if (currentPath.length !== 1) {
      chdir(upPath);
      displayCurrentDirectory(upPath);
    }
  } else if (command.startsWith("cd")) {
    const path = command.split(" ")[1];
    const fullPath = resolve(path);

    access(fullPath, (err) => {
      if (!err) {
        chdir(fullPath);
        displayCurrentDirectory(fullPath);
      } else {
        displayError("invalid_input");
      }
    });
  } else if (command.startsWith("ls")) {
    const currentDir = cwd();
    const tableData = [];

    readdir(currentDir, { withFileTypes: true }, (err, data) => {
      data.map((item) =>
        tableData.push({ Name: item.name, Type: item.isFile() ? "file" : "directory" })
      );

      console.table(tableData);
    });
  }
});

function displayCurrentDirectory(currentDirectory) {
  console.log(`You are currently in ${currentDirectory}`);
}

function displayError(err) {
  if (err === "invalid_input") {
    console.log("Invalid input");
  } else if (err === "operation_failed") {
    console.log("Operation failed");
  }
}
