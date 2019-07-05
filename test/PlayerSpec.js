const Deck = require('../src/Deck')
const Player = require('../src/Player')
const Gen = require('verify-it').Gen
const Hand = require('../src/Hand')

const fakeLogger = {
  log: () => undefined
}

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
      player.stick(0)
      player.getStatus().should.eql('done')
    })

    verify.it('should set the players status to done after sticking 2 hands', () => {
      const player = new Player('Bob')
      player.hands = [new Hand(['test']),new Hand(['test'])]
      player.stick(1)
      player.stick(0)
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
      player.hands.length.should.eql(1)
    })
  })

  describe('getHandResult()', () => {
    verify.it('should give the correct hand result', Gen.integerBetween(0,50), (expected) => {
      const player = new Player('Bob', 0, fakeLogger)
      player.hands[0].result = expected
      player.getHandResult(0).should.eql(expected)
    })

    verify.it('should give the correct hand result with 2 hands', Gen.integerBetween(0,50), (expected) => {
      const player = new Player('Bob', 0, fakeLogger)
      player.hands = [new Hand(), new Hand()]
      player.hands[1].result = expected
      player.getHandResult(1).should.eql(expected)
    })
  })

  describe('showHand()', () => {
    verify.it('should give the correct handsize',
      Gen.integerBetween(0,52), (cardsToDeal) => {
        const deck = new Deck()
        const bob = new Player('Bob', 5000, fakeLogger)
        const expected = cardsToDeal
        for(cardsToDeal; cardsToDeal>0; cardsToDeal--) {
          bob.receiveCard(deck.dealCard())
        }
        bob.showHand().length.should.eql(expected)
    })
  })

  describe('showHands()', () => {
    verify.it('should return all of a players hands', () => {
      const bob = new Player('Bob', 5000, fakeLogger)
      bob.hands = [new Hand(), new Hand()]
      bob.hands[0].cards = [{value: 'test'}]
      bob.hands[1].cards = [{value: 'test'}]
      bob.showHands().should.eql([[{value: 'test'}],[{value: 'test'}]])
    })
  })

  describe('chips', () => {
    it('should accept a number', () => {
      const player = new Player('Bob', 9000)
      player.chips.should.eql(9000)
    })
  })

  describe('getChips()', () => {
    verify.it('should give the players chips total',Gen.integerBetween(1,9000), (bet) => {
      const bob = new Player('Bob', 9000, fakeLogger)
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

  describe('placeBet()', () => {
    verify.it('should add the bet to player bets array', Gen.integerBetween(1,5000), (bet) => {
      const bob = new Player('Bob', 5000, fakeLogger)
      bob.placeBet(bet)
      bob.bets.should.eql([bet])
    })

    verify.it('should remove chips from the player', Gen.integerBetween(1,5000), (bet) => {
      const player = new Player('Bob', 5000, fakeLogger)
      const expected = 5000 - bet
      player.placeBet(bet)
      player.chips.should.eql(expected)
    })

    verify.it('should place a bet not more than the players chips', Gen.integerBetween(5001,10000), (bet) => {
      const bob = new Player('Bob', 5000, fakeLogger)
      bob.placeBet(bet)
      bob.bets.should.eql([5000])
      bob.chips.should.eql(0)
    })
  })

  describe('getBets()', () => {
    verify.it('should return a players bets', Gen.integerBetween(1,9000), (bet) => {
      const bob = new Player('Bob', 9000, fakeLogger)
      bob.bets = [bet]
      bob.getBets().should.eql([bet])
    })
  })

  describe('removeBet()', () => {
    verify.it('should remove a bet from bets', () => { 
      const bob = new Player('Bob', 9000, fakeLogger)
      bob.bets = [1000]
      bob.removeBet()

      bob.bets.should.eql([])
    })
  })

  describe('placeInsuranceBet()', () => {
    verify.it('should add a bet to the insuranceBet array', Gen.integerBetween(1,5000), (bet) => {
      const bob = new Player('Bob', 5000, fakeLogger)
      const expected = bet / 2
      bob.bets = [bet]
      bob.placeInsuranceBet()
      bob.insuranceBet.should.eql(expected)
    })

    verify.it('should remove chips from the player', Gen.integerBetween(1,5000), (bet) => {
      const player = new Player('Bob', 10000, fakeLogger)
      const expected = 10000 - bet / 2
      player.bets = [bet]
      player.placeInsuranceBet()
      player.chips.should.eql(expected)
    })
  })

  describe('splitHand()', () => {
    verify.it('should split the players hand', Gen.integerBetween(1,11), (value) => {
      const bob = new Player('Bob', 9000, fakeLogger)
      const deck = new Deck(['♣','♥'],[[`${value}`,value]])

      bob.bets = [1000]
      bob.hands[0].cards.push(deck.cards[0],deck.cards[1])
      bob.splitHand()

      bob.hands.length.should.eql(2)
    })

    verify.it('should only split when values are equal',
    Gen.integerBetween(1,5), Gen.integerBetween(6,11), (firstValue, secondValue) => {
      const bob = new Player('Bob', 9000, fakeLogger)
      const deck = new Deck(['♥'],[[`${firstValue}`,firstValue],[`${secondValue}`,secondValue]])

      bob.hands[0].cards.push(deck.cards[0],deck.cards[1])
      bob.splitHand()

      bob.hands.length.should.eql(1)
    })

    verify.it('should place another bet', Gen.integerBetween(1,11), (value) => {
      const bob = new Player('Bob', 9000, fakeLogger)
      const deck = new Deck(['♣','♥'],[[`${value}`,value]])

      bob.bets = [1000]
      bob.hands[0].cards.push(deck.cards[0],deck.cards[1])
      bob.splitHand()

      bob.bets.should.eql([1000,1000])
    })

    verify.it('should not split if the player cannot place a matching bet', Gen.integerBetween(1,11), (value) => {
      const bob = new Player('Bob', 900)
      const deck = new Deck(['♣','♥'],[[`${value}`,value]])
      bob.bets = [1000]
      bob.hands[0].cards.push(deck.cards[0],deck.cards[1])
      bob.splitHand()

      bob.hands.length.should.eql(1)
    })
  })

  describe('canBetAgain', () => {
    verify.it('should return true if the player has enough chips to bet again', () => {
      const bob = new Player('Bob', 2000)
      bob.bets = [2000]
      
      bob.canBetAgain().should.eql(true)
    })

    verify.it('should return false if the player does not have enough chips to bet again', () => {
      const bob = new Player('Bob', 1000)
      bob.bets = [2000]
      
      bob.canBetAgain().should.eql(false)
    })
  })

  describe('canHalfBetAgain', () => {
    verify.it('should return true if the player has enough chips to bet half again', () => {
      const bob = new Player('Bob', 1000)
      bob.bets = [2000]
      
      bob.canHalfBetAgain().should.eql(true)
    })

    verify.it('should return false if the player does not have enough chips to bet again', () => {
      const bob = new Player('Bob', 900)
      bob.bets = [2000]
      
      bob.canHalfBetAgain().should.eql(false)
    })
  })
})
