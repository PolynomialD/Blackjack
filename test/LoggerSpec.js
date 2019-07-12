const Logger = require('../src/Logger')
const Gen = require('verify-it').Gen

describe('Logger', () => {
  describe('log()', () => {
    verify.it('should log a message to messages', Gen.string, (testString) => {
      const logger = new Logger()
      logger.log(testString)
      logger.messages.should.eql([testString])
    })
  })
})