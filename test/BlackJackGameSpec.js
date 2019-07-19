const BlackJackGame = require('../src/BlackJackGame')
const Deck = require('../src/Deck')
const Gen = require('verify-it').Gen

const fakeLogger = {
  log: () => undefined
}

describe('BlackJackGame', () => {
  describe('dealCards()', () => {
    it('should deal 2 cards to each player', () => {
      const game = new BlackJackGame()
      game.addPlayer('Bob', 9000, fakeLogger)
      game.addPlayer('Joe', 9000, fakeLogger)
      game.dealCards()

      game.players.forEach((player) => {
        player.hands[0].cards.length.should.eql(2)
      })
    })
  })

  describe('addPlayer()', () => {
    verify.it('should add a player', () => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 9000, fakeLogger)

      game.players[0].should.eql(bob)
    }) 
  })

  describe('removePlayer()', () => {
    verify.it('should remove a player from the game', Gen.integerBetween(0,2), (player) => {
      const game = new BlackJackGame()
      game.addPlayer('Bob', 9000, fakeLogger)
      game.addPlayer('Joe', 9000, fakeLogger)
      game.addPlayer('Jim', 9000, fakeLogger)
      game.removePlayer(player)

      game.players.length.should.eql(2)
    })
  })

  describe('splitHand()', () => {
    verify.it('should deal a card to each hand', () => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 9000, fakeLogger)
      bob.bets = [1000]
      bob.hands[0].cards = [{value: 'test', face: ''}, {value: 'test', face: ''}]
      game.splitHand()

      bob.hands[0].cards.length.should.eql(2)
      bob.hands[1].cards.length.should.eql(2)
    })

    verify.it('should only deal 1 card to split aces then stick', () => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 9000, fakeLogger)
      bob.bets = [1000]
      bob.hands[0].cards = [{value: 11, face: ''}, {value: 11, face: ''}]
      game.splitHand()
      bob.getStatus().should.eql('done')
    })
  })

  describe('doubleDown()', () => {
    verify.it('should double the bet', Gen.integerBetween(1000,9000), (bet) => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 9000, fakeLogger)
      const expected = bet * 2
      bob.bets = [bet]
      game.doubleDown()
      bob.bets.should.eql([expected])
    })

    verify.it('should draw 1 card', Gen.integerBetween(1,12), (cards) => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 9000, fakeLogger)
      bob.bets = [1000]
      bob.hands[0].cards = new Array(cards).fill(0)
      game.doubleDown()
      bob.hands[0].cards.length.should.eql(cards+1)
    })

    verify.it('should stick after drawing a card', () => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 9000, fakeLogger)
      bob.bets = [1000]
      game.doubleDown()
      bob.getStatus().should.eql('done')
    })
  })

  describe('playDealersHand()', () => {
    verify.it('should draw cards until hand value is between 17 and 21', () => {
      const deck = new Deck(['♣', '♦', '♥', '♠'],[['5',5],['5',5]])
      const game = new BlackJackGame(deck)
      game.dealer.hands[0].cards = [{value: 5, face: ''}, {value: 5, face: ''}]
      game.playDealersHand()

      game.dealer.hands[0].cards.length.should.eql(4)
    })

    verify.it('should draw a card on a soft 17', () => {
      const game = new BlackJackGame()
      game.dealer.hands[0].cards = [{value: 11, face: 'A'}, {value: 6, face: '6'}]
      game.playDealersHand()

      game.dealer.hands[0].cards.length.should.not.eql(2)
    })

    verify.it('should not draw a card on a hard 17', () => {
      const game = new BlackJackGame()
      game.dealer.hands[0].cards = [{value: 10, face: 'K'}, {value: 7, face: '7'}]
      game.playDealersHand()

      game.dealer.hands[0].cards.length.should.eql(2)
    })
  })

  describe('nextRound()', () => {
    verify.it('should discard the players and dealers hands', () => {
      const game = new BlackJackGame()
      const jim = game.addPlayer('Jim', 9000, fakeLogger)
      game.dealer.hands[0].cards = [{value: 'test'}, {value: 'test'}]
      jim.hands[0].cards = [{value: 'test'}, {value: 'test'}]
      game.nextRound()

      jim.hands[0].cards.should.eql([])
      game.dealer.hands[0].cards.should.eql([])
    })

    verify.it('should remove players with no chips', () => {
      const game = new BlackJackGame()
      game.addPlayer('Bob', 0, fakeLogger)
      game.addPlayer('Jim', 9000, fakeLogger)
      game.addPlayer('Joe', 0, fakeLogger)
      game.nextRound()

      game.players.length.should.eql(1)
    })

    verify.it('should create a new deck when the deck is low', () => {
      const deck = new Deck(['♣', '♦', '♥'],[['A',11],['K',10],['Q',10],['J',10]])
      const game = new BlackJackGame(deck)
      game.addPlayer('Jim', 9000, fakeLogger)
      game.addPlayer('Bob', 9000, fakeLogger)
      game.dealCards()
      game.nextRound()

      game.deck.cards.length.should.eql(312)
    })

    verify.it('should set current player to 0', Gen.integerBetween(1,12), (player) => {
      const game = new BlackJackGame()
      game.currentPlayerIndex = player
      game.nextRound()

      game.currentPlayerIndex.should.eql(0)
    })
  })

  describe('nextPlayer()', () => {
    verify.it('should increase currentPlayer by 1', Gen.integerBetween(1,12), (player) => {
      const game = new BlackJackGame()
      game.currentPlayerIndex = player
      game.nextPlayer()

      game.currentPlayerIndex.should.eql(player+1)
    })
  })

  describe('getCurrentPlayerIndex()', () => {
    verify.it('should get the current players position', Gen.integerBetween(1,12), (player) => {
      const game = new BlackJackGame()
      game.currentPlayerIndex = player

      game.getCurrentPlayerIndex().should.eql(player)
    })
  })

  describe('getCurrentPlayer()', () => {
    verify.it('should get the current player',  Gen.integerBetween(0,2), (index) => {
      const game = new BlackJackGame()
      game.addPlayer('Bob', 0, fakeLogger)
      game.addPlayer('Jim', 9000, fakeLogger)
      game.addPlayer('Joe', 0, fakeLogger)
      const expected = game.players[index]
      
      game.currentPlayerIndex = index
      game.getCurrentPlayer().should.eql(expected)
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
      game.addPlayer('Bob', 9000, fakeLogger)
      game.addPlayer('Jim', 9000, fakeLogger)
      game.dealCards()
      game.getCardCount().should.eql(-6)
    })

    verify.it('should get the correct card count for low cards', () => {
      const deck = new Deck(['♣', '♦', '♥', '♠'],[['2',2],['3',3]])
      const game = new BlackJackGame(deck)
      game.addPlayer('Bob', 9000, fakeLogger)
      game.addPlayer('Jim', 9000, fakeLogger)
      game.dealCards()
      game.getCardCount().should.eql(6)
    })
  })

  describe('payWinners()', () => {
    verify.it('should pay winners when the dealer goes bust', () => {
      const deck = new Deck(['♣', '♦', '♥', '♠'],[['J',10],['Q',10],['K',10]])
      const game = new BlackJackGame(deck)
      const bob = game.addPlayer('Bob', 1000, fakeLogger)
      const jim = game.addPlayer('Jim', 1000, fakeLogger)

      bob.bets = [1000]
      jim.bets = [1000]
      game.dealCards()
      game.dealer.receiveCard(game.deck.dealCard())
      game.payWinners()

     bob.chips.should.eql(3000)
     jim.chips.should.eql(3000) 
    })

    verify.it('should pay 1.5 for a blackjack', () => {
      const deck = new Deck(['♣', '♦'],[['A',11],['K',10],['Q',10],['J',10]])
      const game = new BlackJackGame(deck)
      const jim = game.addPlayer('Jim', 9000, fakeLogger)
      const bob = game.addPlayer('Bob', 9000, fakeLogger)

      jim.bets = [1000]
      bob.bets = [1000]
      game.dealCards()
      game.payWinners()

      bob.chips.should.eql(11500)
      jim.chips.should.eql(11500)
    })

    verify.it('should give chips for split bets', () => {
      const deck = new Deck(['♣', '♦', '♥', '♠'],[['A',11],['K',10],['Q',10]])
      const game = new BlackJackGame(deck)
      const bob = game.addPlayer('Bob', 9000, fakeLogger)
      const jim = game.addPlayer('Jim', 9000, fakeLogger)

      jim.bets = [1000]
      bob.bets = [1000]
      game.dealCards()
      jim.receiveCard(game.deck.dealCard())
      bob.splitHand()
      bob.receiveCard(game.deck.dealCard(),0)
      bob.receiveCard(game.deck.dealCard(),1)
      game.payWinners()

      jim.chips.should.eql(11000)
      bob.chips.should.eql(12000)
    })

    verify.it('should return chips to the player if its a draw', Gen.integerBetween(1,10), (value) => {
      const deck = new Deck(['♣', '♦', '♥'],[['K',value],['Q',value]])
      const game = new BlackJackGame(deck)
      const bob = game.addPlayer('Bob', 0, fakeLogger)

      bob.bets = [1000]
      game.dealCards()
      game.payWinners()

      bob.chips.should.eql(1000)
    })

    verify.it('should remove chips from the player if they go bust', () => {
      const deck = new Deck(['♣', '♦', '♥'],[['K',10],['Q',10]])
      const game = new BlackJackGame(deck)
      const bob = game.addPlayer('Bob', 9000, fakeLogger)

      bob.bets = [1000]
      game.dealCards()
      bob.receiveCard(game.deck.cards[0])
      game.payWinners()

      bob.chips.should.eql(9000)
    })

    verify.it('should pay insurance bets if the dealer has blackjack', () => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 1000, fakeLogger)
      game.dealer.hands[0].cards = [{value: 10, face: ''},{value: 11, face:''}]
      bob.insuranceBet = 1000
      game.payWinners()

      bob.chips.should.eql(3000)
    })

    verify.it('should remove insurance bets if the dealer does not have blackjack', () => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 1000, fakeLogger)
      game.dealer.hands[0].cards = [{value: 10, face: ''},{value: 10, face:''}]
      bob.insuranceBet = 1000
      game.payWinners()

      bob.insuranceBet.should.eql(0)
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

  describe('logWinnings()', () => {
    verify.it('should log the players wins to logger messages', Gen.integerBetween(1000, 9000), (winnings) => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 1000)
      bob.winnings = winnings
      game.logWinnings()
      game.logger.messages[1].should.eql(`Bob wins ${winnings}`)
    })

    verify.it('should log the players losses to logger messages', Gen.integerBetween(1000, 9000), (losses) => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 1000)
      bob.winnings = -losses
      game.logWinnings()
      game.logger.messages[1].should.eql(`Bob loses -${losses}`)
    })

    verify.it('should log the players break evens to logger messages', () => {
      const game = new BlackJackGame()
      const bob = game.addPlayer('Bob', 1000)
      bob.winnings = 0
      game.logWinnings()
      game.logger.messages[1].should.eql(`Bob breaks even`)
    })
  })
})
