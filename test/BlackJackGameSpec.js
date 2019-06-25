const BlackJackGame = require('../src/BlackJackGame')
const Deck = require('../src/Deck')
const Gen = require('verify-it').Gen

describe('BlackJackGame', () => {
  describe('dealCards()', () => {
    it('should deal 2 cards to each player', () => {
      const game = new BlackJackGame()
      game.addPlayer('Bob', 9000)
      game.addPlayer('Joe', 9000)
      game.dealCards()

      game.players.forEach((player) => {
        player.showHand().length.should.eql(2)
      })
    })
  })

  describe('addPlayer()', () => {
    verify.it('should add a player', () => {
      const game = new BlackJackGame()
      game.addPlayer('Bob', 9000)
      game.getNumberOfPlayers().should.eql(1)
    }) 
  })

  describe('removePlayer()', () => {
    verify.it('should remove a player from the game', Gen.integerBetween(0,2), (player) => {
      const game = new BlackJackGame()
      game.addPlayer('Bob', 9000)
      game.addPlayer('Joe', 9000)
      game.addPlayer('Jim', 9000)
      game.removePlayer(player)
      game.players.length.should.eql(2)
    })
  })

  describe('getPlayerChipsAndBets()', () => {
    verify.it('should create an array containing the players chips + bets', () => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 9000)
      const jim = game.addPlayer('Jim', 9000)
      bob.placeBet(1000)
      bob.placeBet(2000)
      jim.placeBet(5000)

      game.getPlayersChipsAndBets().should.eql([9000,9000])
    })
  })

  describe('splitHand()', () => {
    verify.it('should deal a card to each hand', () => {
      const deck = new Deck(['♣', '♦', '♥'],[['J',10],['Q',10],['K',10]])
      const game = new BlackJackGame(deck)
      const bob = game.addPlayer('Bob', 9000)
      bob.placeBet(1000)
      game.dealCards()
      game.splitHand()

      bob.hands[0].cards.length.should.eql(2)
      bob.hands[1].cards.length.should.eql(2)
    })
  })

  describe('HandValue()', () => {
    const generateDeckValues = (valueArray) => {
      return valueArray.map((value) => {
        return [`${value}`, value]
      })
    }

    verify.it('should return the sum of card values without aces', 
      Gen.array(Gen.integerBetween(2, 30), Gen.integerBetween(2, 10)()), (valueArray) => {
        const expectedValue = valueArray.reduce((total, value) => total + value)
        const values = generateDeckValues(valueArray)
        const deck = new Deck(['♠'], values)
        const game = new BlackJackGame(deck)

        game.handValue(game.deck.cards).should.eql(expectedValue)
      }
    )

    verify.it('should score an A as 1 if the total is higher than 21', 
      Gen.array(Gen.integerBetween(6, 10), 2), Gen.integerBetween(2, 6), (valueArray, numberOfAces) => {
        const values = generateDeckValues(valueArray)
        new Array(numberOfAces).fill(0).forEach(() => {
          values.push(['A', 11])
        })
        const deck = new Deck(['♠'], values)
        const expectedValue = valueArray.reduce((total, value) => total + value) + numberOfAces
        const game = new BlackJackGame(deck)
        game.handValue(game.deck.cards).should.eql(expectedValue)
      })

    verify.it('should use an ace as 11 if it can', Gen.integerBetween(1, 8), (firstValue) => {
      const secondValue = 9 - firstValue
      const values = [[`${firstValue}`, firstValue], [`${secondValue}`, secondValue], ['A', 11], ['A', 11]]
      const deck = new Deck(['♠'], values)
      const expectedValue = 21
      const game = new BlackJackGame(deck)
      game.handValue(game.deck.cards).should.eql(expectedValue)
    })
  })

  describe('playDealersHand()', () => {
    verify.it('should draw cards until hand value is 17+', () => {
      const deck = new Deck(['♣', '♦', '♥', '♠'],[['5',5],['5',5]])
      const game = new BlackJackGame(deck)
      game.dealCards()
      game.playDealersHand()
      game.handValue(game.dealer.hand.showCards()).should.eql(20)
    })
  })

  describe('payWinners()', () => {
    verify.it('should pay winners when the dealer goes bust', () => {
      const deck = new Deck(['♣', '♦', '♥', '♠'],[['J',10],['Q',10],['K',10]])
      const game = new BlackJackGame(deck)
      game.addPlayer('Bob', 1000)
      game.addPlayer('Jim', 1000)

      game.players.forEach((player) => {
        player.placeBet(1000)
      })
      game.dealCards()
      game.dealer.receiveCard(game.deck.dealCard())
      game.payWinners()

      game.players.forEach((player) => {
        player.getChips().should.eql(2000)
      })
    })

    verify.it('should pay 1.5 for a blackjack', () => {
      const deck = new Deck(['♣', '♦'],[['A',11],['K',10],['Q',10],['J',10]])
      const game = new BlackJackGame(deck)
      const jim = game.addPlayer('Jim', 9000)
      const bob = game.addPlayer('Bob', 9000)

      jim.placeBet(1000)
      bob.placeBet(1000)
      game.dealCards()
      game.payWinners()
      bob.chips.should.eql(10500)
      jim.chips.should.eql(10500)
    })

    verify.it('should give chips for split bets', () => {
      const deck = new Deck(['♣', '♦', '♥', '♠'],[['A',11],['K',10],['Q',10]])
      const game = new BlackJackGame(deck)
      const bob = game.addPlayer('Bob', 9000)
      const jim = game.addPlayer('Jim', 9000)

      jim.placeBet(1000)
      bob.placeBet(1000)
      game.dealCards()
      jim.receiveCard(game.deck.dealCard())
      bob.splitHand()
      bob.receiveCard(game.deck.dealCard(),0)
      bob.receiveCard(game.deck.dealCard(),1)
      game.payWinners()

      jim.chips.should.eql(10000)
      bob.chips.should.eql(11000)
    })

    verify.it('should return chips to the player if its a draw', Gen.integerBetween(1,21), (value) => {
      const deck = new Deck(['♣'],[['A',value],['K',value]])
      const game = new BlackJackGame(deck)
      const bob = game.addPlayer('Bob', 9000)

      bob.placeBet(1000)
      bob.receiveCard(game.deck.cards[0])
      game.dealer.receiveCard(game.deck.cards[1])
      game.payWinners()

      bob.chips.should.eql(9000)
    })

    verify.it('should remove chips from the player if they go bust', () => {
      const deck = new Deck(['♣', '♦', '♥'],[['K',10],['Q',10]])
      const game = new BlackJackGame(deck)
      const bob = game.addPlayer('Bob', 9000)

      bob.placeBet(1000)
      game.dealCards()
      bob.receiveCard(game.deck.cards[0])
      game.payWinners()

      bob.chips.should.eql(8000)
    })
  })
})
