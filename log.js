export function displayCurrentDirectory(currentDirectory) {
  console.log(`You are currently in ${currentDirectory}`);
}

export function displayError(err) {
  if (err === "invalid_input") {
    console.log("Invalid input");
  } else if (err === "operation_failed") {
    console.log("Operation failed");
  }
}
