const Player = require('./Player')

class TestPlayer {
  constructor (
    name = 'bob',
    chips = 1000,
    hands = null,
    bets = [],
    insuranceBet = 0
  ) {
    this.name = name
    this.chips = chips
    this.hands = hands
    this.bets = bets
    this.insuranceBet = insuranceBet
  }

  static create () {
    return new TestPlayer()
  }

  withName (name) {
    return new TestPlayer(name, this.chips, this.hands, this.bets, this.insuranceBet)
  }

  withChips (chips) {
    return new TestPlayer(this.name, chips, this.hands, this.bets, this.insuranceBet)
  }

  withHands (...hands) {
    return new TestPlayer(this.name, this.chips, hands, this.bets, this.insuranceBet)
  }

  withBets (bets) {
    return new TestPlayer(this.name, this.chips, this.hands, bets, this.insuranceBet)
  }

  withInsuranceBet (insuranceBet) {
    return new TestPlayer(this.name, this.chips, this.hands, this.bets, insuranceBet)
  }

  build () {
    const fakeLogger = { log: () => undefined }
    const player = new Player(this.name, this.chips, fakeLogger)
    if (this.hands) player.hands = this.hands
    player.bets = this.bets
    player.insuranceBet = this.insuranceBet
    return player
  }
}

module.exports = TestPlayer
