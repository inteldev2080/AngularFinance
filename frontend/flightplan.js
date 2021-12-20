const plan = require('./node_modules/flightplan');

const path = '/usr/share/nginx/html/';


// configuration
plan.target('production', [
  {
    host: '45.55.32.239',
    username: 'root',
    password: 'd124ea2cf764293e1c14bc33281',
        //agent: process.env.SSH_AUTH_SOCK
  }
]);
plan.target('staging', {
    host: '167.71.169.109',
    username: 'root',
    password: '5ef8b5c433e5f6de9952a197c21'
});


// run commands on localhost
plan.local((local) => {
  local.log('Copy files to remote hosts');
});

// run commands on remote hosts (destinations)
plan.remote((remote) => {
  const repo = 'https://public_indielabs:KhalI1932ndiePub@bitbucket.org/khaleel/supplieson_front-end.git';

    // Reset git
  remote.exec(`cd ${path} && git stash -u`);

  remote.exec(`cd ${path} && git reset --hard`);

    // Pull GIT changes
  remote.cd(`${path} && git pull ${repo}`);

    // Install npm packages
  remote.exec(`cd ${path} && npm install`);

  remote.exec(`cd ${path} && gulp less`);
    // bundle css
  remote.exec(`cd ${path} && gulp bundle-css`);

    // webpack
  remote.exec(`cd ${path} && webpack`);
});
