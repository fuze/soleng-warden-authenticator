'use strict'

exports.AuthenticationOptions = class AuthenticationOptions {

    static createGetOptionIdOptions(server, port = 443, path, app_token) {
        return createWardenOptions(server, path, 'GET', port, { 'Authorization' :  app_token , 'Accept' : 'application/json' })
    }

    static createAuthenticationOptions(server, port = 443, path, app_token) {
        return createWardenOptions(server, path, 'POST', port, { 'Authorization' : 'Bearer ' +  app_token , 'Accept' : 'application/json' , 'Content-Type' : 'application/json'} )
    }

    static createValidateTokenOptions(server, port = 443, path, security_token) {
        return createWardenOptions(server, path, 'GET', port, { 'Authorization' : 'Bearer '  + security_token , 'Accept' : 'application/json', 'Content-Type'  : 'application/json'} )
    }
}

const createWardenOptions = (server, path, method, port, headers) => {
    return {
        host : server,
        port : port,
        path : path,
        method : method,
        headers : headers
    };
}