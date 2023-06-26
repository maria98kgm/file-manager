import { cwd } from "process";
import { resolve } from "path";
import { createGzip, createUnzip } from "zlib";
import { displayCurrentDirectory, displayError } from "./log.js";
import { createReadStream, createWriteStream } from "fs";

export function compress(args) {
  if (args.length < 2) displayError("invalid_input");
  else {
    const compress = resolve(cwd(), args[0]);
    const destination = resolve(cwd(), args[1]);

    const gzip = createGzip();
    const readStream = createReadStream(compress);
    const writeStream = createWriteStream(destination);

    readStream.on("error", () => displayError("operation_failed"));
    writeStream.on("error", () => displayError("operation_failed"));
    writeStream.on("finish", () => displayCurrentDirectory(cwd()));

    readStream.pipe(gzip).pipe(writeStream);
  }
}

export function decompress(args) {
  if (args.length < 2) displayError("invalid_input");
  else {
    const decompress = resolve(cwd(), args[0]);
    const destination = resolve(cwd(), args[1]);

    const unzip = createUnzip();
    const readStream = createReadStream(decompress);
    const writeStream = createWriteStream(destination);

    readStream.on("error", () => displayError("operation_failed"));
    writeStream.on("error", () => displayError("operation_failed"));
    writeStream.on("finish", () => displayCurrentDirectory(cwd()));

    readStream.pipe(unzip).pipe(writeStream);
  }
}
