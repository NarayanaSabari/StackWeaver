const path = require('path');
const fs = require('fs-extra');
const execSync = require('child_process').execSync;
const inquirer = require('inquirer');
const getDependencies = require('../utils/dependencies').getDependencies;
const setupTailwindCSS = require('../templates/extras/setupTailwindcss').setupTailwindCSS;
const setupDaisyUi = require('../templates/extras/setupDaisyUi').setupDaisyUi;
const setupShadcn = require('../templates/extras/setupShadcn').setupShadcn;
const chalk = require('chalk');
const ora = require('ora');

const logStep = (step) => {
  console.log('\n' + chalk.cyan('===================='));
  console.log(chalk.cyan.bold(step));
  console.log(chalk.cyan('====================\n'));
};

const prompt = (message, choices, defaultChoice) => {
  return inquirer.prompt([{
    type: 'list',
    name: 'choice',
    message: chalk.blue('Select a ' + message.toLowerCase() + ':'),
    choices: choices,
    default: defaultChoice
  }]).then((answers) => {
    console.log(chalk.green('Selected ' + message.toLowerCase() + ':'), chalk.yellow(answers.choice));
    return answers.choice;
  });
};

const createViteProject = (packageManager, frontendPath, framework) => {
  logStep('Creating Vite Project');
  const commands = {
    npm: 'npm create vite@latest frontend -- --template ' + framework,
    yarn: 'yarn create vite frontend --template ' + framework,
    pnpm: 'pnpm create vite frontend --template ' + framework,
    bun: 'bun create vite frontend --template ' + framework
  };
  console.log(chalk.blue('Executing command:'), chalk.yellow(commands[packageManager]));
  execSync(commands[packageManager], { cwd: frontendPath, stdio: 'pipe' });
};

const installDependencies = (packageManager, frontendPath, dependencies, devDependencies) => {
  logStep('Installing Dependencies');

  const installCommand = (deps, dev) => {
    const flag = dev ? '-D' : '';
    const commands = {
      npm: 'npm install ' + flag + ' ' + deps.join(' '),
      yarn: 'yarn add ' + flag + ' ' + deps.join(' '),
      pnpm: 'pnpm add ' + flag + ' ' + deps.join(' '),
      bun: 'bun add ' + flag + ' ' + deps.join(' ')
    };
    return commands[packageManager];
  };

  const spinner = ora('Installing dependencies...').start();
  if (dependencies.length > 0) {
    spinner.text = 'Installing dependencies: ' + dependencies.join(', ');
    execSync(installCommand(dependencies), { cwd: frontendPath, stdio: 'pipe' });
  }
  if (devDependencies.length > 0) {
    spinner.text = 'Installing dev dependencies: ' + devDependencies.join(', ');
    execSync(installCommand(devDependencies, true), { cwd: frontendPath, stdio: 'pipe' });
  }
  spinner.succeed(chalk.green('Dependencies installed successfully'));
};

const generateFrontend = (projectPath, options) => {
  return new Promise((resolve, reject) => {
    logStep('Generating Frontend');
    console.log(chalk.blue('Project Path:'), chalk.yellow(projectPath));

    const frontendPath = path.join(projectPath, 'frontend');
    
    fs.ensureDir(frontendPath)
      .then(() => prompt('Package Manager', ['npm', 'yarn', 'pnpm', 'bun'], 'npm'))
      .then((packageManager) => prompt('Framework', ['react', 'react-ts', 'vue', 'vue-ts', 'preact', 'preact-ts', 'lit', 'lit-ts', 'svelte', 'svelte-ts'], 'react')
        .then((framework) => ({ packageManager, framework }))
      )
      .then((result) => {
        const { packageManager, framework } = result;
        
        const commands = {
          npm: `npm create vite@latest . -- --template ${framework}`,
          yarn: `yarn create vite . --template ${framework}`,
          pnpm: `pnpm create vite . --template ${framework}`,
          bun: `bun create vite . --template ${framework}`
        };

        console.log(chalk.blue('Executing command:'), chalk.yellow(commands[packageManager]));
        execSync(commands[packageManager], { cwd: frontendPath, stdio: 'inherit' });

        const deps = getDependencies(options).frontend;
        const promises = [];

        if (options.useTailwind) {
          if (options.uiLibrary === 'daisyui') {
            promises.push(setupDaisyUi(packageManager, frontendPath, options.uiLibrary));
          } else if (options.uiLibrary === 'shadcn') {
            promises.push(setupShadcn(packageManager, frontendPath, framework));
          } else {
            promises.push(setupTailwindCSS(packageManager, frontendPath));
          }
        } else if (options.uiLibrary === 'daisyui' || options.uiLibrary === 'shadcn') {
          const setupFunction = options.uiLibrary === 'daisyui' ? setupDaisyUi : setupShadcn;
          promises.push(setupFunction(packageManager, frontendPath));
        }

        return Promise.all(promises).then(() => {
          installDependencies(packageManager, frontendPath, deps.dependencies, deps.devDependencies);
          console.log(chalk.green.bold('\n✨ Frontend setup complete! ✨'));
          resolve();
        });
      })
      .catch((error) => {
        console.error(chalk.red('An error occurred:'), error);
        reject(error);
      });
  });
};

module.exports = { generateFrontend };
