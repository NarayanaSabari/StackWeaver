const chalk = require('chalk');
const path = require('path');
const { generateBackend } = require('./backendGenerator');
const { generateFrontend } = require('./frontendGenerator');
const { createProjectStructure } = require('../utils/fileOperations');

const generateProject = async (options) => {
  const projectPath = path.join(process.cwd(), options.projectName);

  console.log(chalk.blue(`Creating project in ${projectPath}`));

  await createProjectStructure(projectPath);
  await generateBackend(projectPath, options);
  await generateFrontend(projectPath, options);

  console.log(chalk.green('Project generated successfully!'));
  console.log(chalk.yellow('To get started:'));
  console.log(chalk.white(`  cd ${options.projectName}`));
  console.log(chalk.white('  npm run dev'));
};

module.exports = { generateProject };