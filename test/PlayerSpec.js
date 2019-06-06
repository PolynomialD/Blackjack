const Deck = require('../src/Deck')
const Player = require('../src/Player')
const BlackJackGame = require('../src/BlackJackGame')
const Gen = require('verify-it').Gen

function createTestGame(players = Gen.integerBetween(1,10)()) {
  const testGame = new BlackJackGame()
  for(let i=0; i<players; i++) {
    const name = Gen.stringWithLength(6)()
    const chips = Gen.integerBetween(0,9000)()
    testGame.addPlayer(name,chips)
  }
  return testGame
}

describe('Player', () => {
  describe('name', () => {
    it('should be a string', () => {
      const player = new Player('Bob')
      player.name.should.eql('Bob')
    })
  })
  
  describe('showHand()', () => {
    verify.it('should give the correct handsize',
      Gen.integerBetween(0,52), (cardsToDeal) => {
        const deck = new Deck()
        const bob = new Player('Bob', 5000)
        const expected = cardsToDeal
        for(cardsToDeal; cardsToDeal>0; cardsToDeal--) {
          bob.receiveCard(deck.dealCard())
        }
        bob.showHand().length.should.eql(expected)
    })
  })
    
  describe('chips', () => {
    it('should accept a number', () => {
      const player = new Player('Bob', 9000)
      player.getChips().should.eql(9000)
    })
  })
  
  describe('getChips', () => {
    verify.it('should give the players chips total',Gen.integerBetween(1,9000), (bet) => {
      const bob = new Player('Bob', 9000)
      const expected = 9000 - bet
      bob.placeBet(bet)
      bob.getChips().should.eql(expected)
    })
  })

  describe('receiveChips()', () => {
    verify.it('should add chips to the players chips total',
      Gen.integerBetween(1, 9000), Gen.integerBetween(1,9000), (chips, pot) => {
        const bob = new Player('Bob', chips)
        const expected = chips + pot
        bob.receiveChips(pot)
        bob.chips.should.eql(expected)
    })
  })

  describe('removeCard()', () => {
    it('should remove a card from player.hand', () => {
      const deck = new Deck()
      const bob = new Player('Bob', 5000)
      for(let i=10; i>0; i--) {
        bob.receiveCard(deck.dealCard())
      }
      const removedCard = bob.hands[0].cards[4]
      bob.removeCard(5).should.eql(removedCard)
      bob.showHand().length.should.eql(9)
    })
  })

  describe('placeBet()', () => {
    it('should remove chips from the player', () => {
      const player = new Player('Bob', 5000)
      player.placeBet(1000)
      player.getChips().should.eql(4000)
    })
    
    it('should place a bet not more than the players chips', () => {
      const bob = new Player('Bob', 5000)
      bob.placeBet(7000)
      bob.bets[0].should.eql(5000)
      bob.getChips().should.eql(0)
    })

    it('should add the bet to player bets array', () => {
      const bob = new Player('Bob', 5000)
      bob.placeBet(1000)
      bob.bets.should.eql([1000])
    })
  })

  describe('getBets()', () => {
    verify.it('should return a players bets', Gen.integerBetween(1,9000), (bet) => {
      const bob = new Player('Bob', 9000)
      bob.placeBet(bet)
      bob.getBets().should.eql([bet])
    })
  })

  describe('splitHand()', () => {
    verify.it('should split the players hand', Gen.integerBetween(1,11), (value) => {
      const bob = new Player('Bob', 9000)
      const deck = new Deck(['♣','♥'],[[`${value}`,value]])

      bob.placeBet(1000)
      deck.cards.forEach((card) => {
        bob.receiveCard(card)
      })
      bob.splitHand()
      bob.hands.length.should.eql(2)
    })

    verify.it('should only split when values are equal',
    Gen.integerBetween(1,5), Gen.integerBetween(6,11), (firstValue, secondValue) => {
      const bob = new Player('Bob', 9000)
      const deck = new Deck(['♥'],[[`${firstValue}`,firstValue],[`${secondValue}`,secondValue]])
      deck.cards.forEach((card) => {
        bob.receiveCard(card)
      })
      bob.splitHand()
      bob.hands.length.should.eql(1)
    })

    verify.it('should be able to split multiple times', Gen.integerBetween(1,11), (value) => {
      const bob = new Player('Bob', 9000)
      const deck = new Deck(['♣','♥','♠','♦'],[[`${value}`,value]])
      bob.placeBet(1000)
      bob.receiveCard(deck.dealCard())
      bob.receiveCard(deck.dealCard())
      bob.splitHand(1)
      bob.receiveCard(deck.dealCard(),1)
      bob.receiveCard(deck.dealCard(),2)
      bob.splitHand(1)
      bob.hands.length.should.eql(3)
      bob.splitHand(2)
      bob.hands.length.should.eql(4)

    })

    verify.it('should place another bet', Gen.integerBetween(1,11), (value) => {
      const bob = new Player('Bob', 9000)
      const deck = new Deck(['♣','♥'],[[`${value}`,value]])
      bob.placeBet(1000)
      bob.receiveCard(deck.dealCard())
      bob.receiveCard(deck.dealCard())
      bob.splitHand()
      bob.bets.should.eql([1000,1000])
    })

    verify.it("should not split if the player cannot place a matching bet", Gen.integerBetween(1,11), (value) => {
      const bob = new Player('Bob', 1100)
      const deck = new Deck(['♣','♥'],[[`${value}`,value]])
      bob.placeBet(1000)
      bob.receiveCard(deck.dealCard())
      bob.receiveCard(deck.dealCard())
      bob.splitHand()
      bob.hands.length.should.eql(1)
    })

  })
})
