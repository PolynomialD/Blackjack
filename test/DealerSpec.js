const Deck = require('../src/Deck')
const Dealer = require('../src/Dealer')
const Gen = require('verify-it').Gen
const Hand = require('../src/Hand')

describe('Dealer', () => {
  describe('receiveCard', () => {
    verify.it('should put a card into the dealers hand', Gen.integerBetween(0,51), (card) => {
      const deck = new Deck()
      const dealer = new Dealer()
      const expected = deck.cards[card]

      dealer.receiveCard(deck.cards[card])
      dealer.hands[0].cards[0].should.eql(expected)
    })
  })

  describe('showsAnAce', () => {
    verify.it('should return true if the dealer shows an ace', () => {
      const dealer = new Dealer()
      dealer.hands[0].cards = [{value: 10}, {value: 11}]

      dealer.showsAnAce().should.eql(true)
    })

    verify.it('should return false if the dealer does not show an ace', () => {
      const dealer = new Dealer()
      dealer.hands[0].cards = [{value: 1}, {value: 1}]

      dealer.showsAnAce().should.eql(false)
    })
  })

  describe('handSize()', () => {
   verify.it('should give the size of the dealers hand', Gen.integerBetween(2,50), (amount) => {
      const deck = new Deck()
      const dealer = new Dealer()

      for(let i=0; i<amount; i++) {
        dealer.hands[0].cards.push(deck.cards[i])
      }
      dealer.handSize().should.eql(amount)
    })
  })

  describe('giveChips()', Gen.integerBetween(1,9000), (chips) => {
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
  })

  describe('receiveChips()', () => {
    verify.it('should give chips to the dealer', Gen.integerBetween(1,9000), (chips) => {
      const dealer = new Dealer()
      dealer.receiveChips(chips)
      dealer.chips.should.eql(1000000 + chips)
    })
  })

  describe('hasBlackJack()', () => {
    verify.it('should return true if the dealer has blackjack', () => {
      const dealer = new Dealer()
      dealer.hands[0].cards = [{value: 10, face: ''},{value: 11, face:''}]
      dealer.hasBlackJack().should.eql(true)
    })

    verify.it('should return false if the dealer does not have blackjack', () => {
      const dealer = new Dealer()
      dealer.hands[0].cards = [{value: 10, face: ''},{value: 10, face:''},{value: 1, face:''}]
      dealer.hasBlackJack().should.eql(false)
    })
  })
})