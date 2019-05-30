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
    verify.it('should store the players bets', () => {
      const game = createTestGame()
      const testBets = createTestBets(game)

      game.players.forEach((player, index) => {
        game.takeBet(player.placeBet(testBets[index]))      
      })
      game.bets.forEach((bet, index) => {
        bet.should.eql(testBets[index])
      })
    })
  })

  
})

