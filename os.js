import os from "os";
import { displayError } from "./log.js";

export function getOsInfo(args) {
  if (args === "--EOL") getEOL();
  else if (args === "--cpus") getCPUSInfo();
  else if (args === "--homedir") displayHomeDir();
  else if (args === "--username") displaySystemUsername();
  else if (args === "--architecture") getCPUArchitecture();
  else displayError("invalid_input");
}

function getEOL() {
  console.log(os.EOL);
}

function getCPUSInfo() {
  console.log("Overall amount of CPUS: ", os.cpus().length);

  const tableData = [];
  os.cpus().map((item) => {
    tableData.push({ Model: item.model, "Clock rate": item.speed / 1000 });
  });

  console.table(tableData);
}

function displayHomeDir() {
  console.log(os.homedir());
}

function displaySystemUsername() {
  console.log(os.userInfo().username);
}

function getCPUArchitecture() {
  console.log(os.arch());
}
