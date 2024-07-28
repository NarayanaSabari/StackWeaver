const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const { getPrompts } = require('./utils/prompts');
const { generateProject } = require('./generators/rootGenerator');

// ASCII art title
console.log('\n' + chalk.cyan(figlet.textSync('StackWeaver', {font: "Standard", horizontalLayout: 'full' })) + '\n');

// Welcome message
console.log(chalk.blue.bold('Welcome to the MERN stack project generator!'));
console.log(chalk.yellow('Let\'s create something awesome together.\n'));

program
  .version('1.0.0')
  .description('MERN stack project generator')
  .parse(process.argv);

const run = async () => {
  const answers = await inquirer.prompt(getPrompts());
  console.log('\n' + chalk.green('Great choices! Generating your project...') + '\n');
  await generateProject(answers);
  console.log('\n' + chalk.magenta(figlet.textSync('Happy Coding!', { horizontalLayout: 'full' })) + '\n');
};

run();