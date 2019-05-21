const Deck = require('../src/Deck')
const Player = require('../src/Player')
const Gen = require('verify-it').Gen


describe('Player', () => {
  describe('name', () => {
    it('should be a string', Gen.string, (name) => {
      const player = new Player(name)
      player.name.should.eql(name.toString())
    })
  })

  describe('cards', () => {
    it('should be an array of cards', () => {
      const deck = new Deck(['A','B'], ['X'])
      console.log(deck)
      const player = new Player('Bob')
      player.takeCards(2, deck)
      player.cards.should.eql(
        [
          {
          'suit': 'B',
          'value': 'X'
          },
          {
          'suit': 'A',
          'value': 'X'
          }
        ]
      )
    })
  })
})