const getDependencies = (options) => {
  const dependencies = {
    backend: [
      'express',
      'mongoose',
      'dotenv',
      'cors'
    ],
    frontend: {
      dependencies: [],
      devDependencies: ['create-vite']
    }
  };

  if (options.useGraphQL) {
    dependencies.backend.push('graphql', 'express-graphql');
    dependencies.frontend.dependencies.push('@apollo/client');
  }

  // We'll handle Tailwind, Shadcn, and DaisyUI after Vite setup

  return dependencies;
};

module.exports = { getDependencies };