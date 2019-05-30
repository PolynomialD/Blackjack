const BlackJackGame = require('../src/BlackJackGame')
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

function createTestValues(game) {
  const testValues = new Array()
  game.players.forEach((player) => {
    const bet = Gen.integerBetween(0,9000)()
    const chips = player.getChips()
    const expectedBet = (bet > chips) ? chips : bet
    const remainingChips = (bet < chips) ? chips - bet : 0

    testValues.push({
      'bet':bet,
      'expectedBet':expectedBet,
      'chips': chips,
      'remainingChips': remainingChips
    })
  })
  return testValues
}

describe('BlackJackGame', () => {
  describe('dealCards()', () => {
    it('should deal 2 cards to each player and the dealer', () => {
      const game = new BlackJackGame()
      game.addPlayer('Bob', 9000)
      game.addPlayer('Joe', 9000)
      game.dealCards()

      game.players.forEach((player) => {
        player.handSize().should.eql(2)
      })
      
      game.dealer.handSize().should.eql(2)
    })
  })
  describe('addPlayer()', () => {
    verify.it('should add a player', () => {
      const game = new BlackJackGame()
      game.addPlayer('Bob', 9000)
      game.getNumberOfPlayers().should.eql(1)
    }) 
  })
  
  describe('takeBet()', () => {
    verify.it('should store the players bets',
      Gen.integerBetween(2,10), (players) => {
        const game = new BlackJackGame() 
        for(let i=0; i<players; i++) {
          const name = Gen.stringWithLength(6)()
          const chips = Gen.integerBetween(0,9000)()
          const bet = Gen.integerBetween(0,9000)()

          const expectedBet = (bet > chips) ? chips : bet
          const remainingChips = (bet < chips) ? chips - bet : 0

          game.addPlayer(name,chips)
          game.takeBet(game.players[i].placeBet(bet))
          console.log('bets', game.bets[i])
          game.bets[i].should.eql(expectedBet)
          console.log('chips', game.players[i].getChips())
          game.players[i].getChips().should.eql(remainingChips)
        }
    })
  })

  describe('takeBet()', () => {
    verify.it('should store the players bets', () => {
      const game = createTestGame()
      const testValues = createTestValues(game)
      console.log(testValues)

      game.players.forEach((player, index) => {
        game.takeBet(player.placeBet(testValues[index].bet))      
      })
      game.players.forEach((player, index) => {
        console.log('bet', game.bets[index], 'testbet', testValues[index].expectedBet)
        game.bets[index].should.eql(testValues[index].expectedBet)
        console.log('chips', player.getChips(), 'testchips', testValues[index].remainingChips)
        player.getChips().should.eql(testValues[index].remainingChips)
      })
    })
  })

  
})

