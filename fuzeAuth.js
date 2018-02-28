'use strict'

const AuthenticationOptions = require('./AuthenticationOptions').AuthenticationOptions
const AuthenticationResponseParser = require('./AuthenticationResponseParser').AuthenticationResponseParser

function getWardenSecurityToken (fuzeUsername, fuzePassword, useremail, wardenServer, wardenPort, app_token, apiVersion = 'v1', protocol = require('https')) {
    return new Promise((resolve, reject) => {

        let wardenGetPath = '/api/' + apiVersion + '/users/' + fuzeUsername + '/auth/options';

        let optionsget =  AuthenticationOptions.createGetOptionIdOptions(wardenServer, wardenPort, wardenGetPath, app_token)
        
        let reqGet = protocol.request(optionsget, (res) => {
            console.log("statusCode: " + res.statusCode);
            
            res.on('data', (getData) => {
                let wardenWithOptionId = JSON.parse(getData);
                console.log('GET result: ' + getData);
                
                let originName = wardenWithOptionId.data.options[0].originName.toString();
                let optionId = AuthenticationResponseParser.getOptionId(getData.toString())
                
                if(originName == "portal") {
                    let wardenPostPath = wardenGetPath + "/" + optionId ;
                    let optionspost = AuthenticationOptions.createAuthenticationOptions(wardenServer, wardenPort, wardenPostPath, app_token)
                    
                    let reqPost = protocol.request(optionspost, (res) => {
                        res.on('data', (postData) => {

                            let postDataString = postData.toString();
                            let postDataObj = JSON.parse(postData);
                            
                            let userId = AuthenticationResponseParser.getUserId(postData.toString())
                            let tenantId = AuthenticationResponseParser.getTenantId(postData.toString())

                            let wardenSecurity = {}; // this will be a javascript object.
                            
                            wardenSecurity['optionId'] = optionId;
                            wardenSecurity['username'] = fuzeUsername;
                            wardenSecurity['password'] = fuzePassword;
                            wardenSecurity['useremail'] = useremail;
                            wardenSecurity['status'] = postDataObj['status'];
                            wardenSecurity['msg'] = postDataObj['msg'];
                            wardenSecurity['appToken'] = app_token;
                            
                            if(postDataObj['status'] == 0) {
                                
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
                    
                    let jsonObject = JSON.stringify({ "password" : fuzePassword });
                    
                    reqPost.write(jsonObject);
                    
                    reqPost.end();
                    
                    reqPost.on('error', (e) => {
                        reject(e)
                    });
                    
                } else {
                    reject(new Error(fuzeUsername + " is not a portal (origin) user."))
                }
                
            });
        });

        reqGet.end();

        reqGet.on('error', (e) => {
            reject(e);
        });

    });
}

function validateWardenToken(wardenServer, wardenPort, security_token, apiVersion = 'v1', protocol = require('https')){

    return new Promise( (resolve, reject) => {
        let wardenGetPath = '/api/' + apiVersion + '/tokens/current'
        let optionsget = AuthenticationOptions.createValidateTokenOptions(wardenServer, wardenPort, wardenGetPath, security_token)

        let reqGet = protocol.request(optionsget, (res) => {
            res.on('data', (getData)  => {
                let getDataString = getData.toString();
                let getDataObj = JSON.parse(getData);
                if(getDataObj.data.grant.token !== undefined) {
                    resolve(true)
                }else {
                    reject(false)
                }
            })
        })

        reqGet.end();

        reqGet.on('error', function(e) {
            reject(e)
        });    
    })
}

module.exports = {
    getWardenSecurityToken : getWardenSecurityToken,
    validateWardenToken : validateWardenToken
}