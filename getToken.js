#!/usr/bin/env node

const warden = require('./fuzeAuth.js');
const chalk = require('chalk');
const config = require('./config.json');

require('yargs')
  .usage('$0 <cmd> [args]')
  .command('getToken <username> <password> <app_token>', 'Get a token from warden using a username, password and an app token', (yargs) => {
      yargs.positional('username', {
        type: 'string',
        describe: 'Fuze Username',
      });

      yargs.positional('password', {
        type: 'string',
        describe: 'Fuze Password',
      });

      yargs.positional('app_token', {
        type: 'string',
        describe: 'Access token needed to get the token',
      });
  }, async function(argv) {

    try {
      const { securityToken } = await warden.getWardenSecurityToken(argv.username, argv.password, '', config.wardenServer, config.wardenPort, argv.app_token);
      console.log(securityToken);
    } catch (e) {
      console.log(e);
      console.log(
        chalk.red.bold('Error: could not get the security token')
      );
    }
  })
  .help()
  .argv;