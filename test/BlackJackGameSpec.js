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
          const expectedChipsTotal = (bet < chips) ? chips - bet : 0

          game.addPlayer(name,chips)
          game.takeBet(game.players[i].placeBet(bet))
          console.log('bets', game.bets[i])
          game.bets[i].should.eql(expectedBet)
          console.log('chips', game.players[i].getChips())
          game.players[i].getChips().should.eql(expectedChipsTotal)
        }
    })
  })

  describe('takeBet()', () => {
    verify.it('should store the players bets', () => {
        const game = createTestGame()
        const chipsArray = []
        const betsArray = []
        for(let i=0; i < game.getNumberOfPlayers; i++) {
          const bet = Gen.integerBetween(0,9000)()
          const expectedBet = (bet > chips) ? chips : bet
          betsArray.push({'bet':bet, 'expectedBet':expectedBet})
          const chips = game.players[i].getChips()
          const expectedChipsTotal = (bet < chips) ? chips - bet : 0
          chipsArray.push({'chips': chips, 'expectedChipsTotal': expectedChipsTotal})

          game.takeBet(game.players[i].placeBet(bet))
          
        }
        for(let i=0; i < game.getNumberOfPlayers; i++) {
          game.bets[i].should.eql(betsArray[i].expectedBet)
          game.players[i].getChips().should.eql(chipsArray[i].expectedChipsTotal)
        }
    })
  })

  
})

