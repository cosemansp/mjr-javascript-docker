const { send } = require('micro')

module.exports = (req, res) => {
  send(res, 200, {
    id: Date.now(),
    message: 'Hello from Now deployment',
  })
}
