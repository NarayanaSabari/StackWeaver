const fs = require('fs-extra');
const path = require('path');

const copyTemplateFiles = async (templatePath, targetPath) => {
  await fs.copy(templatePath, targetPath);
};

const createProjectStructure = async (projectPath) => {
  const dirs = [
    'backend',
    'frontend',

  ];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
};

module.exports = { copyTemplateFiles, createProjectStructure };