const Player = require('./Player')

class SoloPlayer {
  constructor(name, chips, hands, logger) {
    this.name = name
    this.chips = chips || 50000
    this.logger = logger || { log: () => undefined }
    this.hands = this.createHands(hands)
    this.medals = []
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

  getName() {
    return this.name
  }

  adjustChips() {
    let adjustment = 0
    this.hands.forEach((hand) => { // reduce
      adjustment += hand.getWinnings()
    })
    this.chips += adjustment
  }

  getChips() {
    console.log('chips', this.chips)
    return this.chips
  }

  receiveMedal(medal) {
    this.logger.log(`${this.getName()} earns ${medal.name}!`)
    if(medal.value > 0) this.medals.push(medal)
    this.resetCombo()
  }

  resetCombo() {
    this.hands.forEach((hand) => {
      hand.resetCombo()
    })
  }

  getCombo() {
    let combo = 0
    this.hands.forEach((hand) => { // reduce
      combo += (hand.getCombo())
    })
    return combo
  }
}

module.exports = SoloPlayer