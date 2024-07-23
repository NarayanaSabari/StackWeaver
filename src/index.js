const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { getPrompts } = require('./utils/prompts');
const { generateProject } = require('./generators/rootGenerator');

program
  .version('1.0.0')
  .description('MERN stack project generator')
  .parse(process.argv);

console.log(chalk.blue('Welcome to the MERN stack project generator!'));

const run = async () => {
  const answers = await inquirer.prompt(getPrompts());
  await generateProject(answers);
};

run();