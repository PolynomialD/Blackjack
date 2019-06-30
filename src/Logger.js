class Logger {
  constructor () {
    this.messages = []
  }

  log(message) {
    console.log(message)
    this.messages.push(message)
  }
}

module.exports = Logger
