const Strategy = require('../src/Strategy')

describe('Strategy', () => {
  describe.only('correctMove()', () => {
    verify.it('should give the correct move for pairs', () => {
      new Strategy().correctMove(10, 'pair of 9"s').should.eql('stand')
      new Strategy().correctMove(9, 'pair of 9"s').should.eql('split')

    })
  })
})