const Deck = require('../src/Deck')
const Player = require('../src/Player')
const Gen = require('verify-it').Gen
const Hand = require('../src/Hand')

describe('Player', () => {
  describe('name', () => {
    it('should be a string', () => {
      const player = new Player('Bob')
      player.name.should.eql('Bob')
    })
  })

  describe('getName()', () => {
    verify.it('should give the players name', Gen.stringWithLength(6), (name) => {
      const player = new Player(name)
      player.getName().should.eql(name)
    })
  })

  describe('getStatus()', () => {
    verify.it('should get the players status', () => {
      const player = new Player('Bob')
      player.getStatus().should.eql('playing')
    })

    verify.it('should set the players status to done after sticking 1 hand', () => {
      const player = new Player('Bob')
      player.stick()
      player.getStatus().should.eql('done')
    })

    verify.it('should set the players status to done after sticking 2 hands', () => {
      const player = new Player('Bob')
      player.hands = [new Hand(['test']),new Hand(['test'])]
      player.splitHandStick()
      player.stick()
      player.getStatus().should.eql('done')
    })
  })

  describe('getHandAmount()', () => {
    verify.it('should give the number of hands a player has', Gen.integerBetween(1,10), (amount) => {
      const player = new Player('Bob')
      player.hands = new Array(amount).fill(0)
      player.getHandAmount().should.eql(amount)
    })
  })

  describe('discardHands()', () => {
    verify.it('should remove hands and create a new hand', Gen.integerBetween(1,10), (amount) => {
      const player = new Player('Bob')
      player.hands = new Array(amount).fill(0)
      player.discardHands()
      player.getHandAmount().should.eql(1)
    })
  })
  
  describe('getHandResult()', () => {
    verify.it('should give the correct hand result', Gen.integerBetween(0,50), (expected) => {
      const player = new Player('Bob')
      player.hands[0].result = expected
      player.getHandResult().should.eql(expected)
    })
  })

  describe('getSecondHandResult()', () => {
    verify.it('should give the correct hand result', Gen.integerBetween(0,50), (expected) => {
      const player = new Player('Bob')
      player.hands = [new Hand(), new Hand()]
      player.hands[1].result = expected
      player.getSecondHandResult().should.eql(expected)
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
  
  describe('getChips()', () => {
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
      bob.hands[0].cards.length.should.eql(9)
    })
  })

  describe('placeBet()', () => {
    it('should add the bet to player bets array', () => {
      const bob = new Player('Bob', 5000)
      bob.placeBet(1000)
      bob.bets.should.eql([1000])
    })

    it('should remove chips from the player', () => {
      const player = new Player('Bob', 5000)
      player.placeBet(1000)
      player.getChips().should.eql(4000)
    })
    
    it('should place a bet not more than the players chips', () => {
      const bob = new Player('Bob', 5000)
      bob.placeBet(7000)
      bob.getBets().should.eql([5000])
      bob.getChips().should.eql(0)
    })
  })

  describe('getBets()', () => {
    verify.it('should return a players bets', Gen.integerBetween(1,9000), (bet) => {
      const bob = new Player('Bob', 9000)
      bob.placeBet(bet)
      bob.getBets().should.eql([bet])
    })
  })

  describe('removeBet()', () => {
    verify.it('should remove a bet from bets', () => { 
      const bob = new Player('Bob', 9000)
      bob.placeBet(1000)
      bob.removeBet()
      bob.bets.should.eql([])
      bob.chips.should.eql(8000)
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

    verify.it('should place another bet', Gen.integerBetween(1,11), (value) => {
      const bob = new Player('Bob', 9000)
      const deck = new Deck(['♣','♥'],[[`${value}`,value]])
      bob.placeBet(1000)
      bob.receiveCard(deck.dealCard())
      bob.receiveCard(deck.dealCard())
      bob.splitHand()
      bob.bets.should.eql([1000,1000])
    })

    verify.it('should not split if the player cannot place a matching bet', Gen.integerBetween(1,11), (value) => {
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
