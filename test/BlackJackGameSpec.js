const BlackJackGame = require('../src/BlackJackGame')
const Deck = require('../src/Deck')
const Gen = require('verify-it').Gen

function createTestGame(players = 8) {
  const testGame = new BlackJackGame()
  for(let i=0; i<players; i++) {
    const name = Gen.stringWithLength(6)()
    const chips = Gen.integerBetween(1,9000)()
    testGame.addPlayer(name,chips)
  }
  return testGame
}

function createTestBets(game) {
  const testBets = new Array()
  game.players.forEach((player) => {
    const bet = Gen.integerBetween(1,player.getChips())()
    testBets.push(bet)
  })
  return testBets
}

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
    verify.it('should give chips to the winning players', () => {
      const game = createTestGame()
      const testBets = createTestBets(game)
      const startingChips = []
      
      game.players.forEach((player, index) => {
        startingChips.push(player.chips)
        player.placeBet(testBets[index])
      })
      game.deck.shuffle()
      game.dealCards()
      game.players.forEach((player) => {
        player.receiveCard(game.deck.dealCard())
      })
      game.playDealersHand()
      
      const expectedChips = []
      const dealerHandValue = game.handValue(game.dealer.showHand())

      game.players.forEach((player, index) => {
        const playerHandValue = game.handValue(player.showHand())
        if(playerHandValue < 22 && playerHandValue > dealerHandValue) {
          expectedChips.push(startingChips[index] + testBets[index])
        } else if(playerHandValue < 22 && dealerHandValue > 21) {
          expectedChips.push(startingChips[index] + testBets[index])
        } else if(playerHandValue === dealerHandValue) {
          expectedChips.push(startingChips[index])
        } else {
          expectedChips.push(startingChips[index] - testBets[index])
        }
      })
      game.payWinners()
   
      game.players.forEach((player, index) => {
        player.chips.should.eql(expectedChips[index])
      })
    })

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

    verify.it('should give chips for split bets', () => {
      const deck = new Deck(['♣', '♦', '♥', '♠'],[['A',11],['K',10],['Q',10]])
      const game = new BlackJackGame(deck)
      game.addPlayer('Bob', 9000)
      game.addPlayer('Jim', 9000)
      const bob = game.players[0]
      const jim = game.players[1]

      jim.placeBet(1000)
      bob.placeBet(1000)
      game.dealCards()
      jim.receiveCard(game.deck.dealCard())
      bob.splitHand()
      bob.receiveCard(game.deck.dealCard(),1)
      bob.receiveCard(game.deck.dealCard(),2)
      game.payWinners()
      jim.chips.should.eql(10000)
      bob.chips.should.eql(11000)
    })

    verify.it('should pay 1.5 for a blackjack', () => {
      const deck = new Deck(['♣', '♦'],[['A',11],['K',10],['Q',10],['J',10]])
      const game = new BlackJackGame(deck)
      game.addPlayer('Bob', 9000)
      game.addPlayer('Jim', 9000)
      const bob = game.players[0]
      const jim = game.players[1]

      jim.placeBet(1000)
      bob.placeBet(1000)
      game.dealCards()
      game.payWinners()
      bob.chips.should.eql(11500)
      jim.chips.should.eql(11500)
    })
  })

})
