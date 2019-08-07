const Player = require('./Player')

class SuperPlayer {
  constructor(name, chips, hands, logger) {
    this.name = name
    this.chips = chips
    this.logger = logger || { log: () => undefined }
    this.hands = this.createHands(hands)
    this.combo = 0
  }

  createHands(amount) {
    const hands = []
    for(let i=1; i<=amount; i++) {
      hands.push(new Player(`hand ${i}`, 100000, this.logger))
    }
    return hands
  }

  adjustChips() {
    let adjustment
    this.hands.forEach((hand) => {
      adjustment += (hand.getChips() - 100000)
    })
    this.chips += adjustment
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

module.exports = SuperPlayer