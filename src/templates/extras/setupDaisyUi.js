var execSync = require('child_process').execSync;
var fs = require('fs-extra');
var path = require('path');
var chalk = require('chalk');
var ora = require('ora');

var logStep = function(step) {
    console.log('\n' + chalk.cyan('===================='));
    console.log(chalk.cyan.bold(step));
    console.log(chalk.cyan('====================\n'));
};

function setupDaisyUi(packageManager, frontendPath, useDaisyUI) {
    logStep('Setting up ' + chalk.green('Tailwind CSS') + (useDaisyUI ? ' and ' + chalk.magenta('DaisyUI') : ''));

    var spinner = ora('Installing Tailwind CSS').start();
    execSync(packageManager + ' install -D tailwindcss postcss autoprefixer', { cwd: frontendPath, stdio: 'ignore' });
    execSync((packageManager === 'npm' ? 'npx' : '') + ' tailwindcss init -p', { cwd: frontendPath, stdio: 'ignore' });
    spinner.succeed(chalk.green('Tailwind CSS installed successfully'));

    if (useDaisyUI) {
        spinner = ora('Installing DaisyUI').start();
        execSync(packageManager + ' install -D daisyui@latest', { cwd: frontendPath, stdio: 'ignore' });
        spinner.succeed(chalk.magenta('DaisyUI installed successfully'));
    }

    var tailwindConfig = [
        '/** @type {import(\'tailwindcss\').Config} */',
        'module.exports = {',
        '  content: [',
        '    "./index.html",',
        '    "./src/**/*.{js,ts,jsx,tsx}",',
        '  ],',
        '  theme: {',
        '    extend: {},',
        '  },',
        '  plugins: [' + (useDaisyUI ? "require('daisyui')," : '') + '],',
        '}'
    ].join('\n');

    spinner = ora('Writing Tailwind config').start();
    return fs.writeFile(path.join(frontendPath, 'tailwind.config.js'), tailwindConfig)
        .then(function() {
            spinner.succeed(chalk.green('Tailwind config written successfully'));

            var indexCssPath = path.join(frontendPath, 'src', 'index.css');
            var tailwindDirectives = [
                '@tailwind base;',
                '@tailwind components;',
                '@tailwind utilities;',
                ''
            ].join('\n');

            spinner = ora('Updating index.css').start();
            return fs.readFile(indexCssPath, 'utf8')
                .then(function(existingCss) {
                    return fs.writeFile(indexCssPath, tailwindDirectives + existingCss);
                })
                .then(function() {
                    spinner.succeed(chalk.green('index.css updated successfully'));
                    console.log(chalk.bold.green('\n✨ Tailwind CSS' + (useDaisyUI ? ' and DaisyUI' : '') + ' setup complete! ✨'));
                });
        });
}

module.exports = { setupDaisyUi: setupDaisyUi };