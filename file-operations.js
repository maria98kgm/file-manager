import { cwd } from "process";
import { resolve, join } from "path";
import {
  promises as fsPromises,
  access,
  createReadStream,
  createWriteStream,
  open,
  rename,
} from "fs";
import { displayCurrentDirectory, displayError } from "./log.js";

export function readFile(args) {
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
}

export function createFile(args) {
  if (!args[0]) displayError("operation_failed");
  else {
    const filePath = resolve(args.join(" "));

    open(filePath, "w", (err) => {
      if (err) displayError("operation_failed");
      else displayCurrentDirectory(cwd());
    });
  }
}

export function renameFile(args) {
  if (!args[0]) displayError("operation_failed");
  else {
    const filePathRn = resolve(cwd(), args[0]);
    const filePathRnTo = resolve(cwd(), args[1]);

    rename(filePathRn, filePathRnTo, (err) => {
      if (err) displayError("operation_failed");
      displayCurrentDirectory(cwd());
    });
  }
}

export function copyFile(args, deleteCopiedFile) {
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
        if (deleteCopiedFile) {
          fsPromises
            .rm(filePathCp)
            .then(() => displayCurrentDirectory(cwd()))
            .catch(() => displayError("operation_failed"));
        } else {
          displayCurrentDirectory(cwd());
        }
      });

      readStream.pipe(writeStream);
    })
    .catch(() => displayError("operation_failed"));
}

export function removeFile(args) {
  const fullPath = resolve(join(cwd(), args.join(" ")));

  fsPromises
    .rm(fullPath)
    .then(() => displayCurrentDirectory(cwd()))
    .catch(() => displayError("operation_failed"));
}
