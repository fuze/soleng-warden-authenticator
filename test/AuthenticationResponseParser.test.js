'use strict'

const test = require('tape')
const AuthenticationResponseParser = require('../AuthenticationResponseParser').AuthenticationResponseParser

test('test get OptionId from get-options Response', (t) => {
    
    let expOptionId = 273404561489189045
    let response = {
        "data": {
            "options": [
                {
                    "optionId": expOptionId,
                    "mode": "basic",
                    "originName": "mydomain-app",
                    "wardenSupported": true
                }
            ]
        },
        "status": 0,
        "version": "1.0",
        "msg": "ok"
    }
    
    let optionId = AuthenticationResponseParser.getOptionId(JSON.stringify(response))
    t.equals(Number(optionId), expOptionId)
    t.end()
    
})

test('test get userId from authentication response', (t) => {
    
    let expUserId = 153606174551115445
    let response = { 
        "data": {
            "entity": {
                "userId": expUserId,
                "tenantId": 241201070120894465,
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
                "cacheUntil": 1466461991215,
                "token": "{user_token}"
            },
            "type": "user"
        },
        "status": 0,
        "version": "1.0",
        "msg": "ok"
    }

    let userId = AuthenticationResponseParser.getUserId(JSON.stringify(response))
    t.equals(Number(userId), expUserId)
    t.end()

})

test('test get tenantId from authentication response', (t) => {
    
    let expTenantId = 241201070120894465
    let response = { 
        "data": {
            "entity": {
                "userId": 153606174551115445,
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
                "cacheUntil": 1466461991215,
                "token": "{user_token}"
            },
            "type": "user"
        },
        "status": 0,
        "version": "1.0",
        "msg": "ok"
    }

    let tenantId = AuthenticationResponseParser.getTenantId(JSON.stringify(response))
    t.equals(Number(tenantId), expTenantId)
    t.end()
})