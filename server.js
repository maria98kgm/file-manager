const argument = process.argv.find((item) => item.startsWith("--username")).split("=")[1];
let username = argument.split("");
username.splice(0, 1, argument[0].toUpperCase());
username = username.join("");

console.log(`Welcome to the File Manager, ${username}!`);

process.on("exit", () => console.log(`Thank you for using File Manager, ${username}, goodbye!`));
process.on("SIGINT", () => {
  process.exit();
});
