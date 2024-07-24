const fs = require('fs-extra');
const path = require('path');


const copyTemplateFiles = async (templatePath, targetPath) => {
  try {
    await fs.copy(templatePath, targetPath);
    console.log(`Template files copied from ${templatePath} to ${targetPath}`);
  } catch (error) {
    console.error('Error copying template files:', error);
    throw error;
  }
};

const createProjectStructure = async (projectPath, includeFrontend, includeBackend) => {
  try {
    if (includeFrontend) {
      await fs.ensureDir(path.join(projectPath, 'frontend'));
      console.log('Frontend directory created.');
    }

    if (includeBackend) {
      await fs.ensureDir(path.join(projectPath, 'backend'));
      console.log('Backend directory created.');
    }
  } catch (error) {
    console.error('Error creating project structure:', error);
    throw error;
  }
};

module.exports = { copyTemplateFiles, createProjectStructure };
