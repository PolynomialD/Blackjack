const Deck = require('../src/Deck')
const Player = require('../src/Player')
const BlackJackGame = require('../src/BlackJackGame')
const Gen = require('verify-it').Gen

describe('Player', () => {
  describe('name', () => {
    it('should be a string', () => {
      const player = new Player('Bob')
      player.name.should.eql('Bob')
    })
  })
  
  describe('hand', () => {
    it('should store a number of cards', () => {
      const deck = new Deck(['A','B'], [['J',10]])
      const player = new Player('Bob')
      player.receiveCard(deck.dealCard())
      player.receiveCard(deck.dealCard())
      player.hand.should.eql(
        [{'face': 'BJ', 'suit': 'B', 'value': 10},
        {'face': 'AJ', 'suit': 'A','value': 10}]
        )
      })
    })
    
  describe('chips', () => {
    it('should accept a number', () => {
      const player = new Player('Bob', 9000)
      player.getChips().should.eql(9000)
    })
    
    it('should be 0 if not given a number', () => {
      const player = new Player('Bob', 'string')
      player.getChips().should.eql(1000)
    })  
  })
  
  describe('getChips', () => {
    verify.it('should give the players chips total',Gen.integerBetween(1, 9000), (bet) => {
      const bob = new Player('Bob', 9000)
      const expected = 9000 - bet
      bob.placeBet(bet)
      bob.getChips().should.eql(expected)
    })
  })

  describe('receiveChips()', () => {
    verify.it('should add chips to the players chips total',
      Gen.integerBetween(1, 9000), Gen.integerBetween(1, 9000), (chips, pot) => {
        const bob = new Player('Bob', chips)
        const expected = chips + pot
        bob.receiveChips(pot)
        bob.chips.should.eql(expected)
    })
  })

  describe('removeCard()', () => {
    it('should remove a card from player.hand', () => {
      const deck = new Deck()
      const player = new Player('Bob', 5000)
      for(let i=10; i>0; i--) {
        player.receiveCard(deck.dealCard())
      }
      const removedCard = player.hand[4]
      player.removeCard(5).should.eql(removedCard)
      player.handSize().should.eql(9)
    })
  })

  describe('placeBet()', () => {
    it('should remove chips from the player', () => {
      const player = new Player('Bob', 5000)
      player.placeBet(1000)
      player.getChips().should.eql(4000)
    })
    
    it('should return a number not more than the players chips', () => {
      const player = new Player('Bob', 5000)
      player.placeBet(7000).should.eql(5000)
      player.getChips().should.eql(0)
    })
  })

  describe('HandValue()', () => {
    const generateDeckValues = (valueArray) => {
      return valueArray.map((value) => {
        return [`${value}`, value]
      })
    }

    verify.it('should return the sum of card values without aces', 
      Gen.array(Gen.integerBetween(2, 30), Gen.integerBetween(2, 10)()), (valueArray) => {
        const bob = new Player('Bob', 9000)
        const expectedValue = valueArray.reduce((total, value) => total + value)
        const values = generateDeckValues(valueArray)
        const deck = new Deck(['♠'], values)
        valueArray.forEach(() => {
          bob.receiveCard(deck.dealCard())
        })
        bob.handValue().should.eql(expectedValue)
      }
    )

    verify.it('should score an A as 1 if the total is higher than 21', 
      Gen.array(Gen.integerBetween(6, 10), 2), Gen.integerBetween(2, 6), (valueArray, numberOfAces) => {
        const values = generateDeckValues(valueArray)

        new Array(numberOfAces).fill(0).forEach(() => {
          values.push(['A', 11])
        })

        const deck = new Deck(['♠'], values)
        const expectedValue = valueArray.reduce((total, value) => total + value) + numberOfAces

        const bob = new Player('Bob', 9000)
        values.forEach(() => {
          bob.receiveCard(deck.dealCard())
        })
        
        bob.handValue().should.eql(expectedValue)
      })

    verify.it('should use an ace as 11 if it can', Gen.integerBetween(1, 8), (firstValue) => {
      const secondValue = 9 - firstValue
      const values = [[`${firstValue}`, firstValue], [`${secondValue}`, secondValue], ['A', 11], ['A', 11]]
      const deck = new Deck(['♠'], values)
      const expectedValue = 21

      const bob = new Player('Bob', 9000)
      values.forEach(() => {
        bob.receiveCard(deck.dealCard())
      })
      bob.handValue().should.eql(expectedValue)
    })
  })

  describe('splitCards()', () => {
    verify.it('should split the players cards', () => {
      const bob = new Player('Bob', 9000)
      const deck = new Deck(['♠', '♣', '♥', '♦'],[['10',10],['J',10],['Q', 10],['K', 10]])
      bob.receiveCard(deck.dealCard())
      bob.receiveCard(deck.dealCard())
      bob.splitCards()
      bob.handSize().should.eql(1)
      bob.handSize(2).should.eql(1)
      bob.handValue().should.eql(10)
      bob.handValue(2).should.eql(10)
    })
  })

})
