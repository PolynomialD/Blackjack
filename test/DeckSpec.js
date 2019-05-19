const Deck = require('../src/Deck')
const Gen = require('verify-it').Gen

const genRandomArray = () => {
  return Gen.array(Gen.word, Gen.integerBetween(5, 30))()
}

describe('Deck', () => {
  describe('deal()', () => {
    verify.it('should remove a card', Gen.integerBetween(1,52), (cardsToDeal) => {
      const deck = new Deck()
      const expected = deck.size() - cardsToDeal
      for(cardsToDeal; cardsToDeal > 0; cardsToDeal--) {
        deck.dealCard()
      }
      deck.size().should.eql(expected)
    })
  })

  describe('cut()', () => {
    verify.it('have expected top card', Gen.integerBetween(1,52), (placeToCut) => {
      const deck = new Deck()
      const expectedTopCard = deck.cards[placeToCut] 
      deck.cut(placeToCut)
      deck.cards.indexOf(expectedTopCard).should.eql(0)
    })

    verify.it('have expected bottom card', Gen.integerBetween(6,45), (placeToCut) => {
      const deck = new Deck()
      const expectedBottomCard = deck.cards[placeToCut-1] 
      deck.cut(placeToCut)
      deck.cards.indexOf(expectedBottomCard).should.eql(deck.size() - 1)
    })

    it('should not alter the length of the deck', () => {
      const deck = new Deck()
      const original = deck.size()
      deck.size().should.eql(original)
    })
  })

  describe('shuffle()', () => {
    verify.it('should reorder the cards', () => {
      const deck = new Deck()
      const original = deck.cards
      deck.shuffle()
      deck.cards.should.not.eql(original)
    })

    it('should not alter the length of the deck', () => {
      const deck = new Deck()
      const original = deck.size()
      deck.shuffle()
      deck.size().should.eql(original)
    })
  })

  describe('with custom deck', () => {
    verify.it('should have the correct number cards', genRandomArray, genRandomArray, (suits, cards) => {
      const deck = new Deck(suits, cards)
      const expected = suits.length * cards.length
      deck.size().should.eql(expected)
    })
  })


  describe('with default cards', () => {
    verify.it('should have 52 cards', () => {
      const deck = new Deck()
      deck.size().should.eql(52)
    })

    const suits = ['♠', '♣', '♥', '♦']
    suits.forEach((suit) => {
      it(`should have 13 ${suit}`, () => {
        const deck = new Deck()
        const cards = new Array(52).fill(0).map(() => deck.dealCard())
        const suits = cards.filter((card) => card.suit === suit)
        suits.length.should.eql(13)
      })
    })
  
    const values = [2,3,4,5,6,7,8,9,10,'J','Q','K','A']
    values.forEach((value) => {
      it(`should have 4 ${value}`, () => {
        const deck = new Deck()
        const cards = new Array(52).fill(0).map(() => deck.dealCard())
        const values = cards.filter((card) => card.value === value)
        values.length.should.eql(4)
      })
    })
  })
})
