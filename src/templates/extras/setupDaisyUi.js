const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const logStep = (step) => {
    console.log('\n====================');
    console.log(step);
    console.log('====================\n');
};

function setupDaisyUi(packageManager, frontendPath, useDaisyUI) {
    logStep('Setting up Tailwind CSS' + (useDaisyUI ? ' and DaisyUI' : ''));

    console.log('Installing Tailwind CSS');
    execSync(packageManager + ' install -D tailwindcss postcss autoprefixer', { cwd: frontendPath, stdio: 'inherit' });
    execSync((packageManager === 'npm' ? 'npx' : '') + ' tailwindcss init -p', { cwd: frontendPath, stdio: 'inherit' });

    if (useDaisyUI) {
        console.log('Installing DaisyUI');
        execSync(packageManager + ' install -D daisyui@latest', { cwd: frontendPath, stdio: 'inherit' });
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

    console.log('Writing Tailwind config');
    return fs.writeFile(path.join(frontendPath, 'tailwind.config.js'), tailwindConfig)
        .then(function() {
            var indexCssPath = path.join(frontendPath, 'src', 'index.css');
            var tailwindDirectives = [
                '@tailwind base;',
                '@tailwind components;',
                '@tailwind utilities;',
                ''
            ].join('\n');

            console.log('Updating index.css');
            return fs.readFile(indexCssPath, 'utf8')
                .then(function(existingCss) {
                    return fs.writeFile(indexCssPath, tailwindDirectives + existingCss);
                });
        });
}

module.exports = { setupDaisyUi };