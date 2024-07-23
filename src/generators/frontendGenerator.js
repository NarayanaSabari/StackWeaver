const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const { getDependencies } = require('../utils/dependencies');
const { setupTailwindCSS } = require('../templates/extras/setupTailwindcss');
const {setupDaisyUi} = require('../templates/extras/setupDaisyUi')
const { setupShadcn } = require('../templates/extras/setupShadcn');

const logStep = (step) => {
    console.log('\n====================');
    console.log(step);
    console.log('====================\n');
};

const prompt = async (message, choices, defaultChoice) => {
    logStep(`Prompting for ${message}`);
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: `Select a ${message.toLowerCase()}:`,
            choices,
            default: defaultChoice
        }
    ]);
    console.log(`Selected ${message.toLowerCase()}:`, answers.choice);
    return answers.choice;
};

const createViteProject = (packageManager, frontendPath, framework) => {
    logStep('Creating Vite Project');
    const commands = {
        npm: `npm create vite@latest frontend -- --template ${framework}`,
        yarn: `yarn create vite frontend --template ${framework}`,
        pnpm: `pnpm create vite frontend --template ${framework}`,
        bun: `bun create vite frontend --template ${framework}`
    };
    console.log('Executing command:', commands[packageManager]);
    execSync(commands[packageManager], { cwd: frontendPath, stdio: 'inherit' });
};

const installDependencies = (packageManager, frontendPath, dependencies, devDependencies) => {
    logStep('Installing Dependencies');

    const installCommand = (deps, dev) => {
        const flag = dev ? '-D' : '';
        const commands = {
            npm: `npm install ${flag} ${deps.join(' ')}`,
            yarn: `yarn add ${flag} ${deps.join(' ')}`,
            pnpm: `pnpm add ${flag} ${deps.join(' ')}`,
            bun: `bun add ${flag} ${deps.join(' ')}`
        };
        return commands[packageManager];
    };

    if (dependencies.length > 0) {
        console.log('Installing dependencies:', dependencies);
        execSync(installCommand(dependencies), { cwd: frontendPath, stdio: 'inherit' });
    }
    if (devDependencies.length > 0) {
        console.log('Installing dev dependencies:', devDependencies);
        execSync(installCommand(devDependencies, true), { cwd: frontendPath, stdio: 'inherit' });
    }
};

const generateFrontend = async (projectPath, options) => {
    logStep('Generating Frontend');
    console.log('Project Path:', projectPath);
    console.log('Options:', JSON.stringify(options, null, 2));

    let frontendPath = path.join(projectPath, '');
    await fs.ensureDir(frontendPath);

    const packageManager = await prompt('Package Manager', ['npm', 'yarn', 'pnpm', 'bun'], 'npm');
    const framework = await prompt('Framework', ['react', 'react-ts', 'vue', 'vue-ts', 'preact', 'preact-ts', 'lit', 'lit-ts', 'svelte', 'svelte-ts'], 'react');
    const isTypeScript = framework.endsWith('-ts');

    createViteProject(packageManager, frontendPath, framework);

    const deps = getDependencies(options).frontend;

    const promises = [];
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
    const setupFunction = options.uiLibrary === 'daisyui' ? setupDaisyUi : setupShadcn;
    promises.push(setupFunction(packageManager, frontendPath, options.uiLibrary === 'shadcn' ? isTypeScript : options.uiLibrary));
}



    await Promise.all(promises);
    installDependencies(packageManager, frontendPath, deps.dependencies, deps.devDependencies);

    console.log('Frontend setup complete!');
};

module.exports = { generateFrontend };
