const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const { getDependencies } = require('../utils/dependencies');

const generateFrontend = async (projectPath, options) => {
  const frontendPath = path.join(projectPath, 'frontend');

  // Ensure the frontend directory exists
  await fs.ensureDir(frontendPath);

  console.log('Setting up Vite for the frontend...');

  // Prompt for package manager
  const { packageManager } = await inquirer.prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Select a package manager:',
      choices: ['npm', 'yarn', 'pnpm', 'bun'],
      default: 'npm'
    }
  ]);

  // Prompt for framework
  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Select a framework:',
      choices: ['react', 'react-ts', 'vue', 'vue-ts', 'preact', 'preact-ts', 'lit', 'lit-ts', 'svelte', 'svelte-ts'],
      default: 'react'
    }
  ]);

  // Create Vite project
  let command;
  switch (packageManager) {
    case 'npm':
      command = `npm create vite@latest ${frontendPath} -- --template ${framework}`;
      break;
    case 'yarn':
      command = `yarn create vite ${frontendPath} --template ${framework}`;
      break;
    case 'pnpm':
      command = `pnpm create vite ${frontendPath} --template ${framework}`;
      break;
    case 'bun':
      command = `bun create vite ${frontendPath} --template ${framework}`;
      break;
  }

  execSync(command, { stdio: 'inherit' });

  console.log('Vite setup complete. Installing additional dependencies...');

  // Install additional dependencies based on user options
  const dependencies = getDependencies(options).frontend;

  if (options.useTailwind) {
    dependencies.devDependencies.push('tailwindcss', 'postcss', 'autoprefixer');
  }

  if (options.useShadcn) {
    dependencies.dependencies.push('@shadcn/ui');
  }

  if (options.useDaisyUI) {
    dependencies.devDependencies.push('daisyui');
  }

  // Install dependencies
  const installCommand = (deps, dev = false) => {
    const flag = dev ? '-D' : '';
    switch (packageManager) {
      case 'npm':
        return `npm install ${flag} ${deps.join(' ')}`;
      case 'yarn':
        return `yarn add ${flag} ${deps.join(' ')}`;
      case 'pnpm':
        return `pnpm add ${flag} ${deps.join(' ')}`;
      case 'bun':
        return `bun add ${flag} ${deps.join(' ')}`;
    }
  };

  if (dependencies.dependencies.length > 0) {
    execSync(installCommand(dependencies.dependencies), { cwd: frontendPath, stdio: 'inherit' });
  }

  if (dependencies.devDependencies.length > 0) {
    execSync(installCommand(dependencies.devDependencies, true), { cwd: frontendPath, stdio: 'inherit' });
  }

  if (options.useTailwind) {
    console.log('Setting up Tailwind CSS...');
    execSync(`${packageManager} ${packageManager === 'npm' ? 'run' : ''} tailwindcss init -p`, { cwd: frontendPath, stdio: 'inherit' });

    const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [${options.useDaisyUI ? 'require("daisyui")' : ''}],
}
`;
    await fs.writeFile(path.join(frontendPath, 'tailwind.config.js'), tailwindConfig);

    // Update index.css to include Tailwind directives
    const indexCssPath = path.join(frontendPath, 'src', 'index.css');
    const tailwindDirectives = `
@tailwind base;
@tailwind components;
@tailwind utilities;

`;
    const existingCss = await fs.readFile(indexCssPath, 'utf8');
    await fs.writeFile(indexCssPath, tailwindDirectives + existingCss);
  }

  console.log('Frontend setup complete!');
};

module.exports = { generateFrontend };