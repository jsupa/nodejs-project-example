const express = require('express')
const ip = require('ip')
const bodyParser = require('body-parser')

const helpers = require('./helpers')
const handlers = require('./handlers')
const config = require('./config')

const app = express()
const server = {}
const serverPort = config.httpPort

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.all('*', (req, res) => {
  const { headers, body, query } = req
  const trimmedPath = req.url.replace(/^\/+|\/+$/g, '')
  const method = req.method.toLowerCase()

  const choseHandler =
    typeof server.routes[trimmedPath] !== 'undefined' ? server.routes[trimmedPath] : handlers.notFound

  const data = {
    trimmedPath,
    query,
    method,
    headers,
    body
  }

  choseHandler(data, (statusCode, payload, contentType) => {
    contentType = typeof contentType === 'string' ? contentType : 'json'
    statusCode = typeof statusCode === 'number' ? statusCode : 200

    let payloadString = ''
    if (contentType === 'json') {
      res.setHeader('Content-Type', 'application/json')
      payload = typeof payload === 'object' ? payload : {}
      payloadString = JSON.stringify(payload)
    }
    if (contentType === 'html') {
      res.setHeader('Content-Type', 'text/html')
      payloadString = typeof payloadString === 'string' ? payload : {}
    }
    if (contentType === 'favicon') {
      res.setHeader('Content-Type', 'image/x-icon')
      payloadString = typeof payloadString !== 'undefined' ? payload : {}
    }
    if (contentType === 'css') {
      res.setHeader('Content-Type', 'text/css')
      payloadString = typeof payloadString !== 'undefined' ? payload : {}
    }
    if (contentType === 'png') {
      res.setHeader('Content-Type', 'image/png')
      payloadString = typeof payloadString !== 'undefined' ? payload : {}
    }
    if (contentType === 'jpg') {
      res.setHeader('Content-Type', 'image/jpeg')
      payloadString = typeof payloadString !== 'undefined' ? payload : {}
    }
    if (contentType === 'plain') {
      res.setHeader('Content-Type', 'text/plain')
      payloadString = typeof payloadString !== 'undefined' ? payload : {}
    }

    res.writeHead(statusCode)
    res.end(payloadString)

    if (statusCode === 200) {
      console.log(`[ ${helpers.getTime()} ] : ${method.toUpperCase()} /${trimmedPath} ${statusCode}`)
    } else {
      console.log(`[ ${helpers.getTime()} ] : ${method.toUpperCase()} /${trimmedPath} ${statusCode}`)
    }
  })
})

server.routes = {
  '': handlers.indmex,
  methods: handlers.methods,
  ping: handlers.ping
}

server.init = function () {
  app.listen(serverPort, () => {
    console.log(`[ ${helpers.getTime()} ] : Web server running on http://${ip.address()}:${serverPort}`)
  })
}

module.exports = server
