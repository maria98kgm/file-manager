import { readFile } from "fs";
import crypto from "crypto";
import { displayCurrentDirectory, displayError } from "./log.js";
import { cwd } from "process";

export function calculateHash(args) {
  if (!args) displayError("invalid_input");
  else {
    readFile(args, (err, data) => {
      if (err) displayError("operation_failed");
      else {
        const hash = crypto.createHash("sha256");
        hash.update(data);
        console.log(hash.digest("hex"));
        displayCurrentDirectory(cwd());
      }
    });
  }
}
