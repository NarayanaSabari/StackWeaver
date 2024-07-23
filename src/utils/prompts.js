const getPrompts = () => [
  {
    type: 'input',
    name: 'projectName',
    message: 'What is your project name?',
    default: 'my-mern-app'
  },
  {
    type: 'confirm',
    name: 'useTailwind',
    message: 'Do you want to use Tailwind CSS?',
    default: false
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
    default: 'none'
  }
];

module.exports = { getPrompts };