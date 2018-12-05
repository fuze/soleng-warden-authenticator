'use strict'

const AuthenticationOptions = require('./AuthenticationOptions').AuthenticationOptions;
const AuthenticationResponseParser = require('./AuthenticationResponseParser').AuthenticationResponseParser;
const https = require('https');

function getWardenSecurityToken(fuzeUsername, fuzePassword, useremail, wardenServer, wardenPort, app_token, apiVersion = 'v1', protocol = require('https')) {
  return new Promise((resolve, reject) => {
    let wardenGetPath = '/api/' + apiVersion + '/users/' + fuzeUsername + '/auth/options';
    
    let optionsget = AuthenticationOptions.createGetOptionIdOptions(wardenServer, wardenPort, wardenGetPath, app_token);
    let reqGet = protocol.request(optionsget, (res) => {

      res.on('data', (getData) => {
        let wardenWithOptionId = JSON.parse(getData);

        let originName = wardenWithOptionId.data.options[0].originName.toString();
        let optionId = AuthenticationResponseParser.getOptionId(getData.toString());

        if (originName == "portal") {
          let wardenPostPath = wardenGetPath + "/" + optionId;
          let optionspost = AuthenticationOptions.createAuthenticationOptions(wardenServer, wardenPort, wardenPostPath, app_token);
          optionspost.rejectUnauthorized = false;

          let reqPost = protocol.request(optionspost, (res) => {
            res.on('data', (postData) => {
              let postDataObj = JSON.parse(postData);

              let userId = AuthenticationResponseParser.getUserId(postData.toString());
              let tenantId = AuthenticationResponseParser.getTenantId(postData.toString());

              let wardenSecurity = {}; // this will be a javascript object.

              wardenSecurity['optionId'] = optionId;
              wardenSecurity['username'] = fuzeUsername;
              wardenSecurity['password'] = fuzePassword;
              wardenSecurity['useremail'] = useremail;
              wardenSecurity['status'] = postDataObj['status'];
              wardenSecurity['msg'] = postDataObj['msg'];
              wardenSecurity['appToken'] = app_token;

              if (postDataObj['status'] == 0) {
                wardenSecurity['securityToken'] = postDataObj.data.grant['token'];
                wardenSecurity['cacheUntil'] = postDataObj.data.grant['cacheUntil'];
                wardenSecurity['tenantId'] = tenantId;
                wardenSecurity['customerCode'] = postDataObj.data.entity['tenantKey'];
                wardenSecurity['realTenantId'] = tenantId;
                wardenSecurity['realCustomerCode'] = postDataObj.data.entity['tenantKey'];
                wardenSecurity['userId'] = userId;

                resolve(wardenSecurity);
              } else {
                  reject(postDataObj['msg'])
              }
            });
          });

          let jsonObject = JSON.stringify({
              "password": fuzePassword
          });

          reqPost.write(jsonObject);

          reqPost.end();

          reqPost.on('error', (e) => { reject(e); });

        } else {
            reject(new Error(fuzeUsername + " is not a portal (origin) user."))
        }
      });
    });

    reqGet.end();

    reqGet.on('error', (e) => { reject(e) });

  });
}

// TODO: To deprecate and use exchangeWardenToken instead
function validateWardenToken(wardenServer, wardenPort, security_token, apiVersion = 'v1', protocol = require('https')) {
  return new Promise((resolve, reject) => {
    let wardenGetPath = '/api/' + apiVersion + '/tokens/current';
    let optionsget = AuthenticationOptions.createValidateTokenOptions(wardenServer, wardenPort, wardenGetPath, security_token);
    optionsget.rejectUnauthorized = false;

    let reqGet = protocol.request(optionsget, (res) => {
        res.on('data', (getData) => {
            let getDataObj = JSON.parse(getData);
            const hasToken = getDataObj.data && getDataObj.data.grant && getDataObj.data.grant.token;
            resolve(hasToken);
        })
    })

    reqGet.end();

    reqGet.on('error', function (e) {
        reject(e)
    });
  })
}

function exchangeWardenToken(token, wardenServer) {
    return new Promise((resolve, reject) => {
      const wardenPostPath = '/api/v1/tokens/current/exchange';
      const optionspost = {
        host: wardenServer,
        path: wardenPostPath,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Long-Encoding': 'string',
        },
        rejectUnauthorized: false,
      };
  
      const reqPost = https.request(optionspost, (res) => {
        res.on('data', (getData) => {
          const getDataObj = JSON.parse(getData);
  
          if (getDataObj) {
            resolve(getDataObj);
          } else {
            reject(new Error('No Token info.'));
          }
        });
      });
  
      reqPost.end();
      reqPost.on('error', (e) => { reject(e); });
    });
  }
  
function checkIfTokenIsValid(token, wardenServer) {
    return new Promise((resolve, reject) => {
      const wardenGetPath = '/api/v1/tokens/current';
      const optionsget = {
        host: wardenServer,
        path: wardenGetPath,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Long-Encoding': 'string',
        },
        rejectUnauthorized: false,
      };
  
      const reqGet = https.request(optionsget, (res) => {
        let response = '';
        res.on('data', (getData) => {
          response += getData;
        });
  
        res.on('end', () => {
          const getDataObj = JSON.parse(response);
  
          if (getDataObj.data && getDataObj.data.grant && getDataObj.data.grant.token) {
            resolve(getDataObj);
          } else {
            reject(new Error('Invalid Token.'));
          }
        });
      });
  
      reqGet.end();
      reqGet.on('error', (e) => { reject(e); });
    });
  }
  

module.exports = {
  getWardenSecurityToken,
  validateWardenToken,
  exchangeWardenToken,
  checkIfTokenIsValid,
}