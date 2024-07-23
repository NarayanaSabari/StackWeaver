const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const { getPrompts } = require('./utils/prompts');
const { generateProject } = require('./generators/rootGenerator');

// ASCII art title
console.log('\n' + chalk.cyan(figlet.textSync('StackWeaver', {font: "Standard", horizontalLayout: 'full' })) + '\n');

program
  .version('1.0.0')
  .description('MERN stack project generator')
  .parse(process.argv);

console.log(chalk.blue.bold('Welcome to the MERN stack project generator!'));
console.log(chalk.yellow('Let\'s create something awesome together.\n'));

const run = function() {
  inquirer.prompt(getPrompts())
    .then(function(answers) {
      console.log('\n' + chalk.green('Great choices! Generating your project...') + '\n');
      return generateProject(answers);
    })
    .then(function() {
      console.log('\n' + chalk.magenta(figlet.textSync('Happy Coding!', { horizontalLayout: 'full' })) + '\n');
    })
    .catch(function(error) {
      console.error(chalk.red('An error occurred:'), error);
    });
};

run();