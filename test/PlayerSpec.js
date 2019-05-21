const Deck = require('../src/Deck')
const Player = require('../src/Player')
const Gen = require('verify-it').Gen


describe('Player', () => {
  describe('name', () => {
    it('should be a string', Gen.string, (name) => {
      const player = new Player(name)
      player.name.should.eql(name)
    })
  })

  describe('cards', () => {
    it('should be an array of cards', () => {
      const deck = new Deck(['A','B'], [10])
      const player = new Player('Bob')
      player.takeCards(2, deck)
      player.cards.should.eql(
        [
          {
          'suit': 'B',
          'value': 10
          },
          {
          'suit': 'A',
          'value': 10
          }
        ]
      )
    })
  })

  describe('chips', () => {
    it('should be a number',  Gen.string, Gen.integerBetween(0, 5000), (string, number) => {
      const player = new Player('Bob', string)
      player.chips.should.eql(0)
      const player2 = new Player('Marley', number)
      player2.chips.should.eql(number)
    })
  })

  describe('discardCard()', () => {
    it('should remove a card from player.cards', () => {
      const deck = new Deck()
      const player = new Player('Bob', 5000)
      player.takeCards(10, deck)
      const removedCard = player.cards[4]
      player.discardCard(5).should.eql(removedCard)
    })
  })  
})