const Gen = require('verify-it').Gen
const Hand = require('../src/Hand')
const Deck = require('../src/Deck')
const expect = require('chai').expect

generateCards = (amount) => {
  return () => {
    const deck = new Deck()
    deck.shuffle()
    return new Array(amount).fill(0).map(() => deck.dealCard())
  }
}

describe('completeHand', () => {
  verify.it('should return false for a new hand', () => {
    const hand = new Hand()
    hand.isComplete().should.be.false
  })

  verify.it('should return true for a complete hand', () => {
    const hand = new Hand()
    hand.completeHand()
    hand.isComplete().should.be.true
  })
})

describe('Hand', () => {
  verify.it('should be able to takecards', generateCards(5), (cards) => {
    const hand = new Hand()
    cards.forEach((card) => {
      hand.takeCard(card)
    })
    hand.cards.should.eql(cards)
  })

  verify.it('should be able to take and show cards', generateCards(5), (cards) => {
    const hand = new Hand(cards)
    hand.showCards().should.eql(cards)
  })

  verify.it('should return the correct hand size', Gen.integerBetween(3,50), (length) => {
    const cards = generateCards(length)()
    const hand = new Hand(cards)
    hand.size().should.eql(length)
  })

  describe('getCard()', () => {
    verify.it('should remove the correct card', generateCards(10), Gen.integerBetween(1, 9), (cards, randomIndex) => {
      const hand = new Hand(cards)
      const expectedCard = cards[randomIndex]
      hand.getCard(randomIndex).should.eql(expectedCard)
    })

    verify.it('should reduce the hand size by 1', generateCards(10), (cards) => {
      const numberOfCardsToRemove = Gen.integerBetween(1, Math.floor(cards.length/2))()
      const expectedHandSize = cards.length - numberOfCardsToRemove

      const hand = new Hand(cards)
      
      for (let i = numberOfCardsToRemove; i > 0; i--) {
        hand.getCard(0)
      }
      hand.size().should.eql(expectedHandSize)
    })
  })

  describe('isSplittable()', () => {
    verify.it('should return false if it can\'t be split', () => {
      const deck = new Deck(['♣'], [['10', 10],['5', 5]])
      const hand = new Hand(deck.cards)
      hand.isSplittable().should.eql(false)
    })

    verify.it('should return true if it can be split', () => {
      const deck = new Deck(['♣', '♦'], [['10', 10]])
      const hand = new Hand(deck.cards)
      hand.isSplittable().should.eql(true)
    })

    verify.it('should return false if there are more than 2 cards', () => {
      const deck = new Deck(['♣', '♦', '♥'], [['10', 10]])
      const hand = new Hand(deck.cards)
      hand.isSplittable().should.eql(false)
    })
  })

  describe('split()', () => {
    verify.it('should return 2 hand objects if hand is splittable', () => {
      const deck = new Deck(['♣', '♦'], [['10', 10]])
      const hand = new Hand(deck.cards)
      const newHands = hand.split()
      newHands.forEach((h) => {
        h.showCards().length.should.eql(1)
        h.getCard(0).value.should.eql(10)
      })
    })

    verify.it('should return undefined if hand is not splittable', () => {
      const deck = new Deck(['♣'], [['10', 10],['5', 5]])
      const hand = new Hand(deck.cards)
      const newHands = hand.split()
      expect(newHands).to.be.undefined
    })
  })

  describe('trueValue()', ()=> {
    verify.it('should give the true value of a hand with blackjack', () => {
      const deck = new Deck(['♣'], [['A', 11],['10', 10]])
      const hand = new Hand(deck.cards)
      const expected = 'blackjack'
      hand.trueValue().should.eql(expected)
    })

    verify.it('should give the true value a hand with a pair', Gen.integerBetween(2,11), (value) => {
      const deck = new Deck(['♣'], [['', value],['', value]])
      const hand = new Hand(deck.cards)
      const expected = `pair of ${value}'s`
      hand.trueValue().should.eql(expected)
    })

    verify.it('should give the true value of a soft hand', Gen.integerBetween(2,9), (value) => {
      const deck = new Deck(['♣'], [['A', 11],['', value]])
      const hand = new Hand(deck.cards)
      const expected = `soft ${hand.value()}`
      hand.trueValue().should.eql(expected)
    })

    verify.it('should give the true value of a soft hand with 3 cards', Gen.integerBetween(2,4), (value) => {
      const deck = new Deck(['♣'], [['A', 11],['', value],['', value]])
      const hand = new Hand(deck.cards)
      const expected = `soft ${hand.value()}`
      hand.trueValue().should.eql(expected)
    })

    verify.it('should give the true value of a hard hand', Gen.integerBetween(2,6), Gen.integerBetween(7,10), (first, second) => {
      const deck = new Deck(['♣'], [['', first],['', second]])
      const hand = new Hand(deck.cards)
      const expected = `hard ${hand.value()}`
      hand.trueValue().should.eql(expected)
    })

    verify.it('should give the true value of a hard hand with an ace', Gen.integerBetween(6,10), (value) => {
      const deck = new Deck(['♣'], [['A', 11],['', value],['', value]])
      const hand = new Hand(deck.cards)
      const expected = `hard ${hand.value()}`
      hand.trueValue().should.eql(expected)
    })
  })
})
