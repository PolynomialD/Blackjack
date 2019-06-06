const BlackJackGame = require('../src/BlackJackGame')
const Deck = require('../src/Deck')

const Gen = require('verify-it').Gen

function createTestGame(players = 8) {
  const testGame = new BlackJackGame()
  for(let i=0; i<players; i++) {
    const name = Gen.stringWithLength(6)()
    const chips = Gen.integerBetween(0,9000)()
    testGame.addPlayer(name,chips)
  }
  return testGame
}

function createTestBets(game) {
  const testBets = new Array()
  game.players.forEach((player) => {
    const bet = Gen.integerBetween(0,player.getChips())()
    testBets.push(bet)
  })
  return testBets
}

describe('BlackJackGame', () => {
  describe('dealCards()', () => {
    it('should deal 2 cards to each player', () => {
      const game = new BlackJackGame()
      game.addPlayer('Bob', 9000)
      game.addPlayer('Joe', 9000)
      game.dealCards()

      game.players.forEach((player) => {
        player.showHand().length.should.eql(2)
      })
    })
  })

  describe('addPlayer()', () => {
    verify.it('should add a player', () => {
      const game = new BlackJackGame()
      game.addPlayer('Bob', 9000)
      game.getNumberOfPlayers().should.eql(1)
    }) 
  })

  describe('takeBets()', () => {
    verify.it('should store the players bets', () => {
      const game = createTestGame()
      const testBets = createTestBets(game)
      game.players.forEach((player, index) => {
        player.placeBet(testBets[index])
      })
      game.takeBets()
      testBets.forEach((bet, index) => {
        game.bets[index].should.eql([bet])
      })
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
        const expectedValue = valueArray.reduce((total, value) => total + value)
        const values = generateDeckValues(valueArray)
        const deck = new Deck(['♠'], values)
        const game = new BlackJackGame(deck)

        game.handValue(game.deck.cards).should.eql(expectedValue)
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
        const game = new BlackJackGame(deck)
        game.handValue(game.deck.cards).should.eql(expectedValue)
      })

    verify.it('should use an ace as 11 if it can', Gen.integerBetween(1, 8), (firstValue) => {
      const secondValue = 9 - firstValue
      const values = [[`${firstValue}`, firstValue], [`${secondValue}`, secondValue], ['A', 11], ['A', 11]]
      const deck = new Deck(['♠'], values)
      const expectedValue = 21
      const game = new BlackJackGame(deck)
      game.handValue(game.deck.cards).should.eql(expectedValue)
    })
  })
})

