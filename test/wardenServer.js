'use strict'

const express = require('express')

let server

function startServer(port, apiVersion = 'v1', username, optionsIdResponse, authResponse) {
    
    return new Promise( (resolve, reject) => {
        
        console.log('Starting server...')
        
        let app = express()
        
        server = app.listen(port, () => {
            resolve()
        })
        
        //1. Simulate get options Id 
        app.get('/api/' + apiVersion + '/users/' + username + '/auth/options', (req, res) => {
            res.send(optionsIdResponse)
        })
        
        //2. Simulate token authentication
        app.post('/api/' + apiVersion + '/users/' + username + '/auth/options/' + optionsIdResponse.data.options[0].optionId, (req, res) => {
            res.send(authResponse)
        })
        
        //3. Simulate token validation
        app.get('/api/' + apiVersion + '/tokens/current', (req, res) => {
            res.send(authResponse)
        })
    })
    
}

function closeServer(finished){
    if(server) {
        console.log('Closing server...')
        server.close(() => {
            finished()
        })
    }
}

module.exports = {
    closeServer : closeServer,
    startServer : startServer
}