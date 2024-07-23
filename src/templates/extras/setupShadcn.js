const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

const logStep = (step) => {
    console.log('\n' + chalk.cyan('===================='));
    console.log(chalk.cyan.bold(step));
    console.log(chalk.cyan('====================\n'));
};

async function setupShadcn(packageManager, frontendPath, isTypeScript) {
    logStep('Setting up Shadcn UI');

    const spinner = ora('Installing dependencies').start();
    execSync(`${packageManager} install -D tailwindcss postcss autoprefixer${isTypeScript ? ' @types/node' : ''}`, { cwd: frontendPath, stdio: 'pipe' });
    execSync(`${packageManager === 'npm' ? 'npx ' : ''}tailwindcss init -p`, { cwd: frontendPath, stdio:'pipe' });
    spinner.succeed(chalk.green('Dependencies installed successfully'));

    const createOrUpdateConfig = async (filePath, isTypeScript) => {
        const defaultConfig = {
            compilerOptions: {
                baseUrl: ".",
                paths: { "@/*": ["./src/*"] }
            }
        };
        if (await fs.pathExists(filePath)) {
            try {
                console.log(chalk.blue('Updating Config:'), chalk.yellow(filePath));
                const config = await fs.readJson(filePath);
                config.compilerOptions = config.compilerOptions || {};
                config.compilerOptions.baseUrl = ".";
                config.compilerOptions.paths = { "@/*": ["./src/*"] };
                await fs.writeJson(filePath, config, { spaces: 2 });
            } catch (error) {
                console.error(chalk.red('Error updating config file:'), chalk.yellow(filePath), error);
                await fs.writeJson(filePath, defaultConfig, { spaces: 2 });
            }
        } else {
            console.log(chalk.blue('Config file not found, creating:'), chalk.yellow(filePath));
            await fs.writeJson(filePath, defaultConfig, { spaces: 2 });
        }
    };

    const configFiles = isTypeScript 
        ? ['tsconfig.json', 'tsconfig.app.json']
        : ['jsconfig.json', 'jsconfig.app.json'];
    await Promise.all(configFiles.map(file => createOrUpdateConfig(path.join(frontendPath, file), isTypeScript)));

    console.log(chalk.blue(`Updating vite.config.${isTypeScript ? 'ts' : 'js'}`));
    const viteConfig = `
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
`;
    await fs.writeFile(path.join(frontendPath, `vite.config.${isTypeScript ? 'ts' : 'js'}`), viteConfig);

    console.log(chalk.blue('Running Shadcn UI init'));
    try {
        const shadcnInitCommand = `npx shadcn-ui@latest init`;
        console.log(chalk.yellow('Executing Shadcn UI init command:'), shadcnInitCommand);
        execSync(shadcnInitCommand, { cwd: frontendPath, stdio: 'inherit' });
        console.log(chalk.green('Shadcn UI init complete. Adding default components...'));
        
 
        
        const addComponentsCommand = `npx shadcn-ui@latest add  -y`;
        console.log(chalk.yellow('Executing Shadcn UI add command:'), addComponentsCommand);
        execSync(addComponentsCommand, { cwd: frontendPath, stdio: 'inherit' });
        console.log(chalk.green.bold('Shadcn UI setup complete!'));
    } catch (error) {
        console.error(chalk.red('Error setting up Shadcn UI:'), error);
    }
}

module.exports = { setupShadcn };