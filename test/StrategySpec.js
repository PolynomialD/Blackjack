const Strategy = require('../src/Strategy')
const Gen = require('verify-it').Gen

describe('Strategy', () => {
  describe.only('correctMove()', () => {
    verify.it('should give the correct move for pairs', () => {
      new Strategy().correctMove(10, "pair of 9's").should.eql('stick')
      new Strategy().correctMove(9, "pair of 9's").should.eql('split')
    })

    verify.it('should give the correct move for hard 17-21 ', Gen.integerBetween(2,11), Gen.integerBetween(17,21), (dealerValue, playerValue) => {
      new Strategy().correctMove(dealerValue, `hard ${playerValue}`).should.eql('stick')
    })
  })
})