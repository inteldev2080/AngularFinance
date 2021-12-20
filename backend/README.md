#SupOn
## Getting Started
Install vagrant:
[vagrant](https://www.vagrantup.com/downloads.html)

Start vagrnat:
```sh
vagrant up
```

SSH to vagrnat:
```sh
vagrant ssh
```

Start server:
```sh
# Start server
yarn start

# Selectively set DEBUG env var to get logs
DEBUG=express-mongoose-es6-rest-api:* yarn start
```

Tests:
```sh
# Run tests written in ES6 
yarn test

# Run test along with code coverage
yarn test:coverage

# Run tests on file change
yarn test:watch

# Run tests enforcing code coverage (configured via .istanbul.yml)
yarn test:check-coverage
```

Lint:
```sh
# Lint code with ESLint
yarn lint

# Run lint on any file change
yarn lint:watch
```

Other gulp tasks:
```sh
# Wipe out dist and coverage directory
gulp clean

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

Flightplna:
In order to use flight plan you need to create a deploy user and privte ssh key
[vagrant](https://gist.github.com/MohammedMutawa/0ab8f5c989e23828e660200cc3472248)
```sh
# Deploy to staging server
fly staging

# Deploy to production server
fly production

# Run forever on the server
forever start -c "node -r babel-register" ./src/index.js
```