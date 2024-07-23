const moduleAlias = require('module-alias');
const path = require('path');

moduleAlias.addAliases({
  '@': path.join(__dirname, 'src'),
  '@controllers': path.join(__dirname, 'src', 'controllers'),
  '@config': path.join(__dirname, 'src', 'config'),
  '@routes': path.join(__dirname, 'src', 'routes'),
  '@middleware': path.join(__dirname, 'src', 'middleware'),
  '@mongodb': path.join(__dirname, 'src', 'modules', 'mongodb'),
  '@utils': path.join(__dirname, 'src', 'utils'),
  '@services': path.join(__dirname, 'src', 'services')
})