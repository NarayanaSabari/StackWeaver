const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const generateBackend = require('./backendGenerator').generateBackend;
const generateFrontend = require('./frontendGenerator').generateFrontend;
const { createProjectStructure } = require('../utils/fileOperations'); 


const generateProject = function(options) {
  return new Promise(function(resolve, reject) {
    const projectPath = path.join(process.cwd(), options.projectName);
    
    console.log('\n' + chalk.blue.bold('🚀 Initiating Project Generation 🚀') + '\n');
    console.log(chalk.cyan.bold('Project Details:'));
    console.log(chalk.blue('• Name: ') + chalk.green(options.projectName));
    console.log(chalk.blue('• Path: ') + chalk.green(projectPath));
    console.log(chalk.blue('• Tailwind: ') + chalk.green(options.useTailwind ? 'Yes' : 'No'));
    console.log(chalk.blue('• UI Library: ') + chalk.green(options.uiLibrary || 'None'));
    console.log(chalk.blue('• Project Type: ') + chalk.green(options.projectType) + '\n');

    const spinner = ora('Creating project structure...').start();

    createProjectStructure(projectPath)
      .then(() => {
        spinner.succeed(chalk.green('Project structure created'));

        // Conditionally generate backend
        if (options.projectType === 'complete' || options.projectType === 'backend') {
          spinner.text = 'Generating backend...';
          spinner.start();
          return generateBackend(projectPath, options);
        }
        return Promise.resolve();
      })
      .then(() => {
        if (options.projectType === 'complete' || options.projectType === 'backend') {
          spinner.succeed(chalk.green('Backend generated'));
        }

        // Conditionally generate frontend
        if (options.projectType === 'complete' || options.projectType === 'frontend') {
          spinner.text = 'Generating frontend...';
          spinner.start();
          return generateFrontend(projectPath, options);
        }
        return Promise.resolve();
      })
      .then(() => {
        if (options.projectType === 'complete' || options.projectType === 'frontend') {
          spinner.succeed(chalk.green('Frontend generated'));
        }
        console.log('\n' + chalk.green.bold('✨ Project generated successfully! ✨') + '\n');
        console.log(chalk.yellow.bold('To get started:'));
        console.log(chalk.white('  cd ' + options.projectName));
        if (options.projectType !== 'backend') {
          console.log(chalk.white('  npm run dev') + '\n');
        } else {
          console.log(chalk.white('  cd backend'));
          console.log(chalk.white('  npm start') + '\n');
        }
        console.log(chalk.magenta.bold('Happy coding! 🎉\n'));
        resolve();
      })
      .catch((error) => {
        spinner.fail(chalk.red('An error occurred'));
        console.error(error);
        reject(error);
      });
  });
};

module.exports = { generateProject };
