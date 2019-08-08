const Player = require('./Player')

class SoloPlayer {
  constructor(chips, hands, logger) {
    this.chips = chips || 50000
    this.logger = logger || { log: () => undefined }
    this.hands = this.createHands(hands)
  }

  createHands(amount) {
    const hands = []
    for(let i=1; i<=amount; i++) {
      hands.push(new Player(`hand ${i}`, 100000, this.logger))
    }
    return hands
  }

  getHands() {
    return this.hands
  }

  adjustChips(hands) {
    let adjustment
    hands.forEach((hand) => {
      adjustment += (hand.getChips() - 100000)
    })
    this.chips += adjustment
  }

  getChips() {
    return this.chips
  }

  resetCombo(hands) {
    hands.forEach((hand) => {
      hand.combo = 0
    })
  }

  getCombo(hands) {
    const combo = hands.reduce((total, acc) => {
      return total + acc
    })
    return combo
  }
}

module.exports = SoloPlayer