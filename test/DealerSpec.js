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
      dealer.hand.cards.should.eql(
       [{'face': 'AJ', 'suit': 'A','value': 10},
        {'face': 'BJ', 'suit': 'B', 'value': 10}]
      )
    })
  })

  describe('handSize()', () => {
   verify.it('should give the size of the dealers hand', Gen.integerBetween(2,50), (cards) => {
      const deck = new Deck()
      const dealer = new Dealer()
      const expected = cards
      for(cards; cards>0; cards--) {
        dealer.receiveCard(deck.dealCard())
      }
      dealer.handSize().should.eql(expected)
    })
  })

 describe('removeCard()', () => {
    verify.it('should remove a card from the dealers hand', Gen.integerBetween(1,52), (cards) => {
      const deck = new Deck()
      const dealer = new Dealer()
      const expected = cards - 1
      const index = Gen.integerBetween(0,expected)()

      for(cards; cards>0; cards--) {
        dealer.receiveCard(deck.dealCard())
      }
      const removedCard = dealer.hand.cards[index]

      dealer.removeCard(index).should.eql(removedCard)
      dealer.hand.size().should.eql(expected)
    })
  })

  describe('giveChips', Gen.integerBetween(1,9000), (chips) => {
    verify.it('should return a number of chips', () => {
      const dealer = new Dealer()
      const expected = chips
      dealer.giveChips(chips).should.eql(expected)
    })

    verify.it('should remove chips from the dealer', Gen.integerBetween(1,9000), (chips) => {
      const dealer = new Dealer()
      const expected = dealer.chips - chips
      dealer.giveChips(chips)
      dealer.chips.should.eql(expected)
    })

    verify.it('should give chips to the player', () => {
      Gen.integerBetween(1,9000), Gen.integerBetween(1,9000), (chips, dealerChips) => {
        const dealer = new Dealer()
        const bob = new Player('Bob', chips)
        const expected = chips + dealerChips
        bob.receiveChips(dealer.giveChips(dealerChips))
        bob.chips.should.eql(expected)
      }
    })
  })
})