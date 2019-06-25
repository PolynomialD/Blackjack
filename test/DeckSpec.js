const Deck = require('../src/Deck')
const Gen = require('verify-it').Gen

const genRandomArray = () => {
  return Gen.array(Gen.word, Gen.integerBetween(5,30))()
}

describe('Deck', () => {
  describe('dealCard()', () => {
    verify.it('should remove a card', Gen.integerBetween(1,52), (cardsToDeal) => {
      const deck = new Deck()
      const expected = deck.size() - cardsToDeal
      for(cardsToDeal; cardsToDeal > 0; cardsToDeal--) {
        deck.dealCard()
      }
      deck.size().should.eql(expected)
    })

    verify.it('should remove the top card', () => {
      const deck = new Deck()
      const expected = deck.cards.slice(1)
      deck.dealCard()
      deck.cards.should.eql(expected)
    })

    verify.it('should return the top card', () => {
      const deck = new Deck()
      const expected = deck.cards[0]
      deck.dealCard().should.eql(expected)
    })
  })
  
  describe('dealCards()', () => {
    verify.it('should remove the correct number of cards',
      Gen.integerBetween(1,52), (cardsToDeal) => {
        const deck = new Deck()
        const expected = deck.size() - cardsToDeal
        deck.dealCards(cardsToDeal)
        deck.size().should.eql(expected)
    })

  })
  describe('cut()', () => {
    verify.it('should have expected top card', Gen.integerBetween(5,48), (placeToCut) => {
      const deck = new Deck()
      const expectedTopCard = deck.cards[placeToCut] 
      deck.cut(placeToCut)
      deck.cards.indexOf(expectedTopCard).should.eql(0)
    })

    verify.it('should have expected bottom card', Gen.integerBetween(6,45), (placeToCut) => {
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

    it('should contain valid cards after shuffling', () => {
      const validSuits = ['♣', '♦', '♥', '♠']
      const deck = new Deck()
      deck.shuffle()
      deck.cards.forEach((card) => {
        validSuits.includes(card.suit).should.eql(true)
      })
    })
  })

  describe('size()', () => {
    verify.it('should give the number of cards in the deck', Gen.integerBetween(0,51), (expected) => {
      const deck = new Deck()
      deck.cards.splice(expected)
      deck.size().should.eql(expected)
    })
  })

  describe('showDealtCards()', () => {
    verify.it('should return an array containing the dealt cards',Gen.integerBetween(1,50), (amount) => {
      const deck = new Deck()
      deck.dealCards(amount)
      const expected = deck.dealtCards
      deck.showDealtCards().should.eql(expected)
    })
  })

  describe('dealtCardsSize()', () => {
    verify.it('should give the number of dealt cards',Gen.integerBetween(1,50), (amount) => {
      const deck = new Deck()
      deck.dealCards(amount)
      const expected = deck.dealtCards.length
      deck.dealtCardsSize().should.eql(expected)

    })
  })

  describe('changeCardColour()', () => {
    verify.it('should change the cardColour',Gen.integerBetween(0,5), (initialColour) => {
      const deck = new Deck()
      deck.cardColour = initialColour 
      deck.changeCardColour()
      deck.cardColour.should.not.eql(initialColour)
    })

    verify.it('should change the cardBackPath', () => {
      const deck = new Deck()
      const initialPath = deck.cardBackPath
      deck.changeCardColour()
      deck.cardBackPath.should.not.eql(initialPath)
    })
  })

  describe('getCardBackPath()', () => {
    verify.it('should get the cardBackPath', () => {
      const deck = new Deck()
      const expected = deck.cardBackPath
      deck.getCardBackPath().should.eql(expected)
    })
  })

  describe('with custom deck', () => {
    verify.it('should have the correct number cards', genRandomArray, genRandomArray, (suits, cards) => {
      console.log(suits)
      console.log(cards)
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
  
    const faceValues = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
    faceValues.forEach((faceValue) => {
      it(`should have 4 ${faceValue}`, () => {
        const deck = new Deck()
        const cards = new Array(52).fill(0).map(() => deck.dealCard())
        const filteredValues = cards.filter((card) => card.face.includes(faceValue))
        filteredValues.length.should.eql(4)
      })
    })
  })
})
