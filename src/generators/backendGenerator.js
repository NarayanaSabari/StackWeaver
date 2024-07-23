const path = require('path');
const fs = require('fs-extra');
const { copyTemplateFiles } = require('../utils/fileOperations');
const { getDependencies } = require('../utils/dependencies');

const generateBackend = async (projectPath, options) => {
  const backendPath = path.join(projectPath, 'backend');
  const templatePath = path.join(__dirname, '../templates/backend');

  await copyTemplateFiles(templatePath, backendPath);

  const packageJson = {
    name: `${options.projectName}-backend`,
    version: '1.0.0',
    main: 'server.js',
    scripts: {
      start: 'node server.js',
      dev: 'nodemon server.js'
    },
    _moduleAliases: {
    "@": "./src/",
    "@controllers": "./src/controllers/",
    "@config": "./src/config/",
    "@routes": "./src/routes/",
    "@middleware": "./src/middleware/",
    "@mongodb": "./src/modules/mongodb",
    "@utils": "./src/utils",
    "@services": "./src/services"
  },
    dependencies: {}
    
  };

  const dependencies = getDependencies(options).backend;
  for (const dep of dependencies) {
    packageJson.dependencies[dep] = '*';
  }

  await fs.writeJson(path.join(backendPath, 'package.json'), packageJson, { spaces: 2 });

//   if (options.useGraphQL) {
//     // Add GraphQL schema and resolvers
//     const graphqlSetup = `
// const { buildSchema } = require('graphql');

// const schema = buildSchema(\`
//   type Query {
//     hello: String
//   }
// \`);

// const root = {
//   hello: () => 'Hello, GraphQL!'
// };

// module.exports = { schema, root };
// `;
//     await fs.writeFile(path.join(backendPath, 'graphql.js'), graphqlSetup);
//   }
// };

module.exports = { generateBackend };