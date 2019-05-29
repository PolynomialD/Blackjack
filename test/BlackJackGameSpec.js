const BlackJackGame = require('../src/BlackJackGame')
const Gen = require('verify-it').Gen

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
    verify.it('should receive and store the players bet', Gen.integerBetween(0, 9000), Gen.integerBetween(0, 9000), (chips, bet) => {
      const game = new BlackJackGame()
      const expectedBet = (bet > chips) ? chips : bet
      const expectedTotal = (bet < chips) ? chips - bet : 0

      game.addPlayer('Bob', chips)
      game.takeBet(game.players[0].placeBet(bet))
      game.bets[0].should.eql(expectedBet)
      game.players[0].getChipsTotal().should.eql(expectedTotal)

    })
  } )
})
