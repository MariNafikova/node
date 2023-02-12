import * as readline from 'node:readline';
import fsp from 'fs/promises';
import path from "path";
import inquirer from 'inquirer';
import colors from "colors";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const readDir = (dir) => {
  return fsp
    .readdir(dir)
    .then((choices) => {
      return inquirer.prompt([
        {
          name: "objectName",
          type: "list",
          message: "Please choose file or folder",
          choices,
        },
        {
          name: "findString",
          type: "input",
          message: "Enter a search term",
          async when({ objectName }) {
            const fullPath = path.join(dir, objectName);
            const stat = await fsp.stat(fullPath);
            return stat.isFile();
          },
        },
      ]);
    })
    .then(async ({ objectName, findString }) => {
      const fullPath = path.join(dir, objectName);
      if (findString === undefined) return readDir(fullPath);
      return Promise.all([
        fsp.readFile(fullPath, "utf-8"),
        Promise.resolve(findString),
      ]);
    })
    .then((result) => {
      if (result) {
        const [text, findString] = result;
        const pattern = new RegExp(findString, "g");
        let count = 0;
        const out = text.replace(pattern, () => {
          count++;
          return colors.red(findString);
        });
        console.log(out, "\n", colors.green(`Matches found: ${count}`));
      }
    });
};

rl.question(
  `Please enter 'start': `,
  (answer) => {
    console.log('App started!')
    readDir(path.join(process.cwd()));
  }
);

rl.on("close", () => process.exit(0));