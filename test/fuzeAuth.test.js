'use strict'

const test = require('tape')
const { getWardenSecurityToken, validateWardenToken }  = require('../fuzeAuth')
const { startServer, closeServer } = require('./wardenServer')
const http = require('http')

test('test successfull fuze authentication & validation', (t) => {
    
    let host = '127.0.0.1'
    let apiVersion = 'v1'
    let port = 9000
    let expUsername = 'test'
    let expPassword = 'secret'
    let expUseremail = 'test@fuze.com'
    let expAppToken = 'app123'
    let expSecurityToken = 'token_xpto'
    let expUserId = 153606174551115445
    let expOptionId = 273404561489189045
    let expCacheUntil = 1466461991215
    let expTenantId = 241201070120894465
    let expCustomerCode = "fuze"
    let expOriginName = "portal"
    let expAuthResponseStatus = 0
    let expAuthResponseMsg = "ok"
    let expTokenValidation = true
    
    let expGetOptionsIdResponse = {
        "data": {
            "options": [
                {
                    "optionId": expOptionId,
                    "mode": "basic",
                    "originName": expOriginName,
                    "wardenSupported": true
                }
            ]
        },
        "status": 0,
        "version": "1.0",
        "msg": "ok"
    }
    
    let expAuthResponse = getAuthResponse(expUserId, expTenantId, expCacheUntil, expSecurityToken, expAuthResponseStatus, expAuthResponseMsg)
    
    let expFuzeAuthResponse = {
        'optionId' : String(expOptionId),
        'username' : expUsername,
        'password' : expPassword,
        'useremail' : expUseremail,
        'status' : expAuthResponseStatus,
        'msg' : expAuthResponseMsg,
        'appToken' : expAppToken,
        'securityToken' : expSecurityToken,
        'cacheUntil' : expCacheUntil,
        'tenantId' : String(expTenantId),
        'customerCode' : expCustomerCode,
        'realTenantId' : String(expTenantId),
        'realCustomerCode' : expCustomerCode,
        'userId' : String(expUserId)
    }
    
    startServer(port, apiVersion, expUsername, expGetOptionsIdResponse, expAuthResponse).then((server) => {
        getWardenSecurityToken(expUsername, expPassword, expUseremail, host, port, expAppToken, apiVersion, require('http') ).then((authResponse) => {
            
            t.deepEquals(authResponse, expFuzeAuthResponse)
            
            validateWardenToken(host, port, expSecurityToken, apiVersion, require('http')).then((state) => {
                
                t.equals(state, expTokenValidation)
                closeServer(() => { t.end() })
            })
            .catch((err) => {
                t.fail(err)
                closeServer( () => { t.end() })
            })
            
        }).catch((err) => {
            
            console.log(err)
            
            t.fail(err)
            closeServer( () => { t.end() })
            
        })
    })
    .catch((err) => {
        console.log(err)
        
        t.fail(err)
        closeServer( () => { t.end() })
    })
})


const getAuthResponse = (expUserId, expTenantId, expCacheUntil, expSecurityToken, expAuthResponseStatus, expAuthResponseMsg) => {
    return {
        "data": {
            "entity": {
                "userId": expUserId,
                "tenantId": expTenantId,
                "fullName": "User Full name",
                "origin": {
                    "name": "portal",
                    "id": "{user_name}"
                },
                "tenantKey": "fuze",
                "active": true,
                "userKeys": [
                    "{user_name}"
                ],
                "emails": []
            },
            "grant": {
                "cacheUntil": expCacheUntil,
                "token": expSecurityToken
            },
            "type": "user"
        },
        "status": expAuthResponseStatus,
        "version": "1.0",
        "msg": expAuthResponseMsg
    }
}