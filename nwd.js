import { chdir, cwd } from "process";
import { resolve, join } from "path";
import { access, readdir } from "fs";
import { displayCurrentDirectory, displayError } from "./log.js";

export function moveUp() {
  const upPath = join(cwd(), "../");
  const currentPath = cwd()
    .split("\\")
    .filter((item) => item !== "");

  if (currentPath.length !== 1) {
    chdir(upPath);
    displayCurrentDirectory(upPath);
  }
}

export function changeDir(args) {
  if (args.length === 0) displayError("invalid_input");
  else {
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
  }
}

export function displayDirContent() {
  const currentDir = cwd();
  const tableData = [];

  readdir(currentDir, { withFileTypes: true }, (err, data) => {
    data.map((item) =>
      tableData.push({ Name: item.name, Type: item.isFile() ? "file" : "directory" })
    );

    console.table(tableData);
    displayCurrentDirectory(currentDir);
  });
}
