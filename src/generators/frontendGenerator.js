const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const { getDependencies } = require('../utils/dependencies');

const promptForPackageManager = async () => {
  const { packageManager } = await inquirer.prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Select a package manager:',
      choices: ['npm', 'yarn', 'pnpm', 'bun'],
      default: 'npm'
    }
  ]);
  return packageManager;
};

const promptForFramework = async () => {
  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Select a framework:',
      choices: ['react', 'react-ts', 'vue', 'vue-ts', 'preact', 'preact-ts', 'lit', 'lit-ts', 'svelte', 'svelte-ts'],
      default: 'react'
    }
  ]);
  return framework;
};

const createViteProject = (packageManager, frontendPath, framework) => {
  const commands = {
    npm: `npm create vite@latest ${frontendPath} -- --template ${framework}`,
    yarn: `yarn create vite ${frontendPath} --template ${framework}`,
    pnpm: `pnpm create vite ${frontendPath} --template ${framework}`,
    bun: `bun create vite ${frontendPath} --template ${framework}`
  };
  execSync(commands[packageManager], { stdio: 'inherit' });
};

const installDependencies = (packageManager, frontendPath, dependencies, devDependencies) => {
  const installCommand = (deps, dev = false) => {
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
    execSync(installCommand(dependencies), { cwd: frontendPath, stdio: 'inherit' });
  }
  if (devDependencies.length > 0) {
    execSync(installCommand(devDependencies, true), { cwd: frontendPath, stdio: 'inherit' });
  }
};

const setupTailwindAndDaisyUI = async (packageManager, frontendPath, useDaisyUI) => {
  console.log('Setting up Tailwind CSS and DaisyUI...');
  
  // Install Tailwind CSS
  execSync(`${packageManager} add -D tailwindcss postcss autoprefixer`, { cwd: frontendPath, stdio: 'inherit' });
  execSync(`${packageManager} ${packageManager === 'npm' ? 'run' : ''} tailwindcss init -p`, { cwd: frontendPath, stdio: 'inherit' });

  // Install DaisyUI if selected
  if (useDaisyUI) {
    execSync(`${packageManager} add -D daisyui@latest`, { cwd: frontendPath, stdio: 'inherit' });
  }

  const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [${useDaisyUI ? "require('daisyui')," : ''}],
}
`;
  await fs.writeFile(path.join(frontendPath, 'tailwind.config.js'), tailwindConfig);

  const indexCssPath = path.join(frontendPath, 'src', 'index.css');
  const tailwindDirectives = `
@tailwind base;
@tailwind components;
@tailwind utilities;

`;
  const existingCss = await fs.readFile(indexCssPath, 'utf8');
  await fs.writeFile(indexCssPath, tailwindDirectives + existingCss);
};

const setupShadcn = async (packageManager, frontendPath) => {
  console.log('Setting up shadcn-ui...');

  // Install dependencies
  execSync(`${packageManager} add -D tailwindcss postcss autoprefixer @types/node`, { cwd: frontendPath, stdio: 'inherit' });
  execSync(`${packageManager} ${packageManager === 'npm' ? 'run' : ''} tailwindcss init -p`, { cwd: frontendPath, stdio: 'inherit' });

  // Update tsconfig.json and tsconfig.app.json
  const updateTsConfig = async (filePath) => {
    const tsconfig = await fs.readJson(filePath);
    tsconfig.compilerOptions = {
      ...tsconfig.compilerOptions,
      baseUrl: ".",
      paths: {
        "@/*": ["./src/*"]
      }
    };
    await fs.writeJson(filePath, tsconfig, { spaces: 2 });
  };

  await updateTsConfig(path.join(frontendPath, 'tsconfig.json'));
  await updateTsConfig(path.join(frontendPath, 'tsconfig.app.json'));

  // Update vite.config.ts
  const viteConfig = `
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
`;
  await fs.writeFile(path.join(frontendPath, 'vite.config.ts'), viteConfig);

  // Run shadcn-ui init
  const shadcnAnswers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useTypeScript',
      message: 'Would you like to use TypeScript (recommended)?',
      default: true
    },
    {
      type: 'list',
      name: 'style',
      message: 'Which style would you like to use?',
      choices: ['Default', 'New York', 'Slate'],
      default: 'Default'
    },
    {
      type: 'list',
      name: 'baseColor',
      message: 'Which color would you like to use as base color?',
      choices: ['Slate', 'Gray', 'Zinc', 'Neutral', 'Stone'],
      default: 'Slate'
    },
    {
      type: 'input',
      name: 'cssFile',
      message: 'Where is your global CSS file?',
      default: 'src/index.css'
    },
    {
      type: 'confirm',
      name: 'cssVariables',
      message: 'Do you want to use CSS variables for colors?',
      default: true
    },
    {
      type: 'input',
      name: 'tailwindConfig',
      message: 'Where is your tailwind.config.js located?',
      default: 'tailwind.config.js'
    },
    {
      type: 'input',
      name: 'componentsAlias',
      message: 'Configure the import alias for components:',
      default: '@/components'
    },
    {
      type: 'input',
      name: 'utilsAlias',
      message: 'Configure the import alias for utils:',
      default: '@/lib/utils'
    },
    {
      type: 'confirm',
      name: 'useRSC',
      message: 'Are you using React Server Components?',
      default: false
    }
  ]);

  const shadcnCommand = `npx shadcn-ui@latest init ${
    shadcnAnswers.useTypeScript ? '--typescript' : ''
  } --style ${shadcnAnswers.style} --base-color ${shadcnAnswers.baseColor} --css-file ${shadcnAnswers.cssFile} ${
    shadcnAnswers.cssVariables ? '--css-variables' : ''
  } --tailwind-config ${shadcnAnswers.tailwindConfig} --components-alias ${shadcnAnswers.componentsAlias} --utils-alias ${shadcnAnswers.utilsAlias} ${
    shadcnAnswers.useRSC ? '--rsc' : ''
  }`;

  execSync(shadcnCommand, { cwd: frontendPath, stdio: 'inherit' });

  console.log('Adding Button component as an example...');
  execSync('npx shadcn-ui@latest add button', { cwd: frontendPath, stdio: 'inherit' });

  console.log('shadcn-ui setup complete!');
};

const generateFrontend = async (projectPath, options) => {
  const frontendPath = path.join(projectPath, 'frontend');
  await fs.ensureDir(frontendPath);

  console.log('Setting up Vite for the frontend...');
  const packageManager = await promptForPackageManager();
  const framework = await promptForFramework();

  createViteProject(packageManager, frontendPath, framework);
  console.log('Vite setup complete. Installing additional dependencies...');

  const { dependencies, devDependencies } = getDependencies(options).frontend;

  if (options.useTailwind || options.useDaisyUI) {
    await setupTailwindAndDaisyUI(packageManager, frontendPath, options.useDaisyUI);
  }

  if (options.useShadcn) {
    await setupShadcn(packageManager, frontendPath);
  }

  // Install any remaining dependencies
  installDependencies(packageManager, frontendPath, dependencies, devDependencies);

  console.log('Frontend setup complete!');
};

module.exports = { generateFrontend };