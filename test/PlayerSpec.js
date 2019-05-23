const Deck = require('../src/Deck')
const Player = require('../src/Player')

describe('Player', () => {
  describe('name', () => {
    it('should be a string', () => {
      const player = new Player('Bob')
      player.name.should.eql('Bob')
    })
  })

  describe('hand', () => {
    it('should store a number of cards', () => {
      const deck = new Deck(['A','B'], [10])
      const player = new Player('Bob')
      player.drawCard(deck)
      player.drawCard(deck)
      player.hand.should.eql(
        [{'suit': 'B', 'value': 10},
         {'suit': 'A','value': 10}]
      )
    })
  })

  describe('chips', () => {
    it('should accept a number', () => {
      const player = new Player('Bob', 9000)
      player.chips.should.eql(9000)
    })

    it('should be 0 if not given a number', () => {
      const player = new Player('Bob', 'string')
      player.chips.should.eql(1000)
    })  
  })


  describe('removeCard()', () => {
    it('should remove a card from player.hand', () => {
      const deck = new Deck()
      const player = new Player('Bob', 5000)
      for(let i=10; i>0; i--) {
        player.drawCard(deck)
      }
      const removedCard = player.hand[4]
      player.removeCard(5).should.eql(removedCard)
      player.hand.length.should.eql(9)
    })
  })

  describe('placeBet()', () => {
    it('should remove chips from the player', () => {
      const player = new Player('Bob', 5000)
      player.placeBet(1000)
      player.chips.should.eql(4000)
    })
    
    it('should return a number not more than the players chips', () => {
      const player = new Player('Bob', 5000)
      player.placeBet(7000).should.eql(5000)
      player.chips.should.eql(0)
    })
  })
})
