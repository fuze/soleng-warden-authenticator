'use strict'

const test = require('tape')
const AuthenticationOptions = require('../AuthenticationOptions').AuthenticationOptions

test('test create Authentication Options object for get-OptionsId request', (t) => {
    
    let expServer = "expected server"
    let expPort = 443
    let expMethod = 'GET'
    let expApiVersion = 'v1'
    let expFuzeUser = 'ifrias'
    let expPath = '/api/' + expApiVersion + '/users/' + expFuzeUser + '/auth/options'
    let expAppToken = 'tokenxpto'
    
    let  expOptions = {
        host : expServer,
        port : expPort,
        path : expPath,
        method : expMethod,
        headers : {
            'Authorization' : expAppToken,
            'Accept'        : 'application/json'
        }
    }
    
    let options = AuthenticationOptions.createGetOptionIdOptions(expServer, undefined, expPath, expAppToken)
    t.deepEquals(options, expOptions)
    t.end()
})

test('test create Authentication Options object for authentication request', (t) => {
    
    let expServer = "expected server"
    let expPort = 443
    let expMethod = 'POST'
    let expApiVersion = 'v1'
    let expFuzeUser = 'ifrias'
    let expPath = '/api/' + expApiVersion + '/users/' + expFuzeUser + '/auth/options'
    let expAppToken = 'tokenxpto'
    
    var expOptions = {
        host : expServer,
        port : expPort,
        path : expPath,
        method : expMethod,
        headers : {
            'Authorization' : 'Bearer ' + expAppToken,
            'Accept'        : 'application/json',
            'Content-Type'  : 'application/json'
        }
    };
    
    let options = AuthenticationOptions.createAuthenticationOptions(expServer, undefined, expPath, expAppToken)
    t.deepEquals(options, expOptions)
    t.end()
})

test('test create validation options object for token-validation request', (t) => {
    
    let expServer = "expected server"
    let expPort = 443
    let expMethod = 'GET'
    let expApiVersion = 'v1'
    let expFuzeUser = 'ifrias'
    let expPath = '/api/' + expApiVersion + '/tokens/current'
    let expSecurityToken = 'tokenxpto'
    
    let expOptions = {
        host : expServer,
        port : expPort,
        path : expPath,
        method :expMethod,
        headers : {
            'Authorization' : 'Bearer ' + expSecurityToken,
            'Accept'        : 'application/json',
            'Content-Type'  : 'application/json'
        }
    }

    let options = AuthenticationOptions.createValidateTokenOptions(expServer, undefined, expPath, expSecurityToken)
    t.deepEquals(options, expOptions)
    t.end()

})