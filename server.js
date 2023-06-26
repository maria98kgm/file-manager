import { homedir } from "os";
import { chdir, cwd } from "process";
import { resolve, join } from "path";
import {
  promises as fsPromises,
  access,
  createReadStream,
  createWriteStream,
  open,
  readdir,
  rename,
} from "fs";

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
    const path = args.join(" ");
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
      displayCurrentDirectory(currentDir);
    });
  } else if (command.startsWith("cat")) {
    if (!args[0]) displayError("operation_failed");
    else {
      const filePath = resolve(args.join(" "));

      access(filePath, (err) => {
        if (err) displayError("operation_failed");
        else {
          const readStream = createReadStream(filePath, "utf-8");
          readStream
            .on("data", (data) => console.log(data))
            .on("end", () => displayCurrentDirectory(cwd()));
        }
      });
    }
  } else if (command.startsWith("add")) {
    if (!args[0]) displayError("operation_failed");
    else {
      const filePath = resolve(args.join(" "));

      open(filePath, "w", (err) => {
        if (err) displayError("operation_failed");
        else displayCurrentDirectory(cwd());
      });
    }
  } else if (command.startsWith("rn")) {
    if (!args[0]) displayError("operation_failed");
    else {
      const filePathRn = resolve(cwd(), args[0]);
      const filePathRnTo = resolve(cwd(), args[1]);

      rename(filePathRn, filePathRnTo, (err) => {
        if (err) displayError("operation_failed");
        displayCurrentDirectory(cwd());
      });
    }
  } else if (command.startsWith("cp")) {
    if (!args[0]) displayError("operation_failed");
    else {
      const filePathCp = resolve(args[0]);
      const dirPathCpTo = resolve(args[1]);
      const filePathCpTo = join(dirPathCpTo, args[0]);

      fsPromises
        .access(filePathCp)
        .then(() => fsPromises.access(dirPathCpTo))
        .then(() =>
          fsPromises
            .access(filePathCpTo)
            .then((err) => {
              if (!err) throw "exists";
            })
            .catch((err) => {
              if (err === "exists") throw new Error("");
            })
        )
        .then(() => {
          const filePathCpTo = join(dirPathCpTo, args[0]);
          const readStream = createReadStream(filePathCp);
          const writeStream = createWriteStream(filePathCpTo, { flags: "w" });

          readStream.on("error", () => displayError("operation_failed"));
          writeStream.on("error", (err) => displayError("operation_failed"));
          writeStream.on("finish", () => displayCurrentDirectory(cwd()));

          readStream.pipe(writeStream);
        })
        .catch((err) => displayError("operation_failed"));
    }
  } else if (command.startsWith("mv")) {
    if (!args[0]) displayError("operation_failed");
    else {
      const filePathCp = resolve(join(cwd(), args[0]));
      const dirPathCpTo = resolve(join(cwd(), args[1]));
      const filePathCpTo = join(dirPathCpTo, args[0]);

      fsPromises
        .access(filePathCp)
        .then(() => fsPromises.access(dirPathCpTo))
        .then(() =>
          fsPromises
            .access(filePathCpTo)
            .then((err) => {
              if (!err) throw "exists";
            })
            .catch((err) => {
              if (err === "exists") throw new Error("");
            })
        )
        .then(() => {
          const filePathCpTo = join(dirPathCpTo, args[0]);
          const readStream = createReadStream(filePathCp);
          const writeStream = createWriteStream(filePathCpTo, { flags: "w" });

          readStream.on("error", () => displayError("operation_failed"));
          writeStream.on("error", () => displayError("operation_failed"));
          writeStream.on("finish", () => {
            fsPromises
              .unlink(filePathCp)
              .then(() => displayCurrentDirectory(cwd()))
              .catch(() => displayError("operation_failed"));
          });

          readStream.pipe(writeStream);
        })
        .catch(() => displayError("operation_failed"));
    }
  } else if (command.startsWith("rm")) {
    const fullPath = resolve(join(cwd(), args.join(" ")));

    fsPromises
      .unlink(fullPath)
      .then(() => displayCurrentDirectory(cwd()))
      .catch(() => displayError("operation_failed"));
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
