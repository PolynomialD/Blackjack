const Player = require('../src/Player')
const BlackJackGame = require('../src/BlackJackGame')
const Gen = require('verify-it').Gen

describe('BlackJackGame', () => {
  describe('deal()', () => {
    it('should deal 2 cards to each player and the dealer', () => {
      const bob = new Player('Bob', 9000)
      const joe = new Player('Joe', 5000)
      const game = new BlackJackGame()
      game.table.addPlayer(bob)
      game.table.addPlayer(joe)
      game.dealCards()
      bob.hand.length.should.eql(2)
      joe.hand.length.should.eql(2)
      game.dealer.hand.length.should.eql(2)
    })
  })
  describe('HandValue()', () => {
    it('should give the value of the dealers hand', () => {
      const bob = new Player('Bob', 9000)
      const game = new BlackJackGame()
      game.table.addPlayer(bob)
      game.dealCards()
      game.dealerHandValue().should.eql(9)
    })
    it('should give the value of the players hand', () => {
      const bob = new Player('Bob', 9000)
      const joe = new Player('Joe', 5000)
      const game = new BlackJackGame()
      game.table.addPlayer(bob)
      game.table.addPlayer(joe)
      game.dealCards()
      game.playerHandValue(1).should.eql(5)
      game.playerHandValue(2).should.eql(9)
    })
    verify.it('should deal with picture cards', () => {
      const bob = new Player('Bob', 9000)
      const joe = new Player('Joe', 8000)
      const game = new BlackJackGame()
      for(let i=9; i>0; i--) {
        joe.drawCard(game.deck)
      }
      game.table.addPlayer(bob)
      game.dealCards()
      game.playerHandValue(1).should.eql(20)
      game.dealerHandValue().should.eql(21)
    })
  })
})