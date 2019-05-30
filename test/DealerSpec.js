const Deck = require('../src/Deck')
const Dealer = require('../src/Dealer')
const Player = require('../src/Player')
const Gen = require('verify-it').Gen

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

  describe('giveChips', () => {
    it('should return a number of chips', () => {
      const dealer = new Dealer()
      dealer.giveChips(1000).should.eql(1000)
    })

    verify.it('should remove chips from the dealer', Gen.integerBetween(1, 9000), (chips) => {
      const dealer = new Dealer()
      const expected = dealer.chips - chips
      dealer.giveChips(chips)
      dealer.chips.should.eql(expected)
    })

    verify.it('should give chips to the player', () => {
      Gen.integerBetween(1, 9000), Gen.integerBetween(1, 9000), (chips, dealerChips) => {
        const dealer = new Dealer()
        const bob = new Player('Bob', chips)
        const expected = chips + dealerChips
        bob.receiveChips(dealer.giveChips(dealerChips))
        bob.chips.should.eql(expected)
      }
    })
  })
})