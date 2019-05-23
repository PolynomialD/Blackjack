const Player = require('../src/Player')
const BlackJackGame = require('../src/BlackJackGame')

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
})