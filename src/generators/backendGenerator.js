const path = require('path');
const fs = require('fs-extra');
const execSync = require('child_process').execSync;
const { copyTemplateFiles } = require('../utils/fileOperations'); 
const { getDependencies } = require('../utils/dependencies');

const generateBackend = async (projectPath, options) => {
  try {
    const backendPath = path.join(projectPath, 'backend');
    const templatePath = path.join(__dirname, '../templates/backend');

    console.log('Copying backend template files...');
    await fs.ensureDir(backendPath);
    await copyTemplateFiles(templatePath, backendPath); 

    const packageJson = {
      name: `${options.projectName}-backend`,
      version: '1.0.0',
      main: 'server.js',
      scripts: {
        start: 'node ./src/server.js',
        dev: 'nodemon ./src/server.js'
      },
      _moduleAliases: {
        "@": "./src/",
        "@controllers": "./src/controllers/",
        "@config": "./src/config/",
        "@routes": "./src/routes/",
        "@middleware": "./src/middleware/",
        "@mongodb": "./src/modules/mongodb",
        "@utils": "./src/utils/",
        "@services": "./src/services/"
      },
      dependencies: {}
    };

    const dependencies = getDependencies(options).backend;
    for (const dep of dependencies) {
      packageJson.dependencies[dep] = '*';
    }

    console.log('Writing package.json...');
    await fs.writeJson(path.join(backendPath, 'package.json'), packageJson, { spaces: 2 });

    console.log('Installing backend dependencies...');
    execSync('npm install', { cwd: backendPath, stdio: 'inherit' });

    console.log('Backend generation complete!');
  } catch (error) {
    console.error('Error generating backend:', error);
    throw error;
  }
};

module.exports = { generateBackend };
