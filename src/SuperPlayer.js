const Player = require('./Player')

class SuperPlayer {
  constructor(name, chips, logger) {
    this.name = name
    this.chips = chips
    this.logger = logger || { log: () => undefined }
    this.hands = this.createHands()
  }

  createHands(hands) {
    for(let i=1; i<=hands; i++) {
     return [].push(new Player(`hand ${i}`, 100000, this.logger))
    }
  }

  adjustChips() {
    let adjustment
    this.hands.forEach((hand) => {
      adjustment += (hand.getChips() - 100000)
    })
    this.chips += adjustment
  }
}

module.exports = SuperPlayer