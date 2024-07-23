var chalk = require('chalk');
var path = require('path');
var ora = require('ora');
var generateBackend = require('./backendGenerator').generateBackend;
var generateFrontend = require('./frontendGenerator').generateFrontend;
var createProjectStructure = require('../utils/fileOperations').createProjectStructure;

var generateProject = function(options) {
  return new Promise(function(resolve, reject) {
    var projectPath = path.join(process.cwd(), options.projectName);

    console.log('\n' + chalk.blue.bold('🚀 Initiating Project Generation 🚀') + '\n');

    console.log(chalk.cyan.bold('Project Details:'));
    console.log(chalk.blue('• Name: ') + chalk.green(options.projectName));
    console.log(chalk.blue('• Path: ') + chalk.green(projectPath));
    console.log(chalk.blue('• Tailwind: ') + chalk.green(options.useTailwind ? 'Yes' : 'No'));
    console.log(chalk.blue('• UI Library: ') + chalk.green(options.uiLibrary || 'None') + '\n');

    var spinner = ora('Creating project structure...').start();

    createProjectStructure(projectPath)
      .then(function() {
        spinner.succeed(chalk.green('Project structure created'));
        spinner.text = 'Generating backend...';
        spinner.start();
        return generateBackend(projectPath, options);
      })
      .then(function() {
        spinner.succeed(chalk.green('Backend generated'));
        spinner.text = 'Generating frontend...';
        spinner.start();
        return generateFrontend(projectPath, options);
      })
      .then(function() {
        spinner.succeed(chalk.green('Frontend generated'));
        console.log('\n' + chalk.green.bold('✨ Project generated successfully! ✨') + '\n');
        console.log(chalk.yellow.bold('To get started:'));
        console.log(chalk.white('  cd ' + options.projectName));
        console.log(chalk.white('  npm run dev') + '\n');
        console.log(chalk.magenta.bold('Happy coding! 🎉\n'));
        resolve();
      })
      .catch(function(error) {
        spinner.fail(chalk.red('An error occurred'));
        console.error(error);
        reject(error);
      });
  });
};

module.exports = { generateProject: generateProject };