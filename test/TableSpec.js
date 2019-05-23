const Deck = require('../src/Deck')
const Table = require('../src/Table')
const Player = require('../src/Player')

describe('Table', () => {
  describe('drawCard()', () => {
    it('should draw a card from the deck', () => {
      const deck = new Deck()
      const table = new Table()
      const topCard = deck.cards[0]
      table.drawCard(deck)
      table.cards[0].should.eql(topCard)
      deck.size().should.eql(51)
    })
  })

  describe('addPlayer()', () => {
    it('should add a player to players', () => {
      const table = new Table()
      const bob = new Player('Bob',5000)
      table.addPlayer(bob)
      table.players.should.eql([bob])
    })
    it('should give each player a position and an id', () => {
      const table = new Table()
      const bob = new Player('Bob',5000)
      const joe = new Player('Joe',3000)
      table.addPlayer(bob)
      table.addPlayer(joe)
      bob.position.should.eql(1)
      bob.id.should.eql('player 1')
      joe.position.should.eql(2)
      joe.id.should.eql('player 2')
    })
  })

})