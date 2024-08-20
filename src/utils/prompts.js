const getPrompts = () => [
  {
    type: 'input',
    name: 'projectName',
    message: 'What is your project name?',
    default: 'my-mern-app'
  },
  {
    type: 'list',
    name: 'projectType',
    message: 'What do you want to generate?',
    choices: [
      { name: 'Complete Project', value: 'complete' },
      { name: 'Backend Only', value: 'backend' },
      { name: 'Frontend Only', value: 'frontend' }
    ],
    default: 'complete'
  },
  {
    type: 'confirm',
    name: 'useTailwind',
    message: 'Do you want to use Tailwind CSS?',
    default: false,
    when: (answers) => answers.projectType !== 'backend'
  },
  {
    type: 'list',
    name: 'uiLibrary',
    message: 'Which UI library would you like to use?',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'Shadcn UI', value: 'shadcn' },
      { name: 'DaisyUI', value: 'daisyui' }
    ],
    default: 'none',
    when: (answers) => answers.projectType !== 'backend' && answers.useTailwind
  }
];

module.exports = { getPrompts };
