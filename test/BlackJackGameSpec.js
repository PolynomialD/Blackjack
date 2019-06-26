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

  describe('nextRound()', () => {
    verify.it('should discard the players and dealers hands', () => {
      const game = new BlackJackGame()
      const jim = game.addPlayer('Jim', 9000)
      game.dealCards()
      game.nextRound()

      jim.hands[0].cards.should.eql([])
      game.dealer.hand.cards.should.eql([])
    })

    verify.it('should remove players with no chips', () => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 9000)
      const jim = game.addPlayer('Jim', 9000)
      const joe = game.addPlayer('Joe', 9000)
      joe.placeBet(9000)
      jim.placeBet(5000)
      bob.placeBet(9000)
      game.nextRound()

      game.players.length.should.eql(1)
    })

    verify.it('should create a new deck when the deck is low', () => {
      const deck = new Deck(['♣', '♦', '♥'],[['A',11],['K',10],['Q',10],['J',10]])
      const game = new BlackJackGame(deck)
      game.addPlayer('Jim', 9000)
      game.addPlayer('Bob', 9000)
      game.dealCards()
      game.nextRound()

      game.deck.cards.length.should.eql(312)
    })

    verify.it('should set current player to 0', Gen.integerBetween(1,12), (player) => {
      const game = new BlackJackGame()
      game.currentPlayer = player
      game.nextRound()

      game.currentPlayer.should.eql(0)
    })
  })

  describe('nextPlayer()', () => {
    verify.it('should increase currentPlayer by 1', Gen.integerBetween(1,12), (player) => {
      const game = new BlackJackGame()
      game.currentPlayer = player
      game.nextPlayer()

      game.currentPlayer.should.eql(player+1)
    })
  })

  describe('getCurrentPlayer()', () => {
    verify.it('should get the current players position', Gen.integerBetween(1,12), (player) => {
      const game = new BlackJackGame()
      game.currentPlayer = player

      game.getCurrentPlayer().should.eql(player)
    })
  })

  describe('getRound()', () => {
    verify.it('should get the round number', Gen.integerBetween(1,12), (round) => {
      const game = new BlackJackGame()
      game.round = round

      game.getRound().should.eql(round)
    })
  })

  describe('getBetCount()', () => {
    verify.it('should get the bet count', Gen.integerBetween(1,12), (betCount) => {
      const game = new BlackJackGame()
      game.betCount = betCount

      game.getBetCount().should.eql(betCount)
    })
  })

  describe('addBetToCount', () => {
    verify.it('should increase the betCount by 1', Gen.integerBetween(1,12), (betCount) => {
      const game = new BlackJackGame()
      game.betCount = betCount
      game.addBetToCount()

      game.betCount.should.eql(betCount+1)
    })
  })

  describe('getCardCount', () => {
    verify.it('should get the correct card count for high cards', () => {
      const deck = new Deck(['♣', '♦', '♥', '♠'],[['Q',10],['K',10]])
      const game = new BlackJackGame(deck)
      game.addPlayer('Bob', 9000)
      game.addPlayer('Jim', 9000)
      game.dealCards()
      game.getCardCount().should.eql(-6)
    })

    verify.it('should get the correct card count for low cards', () => {
      const deck = new Deck(['♣', '♦', '♥', '♠'],[['2',2],['3',3]])
      const game = new BlackJackGame(deck)
      game.addPlayer('Bob', 9000)
      game.addPlayer('Jim', 9000)
      game.dealCards()
      game.getCardCount().should.eql(6)
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

  describe('changeCardColour()', () => {
    verify.it('should change the card back colour', () => {
      const game = new BlackJackGame()
      const initialColour = game.deck.cardColour
      game.changeCardColour()

      game.deck.cardColour.should.not.eql(initialColour)
    })
  })
})
