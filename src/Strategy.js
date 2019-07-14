class Strategy {
  constructor () {
    this.basic = {
      17: [null, null, 's', 's', 's', 's', 's'],
      16: [null, null, 'f', 'g', 'h', 'i', 'j']
    }
    this.currentStrat = this.basic
  }

  correctMove(dealerCard, playerHand) {
    const clone = JSON.parse(JSON.stringify(playerHand.cards))
    clone.sort((a, b) => a.value - b.value)
    return this.currentStrat[playerHandValue][dealerCard]
  }
}

module.exports = Strategy