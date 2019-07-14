class Strategy {
  constructor () {
    this.basic = {
      17: [null, null, 's', 's', 's', 's', 's'],
      16: [null, null, 'f', 'g', 'h', 'i', 'j']
    }
    this.currentStrat = this.basic
  }

  correctMove(dealerCard, playerHandValue) {
    return this.currentStrat[playerHandValue][dealerCard]
  }
}

module.exports = Strategy