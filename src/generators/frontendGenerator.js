var path = require('path');
var fs = require('fs-extra');
var execSync = require('child_process').execSync;
var inquirer = require('inquirer');
var getDependencies = require('../utils/dependencies').getDependencies;
var setupTailwindCSS = require('../templates/extras/setupTailwindcss').setupTailwindCSS;
var setupDaisyUi = require('../templates/extras/setupDaisyUi').setupDaisyUi;
var setupShadcn = require('../templates/extras/setupShadcn').setupShadcn;
var chalk = require('chalk');
var ora = require('ora');

var logStep = function(step) {
    console.log('\n' + chalk.cyan('===================='));
    console.log(chalk.cyan.bold(step));
    console.log(chalk.cyan('====================\n'));
};

var prompt = function(message, choices, defaultChoice) {
    return inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: chalk.blue('Select a ' + message.toLowerCase() + ':'),
        choices: choices,
        default: defaultChoice
    }]).then(function(answers) {
        console.log(chalk.green('Selected ' + message.toLowerCase() + ':'), chalk.yellow(answers.choice));
        return answers.choice;
    });
};

var createViteProject = function(packageManager, frontendPath, framework) {
    logStep('Creating Vite Project');
    var commands = {
        npm: 'npm create vite@latest frontend -- --template ' + framework,
        yarn: 'yarn create vite frontend --template ' + framework,
        pnpm: 'pnpm create vite frontend --template ' + framework,
        bun: 'bun create vite frontend --template ' + framework
    };
    console.log(chalk.blue('Executing command:'), chalk.yellow(commands[packageManager]));
    execSync(commands[packageManager], { cwd: frontendPath, stdio: 'pipe' });
};

var installDependencies = function(packageManager, frontendPath, dependencies, devDependencies) {
    logStep('Installing Dependencies');

    var installCommand = function(deps, dev) {
        var flag = dev ? '-D' : '';
        var commands = {
            npm: 'npm install ' + flag + ' ' + deps.join(' '),
            yarn: 'yarn add ' + flag + ' ' + deps.join(' '),
            pnpm: 'pnpm add ' + flag + ' ' + deps.join(' '),
            bun: 'bun add ' + flag + ' ' + deps.join(' ')
        };
        return commands[packageManager];
    };

    var spinner = ora('Installing dependencies...').start();
    if (dependencies.length > 0) {
        spinner.text = 'Installing dependencies: ' + dependencies.join(', ');
        execSync(installCommand(dependencies), { cwd: frontendPath, stdio: 'inherit' });
    }
    if (devDependencies.length > 0) {
        spinner.text = 'Installing dev dependencies: ' + devDependencies.join(', ');
        execSync(installCommand(devDependencies, true), { cwd: frontendPath, stdio: 'inherit' });
    }
    spinner.succeed(chalk.green('Dependencies installed successfully'));
};

var generateFrontend = function(projectPath, options) {
    return new Promise(function(resolve, reject) {
        logStep('Generating Frontend');
        console.log(chalk.blue('Project Path:'), chalk.yellow(projectPath))

        var frontendPath = path.join(projectPath, '');
        fs.ensureDir(frontendPath)
            .then(function() {
                return prompt('Package Manager', ['npm', 'yarn', 'pnpm', 'bun'], 'npm');
            })
            .then(function(packageManager) {
                return prompt('Framework', ['react', 'react-ts', 'vue', 'vue-ts', 'preact', 'preact-ts', 'lit', 'lit-ts', 'svelte', 'svelte-ts'], 'react')
                    .then(function(framework) {
                        return { packageManager: packageManager, framework: framework };
                    });
            })
            .then(function(result) {
                var packageManager = result.packageManager;
                var framework = result.framework;
                var isTypeScript = framework.endsWith('-ts');

                createViteProject(packageManager, frontendPath, framework);

                var deps = getDependencies(options).frontend;
                var promises = [];
                frontendPath = path.join(projectPath, 'frontend');

                if (options.useTailwind) {
                    if (options.uiLibrary === 'daisyui') {
                        promises.push(setupDaisyUi(packageManager, frontendPath, options.uiLibrary));
                    } else if (options.uiLibrary === 'shadcn') {
                        promises.push(setupShadcn(packageManager, frontendPath, isTypeScript, framework));
                    } else {
                        promises.push(setupTailwindCSS(packageManager, frontendPath));
                    }
                } else if (options.uiLibrary === 'daisyui' || options.uiLibrary === 'shadcn') {
                    var setupFunction = options.uiLibrary === 'daisyui' ? setupDaisyUi : setupShadcn;
                    promises.push(setupFunction(packageManager, frontendPath, options.uiLibrary === 'shadcn' ? isTypeScript : options.uiLibrary));
                }

                return Promise.all(promises).then(function() {
                    installDependencies(packageManager, frontendPath, deps.dependencies, deps.devDependencies);
                    console.log(chalk.green.bold('\n✨ Frontend setup complete! ✨'));
                    resolve();
                });
            })
            .catch(function(error) {
                console.error(chalk.red('An error occurred:'), error);
                reject(error);
            });
    });
};

module.exports = { generateFrontend: generateFrontend };