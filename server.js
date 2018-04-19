const LocalWebServer = require('local-web-server')
const localWebServer = new LocalWebServer()
const server = localWebServer.listen({
  port: process.env.PORT || 5000,
  https: true,
  directory: 'src',
  spa: 'index.html',
  websocket: 'src/websocket-server.js'
})
// secure, SPA server with listening websocket now ready on port 8050

// Stop listening when/if server is no longer needed
server.close()
