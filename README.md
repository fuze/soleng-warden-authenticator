# Warden Authenticator

## Introduction

Warden authenticator is a Node.js library that interfaces with Fuze's authentication system which enable users to:

1. Generate a new token using a Fuze account (username/password);
2. Validate a token
3. Exchange a token with a new one

## API

### __getWardenSecurityToken__

Attempt to generate a new Bearer token, using using the provided Fuze account. If successfull will return an authentication object with user information.

#### Input 
* fuzeUsername(String, required): Fuze username
* fuzePassword(String, required): Fuze password
* useremail(String, required): Fuze email
* wardenServer(String, required): warden hostname
* wardenPort(Number, required): warden port
* appToken(String, required): application token
* apiVersion(String, Optional): API Version ( Default is 'v1')
* protocol(Node's http/https package, Option): Node package to use ( Default is 'https')

#### Output
Promise that resolves with an object with following properties:
* optionId: parameter used to generate the new token
* username: Fuze username
* password: Fuze password
* useremail: Fuze email
* status: Warden 'status' message
* msg: Warden 'msg' message
* appToken: Application token used for the request
* securityToken: The newly generated Bearer token
* cacheUntil: Validity of the securityToken
* tenantId: Tenant name
* customerCode: Organization code
* userId

### __validateWardenToken__

Checks if the provided security token is valid or not.

#### Input
* wardenServer(String, required): Warden hostname
* wardenPort(Number, required): Warden port to connect to
* security_token(String, required): Token to validate
* apiVersion(String, optional): API Version to use ( Default : 'v1')
* protocol (Node http/https package, optional): Package to use (Default: https)

#### Output

The function returns a promise holding a boolean value - true if the token is valid, false otherwise.

### __exchangeWardenToken__

This function replaces a token with a new one.

#### Input
* token(String, required): The token to replace
* wardenServer(String, required): The warden hostname

#### Output
* Promise with the Object containing the exchanged token.

### __checkIfTokenIsValid__

This function uses the same endpoint as the function validateWardenToken, therefore the input arguments are the same. The output result however is different. This function returns a promise of a javascript object containing the full authentication objec sent by warden instead of a boolean value.





