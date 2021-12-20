const plan = require('flightplan');
const packageJson = require('./package.json');

// const path = '/usr/share/nginx/api/supplieson_backend/';
const path = '/usr/share/nginx/api/supplieson_backend/';
let gitUsername = '';
let gitPassword = '';

// configuration staging
plan.target('staging', [
  {
    host: '167.71.169.109',
    username: 'root',
    password: '5ef8b5c433e5f6de9952a197c21',
    // privateKey: './deploy_private_key',
    agent: process.env.SSH_AUTH_SOCK
  }
]);

// configuration production
plan.target('production', [
  {
    host: '45.55.32.239',
    username: 'root',
    password: '9ec1e14b4812705740ca4d8d271',
    // privateKey: './deploy_private_key',
    agent: process.env.SSH_AUTH_SOCK
  }
]);


// run commands on localhost
plan.local((local) => {
  local.log('Local');
  gitUsername = 'MRashad_IndieLabs';
  gitPassword = 'Rashad_Atlassian_dev2';
  // gitUsername = local.prompt('Enter git username');
  // gitPassword = local.prompt('Enter git password');
});

// run commands on remote hosts (destinations)
plan.remote((remote) => {
  remote.log('Remote');
  if (!packageJson.repository.url.includes('https://')) {
    throw new Error('Repository url in package.json should start with https://domain.com/');
  }
  const repo = packageJson.repository.url.replace('https://', `https://${gitUsername}:${gitPassword}@`);
  // Reset git
  remote.exec(`cd ${path} && git stash -u`);

  remote.exec(`cd ${path} && git reset --hard`);
  // Pull GIT changes
  remote.cd(`${path} && git pull ${repo}`);

  // Install npm packages
  remote.exec(`cd ${path} && yarn install`);

  // Restart forever
  remote.exec(`cd ${path} && forever stop 0 && forever start -c "node -r babel-register" ./index.js ./`);

  // remote.exec('cp -r /usr/share/nginx/api/supplieson_backend/font/ /usr/share/fonts/truetype/');
  remote.exec('cp -r /usr/share/nginx/api/supplieson_backend/font/ /usr/share/fonts/truetype/');
  // remote.exec('forever stop ~/'+appName+'/'+startFile, {failsafe: true});
  // remote.exec('forever start ~/'+appName+'/'+startFile);
});
