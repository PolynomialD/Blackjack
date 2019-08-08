const Player = require('./Player')

class SoloPlayer {
  constructor(name, chips, hands, logger) {
    this.name = name
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

  adjustChips() {
    let adjustment = 0
    this.hands.forEach((hand) => { // reduce
      adjustment += (hand.getWinnings())
    })
    this.chips += adjustment
  }

  getChips() {
    return this.chips
  }

  resetCombo() {
    this.hands.forEach((hand) => {
      hand.combo = 0
    })
  }

  getCombo() {
    const combo = this.hands.reduce((total, acc) => {
      return total + acc
    })
    return combo
  }
}

module.exports = SoloPlayer