const Player = require('../src/Player')
const Gen = require('verify-it').Gen
const Hand = require('../src/Hand')
const TestPlayer = require('./TestPlayer')

const fakeLogger = {
  log: () => undefined
}

describe('Player', () => {
  describe('name', () => {
    it('should be a string', () => {
      const player = new Player('Bob')
      player.name.should.eql('Bob')
    })
  })

  describe('getName()', () => {
    verify.it('should give the players name', Gen.stringWithLength(6), (name) => {
      const player = new Player(name)
      player.getName().should.eql(name)
    })
  })

  describe('getStatus()', () => {
    verify.it('should get the players status', () => {
      const player = new Player('Bob')
      player.getStatus().should.eql('playing')
    })

    verify.it('should set the players status to done after sticking 1 hand', () => {
      const player = new Player('Bob', 0, fakeLogger)
      player.stick(0)
      player.getStatus().should.eql('done')
    })

    verify.it('should set the players status to done after sticking 2 hands', () => {
      const player = new Player('Bob', 0, fakeLogger)
      player.hands = [new Hand(['test']),new Hand(['test'])]
      player.stick(1)
      player.stick(0)
      player.getStatus().should.eql('done')
    })
  })

  describe('getHandAmount()', () => {
    verify.it('should give the number of hands a player has', Gen.integerBetween(1,10), (amount) => {
      const player = new Player('Bob')
      player.hands = new Array(amount).fill(0)
      player.getHandAmount().should.eql(amount)
    })
  })

  describe('discardHands()', () => {
    verify.it('should remove hands and create a new hand', Gen.integerBetween(1,10), (amount) => {
      const bob = TestPlayer.create().build()
      bob.hands = new Array(amount).fill(0)

      bob.discardHands()

      bob.hands.length.should.eql(1)
    })
  })

  describe('getHandResult()', () => {
    verify.it('should give the correct hand result', Gen.integerBetween(0,50), (result) => {
      const bob = TestPlayer.create().build()

      bob.hands[0].result = result

      bob.getHandResult(0).should.eql(result)
    })

    verify.it('should give the correct hand result with 2 hands', Gen.integerBetween(0,50), (result) => {
      const bob = TestPlayer.create().withHands(new Hand(), new Hand()).build()

      bob.hands[1].result = result

      bob.getHandResult(1).should.eql(result)
    })
  })

  describe('showHands()', () => {
    verify.it('should return all of a players hands', Gen.integerBetween(0,50), (value) => {
      const bob = TestPlayer.create().withHands(new Hand([{value}]),new Hand([{value}])).build()

      bob.showHands().should.eql([[{value}],[{value}]])
    })
  })

  describe('chips', () => {
    it('should accept a number', () => {
      const bob = TestPlayer.create().withChips(9000).build()

      bob.chips.should.eql(9000)
    })
  })

  describe('getChips()', () => {
    verify.it('should give the players chips total',Gen.integerBetween(1,9000), (bet) => {
      const bob = TestPlayer.create().withChips(9000).build()
      const expected = 9000 - bet

      bob.placeBet(bet)

      bob.getChips().should.eql(expected)
    })
  })

  describe('receiveChips()', () => {
    verify.it('should add chips to the players chips total', Gen.integerBetween(1, 9000), Gen.integerBetween(1,9000), (chips, pot) => {
        const bob = TestPlayer.create().withChips(chips).build()
        const expected = chips + pot

        bob.receiveChips(pot)

        bob.chips.should.eql(expected)
    })
  })

  describe('placeBet()', () => {
    verify.it('should add the bet to player bets array', Gen.integerBetween(1,5000), (bet) => {
      const bob = TestPlayer.create().withChips(5000).build()

      bob.placeBet(bet)

      bob.bets.should.eql([bet])
    })

    verify.it('should remove chips from the player', Gen.integerBetween(1,5000), (bet) => {
      const bob = TestPlayer.create().withChips(5000).build()
      const expected = 5000 - bet

      bob.placeBet(bet)

      bob.chips.should.eql(expected)
    })

    verify.it('should place a bet not more than the players chips', Gen.integerBetween(5001,10000), (bet) => {
      const bob = TestPlayer.create().withChips(5000).build()

      bob.placeBet(bet)

      bob.bets.should.eql([5000])
      bob.chips.should.eql(0)
    })
  })

  describe('doubleBet()', () => {
    verify.it('should double a players initial bet', Gen.integerBetween(1,5000), (bet) => {
      const bob = TestPlayer.create().withChips(5000).withBets([bet]).build()
      const expected = [bet * 2]

      bob.doubleBet()

      bob.bets.should.eql(expected)
    })

    verify.it('should remove chips from the player', Gen.integerBetween(1,5000), (bet) => {
      const player = TestPlayer.create().withChips(10000).withBets([bet]).build()
      const expected = 10000 - bet

      player.doubleBet()

      player.chips.should.eql(expected)
    })
  })

  describe('getBets()', () => {
    verify.it('should return a players bets', Gen.integerBetween(1,9000), (bet) => {
      const bob = TestPlayer.create().withBets([bet]).build()

      bob.bets = [bet]

      bob.getBets().should.eql([bet])
    })
  })

  describe('getInsuranceBet()', () => {
    verify.it('should return a players insurance bet', Gen.integerBetween(1,9000), (bet) => {
      const bob = TestPlayer.create().withInsuranceBet([bet]).build()

      bob.getInsuranceBet().should.eql([bet])
    })
  })

  describe('removeBet()', () => {
    verify.it('should remove a bet from bets', Gen.integerBetween(1,5000), (bet) => {
      const bob = TestPlayer.create().withChips(9000).withBets([bet]).build()

      bob.removeBet()

      bob.bets.should.eql([])
    })
  })

  describe('placeInsuranceBet()', () => {
    verify.it('should add a bet to the insuranceBet array', Gen.integerBetween(1,5000), (bet) => {
      const bob = TestPlayer.create().withChips(9000).withBets([bet]).build()
      const expected = bet / 2

      bob.placeInsuranceBet()

      bob.insuranceBet.should.eql(expected)
    })

    verify.it('should remove chips from the player', Gen.integerBetween(1,5000), (bet) => {
      const bob = TestPlayer.create().withChips(9000).withBets([bet]).build()
      const expected = 9000 - bet / 2

      bob.placeInsuranceBet()

      bob.chips.should.eql(expected)
    })
  })

  describe('removeInsuranceBet()', () => {
    verify.it('should change InsuranceBet to 0', () => { 
      const bob = TestPlayer.create().withChips(9000).withInsuranceBet(1000).build()

      bob.removeInsuranceBet()

      bob.insuranceBet.should.eql(0)
    })
  })

  describe('splitHand()', () => {
    verify.it('should split the players hand', Gen.integerBetween(1,11), (value) => {
      const bob = TestPlayer.create().withChips(9000).withBets([1000]).withHands(new Hand([{value},{value}])).build()

      bob.splitHand()

      bob.hands.length.should.eql(2)
    })

    verify.it('should only split when values are equal',
      Gen.integerBetween(1,5), Gen.integerBetween(6,11), (firstValue, secondValue) => {
      const bob = TestPlayer.create().withChips(9000).withHands(new Hand([{firstValue},{secondValue}])).build()

      bob.splitHand()

      bob.hands.length.should.eql(1)
    })

    verify.it('should place another bet', Gen.integerBetween(1,11), (value) => {
      const bob = TestPlayer.create().withChips(9000).withBets([1000]).withHands( new Hand([{value},{value}])).build()

      bob.splitHand()

      bob.bets.should.eql([1000,1000])
    })

    verify.it('should not split if the player cannot place a matching bet', Gen.integerBetween(1,11), (value) => {
      const bob = TestPlayer.create().withChips(900).withBets([1000]).withHands(new Hand([{value},{value}])).build()

      bob.splitHand()

      bob.hands.length.should.eql(1)
    })
  })

  describe('canBetAgain', () => {
    verify.it('should return true if the player has enough chips to bet again', () => {
      const bob = TestPlayer.create().withChips(2000).withBets([2000]).build()

      bob.canBetAgain().should.eql(true)
    })

    verify.it('should return false if the player does not have enough chips to bet again', () => {
      const bob = TestPlayer.create().withChips(1000).withBets([2000]).build()

      bob.canBetAgain().should.eql(false)
    })
  })

  describe('canHalfBetAgain', () => {
    verify.it('should return true if the player has enough chips to bet half again', () => {
      const bob = TestPlayer.create().withChips(1000).withBets([2000]).build()

      bob.canHalfBetAgain().should.eql(true)
    })

    verify.it('should return false if the player does not have enough chips to bet half again', () => {
      const bob = TestPlayer.create().withChips(900).withBets([2000]).build()

      bob.canHalfBetAgain().should.eql(false)
    })
  })
})
