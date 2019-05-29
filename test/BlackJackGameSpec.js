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
          game.bets[i].should.eql(expectedBet)
          game.players[i].getChipsTotal().should.eql(expectedChipsTotal)
        }
    })
  })

})

