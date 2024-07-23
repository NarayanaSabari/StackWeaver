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
    type: 'confirm',
    name: 'useShadcn',
    message: 'Do you want to use Shadcn UI?',
    default: false
  },
  {
    type: 'confirm',
    name: 'useDaisyUI',
    message: 'Do you want to use DaisyUI?',
    default: false
  },
  {
    type: 'confirm',
    name: 'useGraphQL',
    message: 'Do you want to set up GraphQL?',
    default: false
  }
];

module.exports = { getPrompts };