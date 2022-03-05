const helpers = require('../lib/helpers')

const method = {}

method.get = function (data, callback) {
  callback(200, { Status: 'Get pineapple' })
}

method.post = function (data, callback) {
  const timer = setInterval(check, 1000)
  const start = helpers.getTimestamp()

  function check() {
    if (helpers.getMinutes() % 5 === 0) {
      clearInterval(timer)
      const loadTime = helpers.getTimestamp() - start
      callback(200, { status: 'Post pineapple', load: loadTime }, 'json')
    }
  }
}

module.exports = method
