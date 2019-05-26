const Deck = require('../src/Deck')
const Dealer = require('../src/Dealer')

describe('Dealer', () => {
  describe('hand', () => {
    it('should store a number of cards', () => {
      const deck = new Deck(['A','B'], [['J',10]])
      const dealer = new Dealer()
      dealer.receiveCard(deck.dealCard())
      dealer.receiveCard(deck.dealCard())
      dealer.hand.should.eql(
        [{'face': 'BJ', 'suit': 'B', 'value': 10},
         {'face': 'AJ', 'suit': 'A','value': 10}]
      )
    })
  })

 describe('removeCard()', () => {
    it('should remove a card from dealer.hand', () => {
      const deck = new Deck()
      const dealer = new Dealer()
      for(let i=10; i>0; i--) {
        dealer.receiveCard(deck.dealCard())
      }
      const removedCard = dealer.hand[4]
      dealer.removeCard(5).should.eql(removedCard)
      dealer.hand.length.should.eql(9)
    })
  })
})