class Strategy {
  constructor () {
    this.basic = {
      "blackjack": [null, null, 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
      "hard 21": [null, null, 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
      "hard 20": [null, null, 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
      "hard 19": [null, null, 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
      "hard 18": [null, null, 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
      "hard 17": [null, null, 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
      "hard 16": [null, null, 's', 's', 's', 's', 's', 'c', 'c', 'c', 'c', 'c'],
      "hard 15": [null, null, 's', 's', 's', 's', 's', 'c', 'c', 'c', 'c', 'c'],
      "hard 14": [null, null, 's', 's', 's', 's', 's', 'c', 'c', 'c', 'c', 'c'],
      "hard 13": [null, null, 's', 's', 's', 's', 's', 'c', 'c', 'c', 'c', 'c'],
      "hard 12": [null, null, 'c', 'c', 's', 's', 's', 'c', 'c', 'c', 'c', 'c'],
      "hard 11": [null, null, 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'c'],
      "hard 10": [null, null, 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'c', 'c'],
      "hard 9": [null, null, 'c', 'd', 'd', 'd', 'd', 'c', 'c', 'c', 'c', 'c'],
      "hard 8": [null, null, 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
      "hard 7": [null, null, 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
      "hard 6": [null, null, 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
      "hard 5": [null, null, 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
      "soft 21": [null, null, 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
      "soft 20": [null, null, 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
      "soft 19": [null, null, 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
      "soft 18": [null, null, 's', 'd', 'd', 'd', 'd', 's', 's', 'c', 'c', 'c'],
      "soft 17": [null, null, 'c', 'd', 'd', 'd', 'd', 'c', 'c', 'c', 'c', 'c'],
      "soft 16": [null, null, 'c', 'c', 'd', 'd', 'd', 'c', 'c', 'c', 'c', 'c'],
      "soft 15": [null, null, 'c', 'c', 'd', 'd', 'd', 'c', 'c', 'c', 'c', 'c'],
      "soft 14": [null, null, 'c', 'c', 'c', 'd', 'd', 'c', 'c', 'c', 'c', 'c'],
      "soft 13": [null, null, 'c', 'c', 'c', 'd', 'd', 'c', 'c', 'c', 'c', 'c'],
      "pair of 11's": [null, null, 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp'],
      "pair of 10's": [null, null, 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
      "pair of 9's": [null, null, 'sp', 'sp', 'sp', 'sp', 'sp', 's', 'sp', 'sp', 's', 's'],
      "pair of 8's": [null, null, 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp'],
      "pair of 7's": [null, null, 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'c', 'c', 'c', 'c'],
      "pair of 6's": [null, null, 'sp', 'sp', 'sp', 'sp', 'sp', 'c', 'c', 'c', 'c', 'c'],
      "pair of 5's": [null, null, 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'c', 'c'],
      "pair of 4's": [null, null, 'c', 'c', 'c', 'sp', 'sp', 'c', 'c', 'c', 'c', 'c'],
      "pair of 3's": [null, null, 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'c', 'c', 'c', 'c'],
      "pair of 2's": [null, null, 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'c', 'c', 'c', 'c']
    }
    this.currentStrat = this.basic
  }

  correctMove(dealerCardValue, playerHandValue) {
    let strat
    switch(this.currentStrat[playerHandValue][dealerCardValue]) {
      case 's':
        strat = 'stick'
      break
      case 'c':
        strat = 'card'
      break
      case 'd':
        strat = 'double down'
      break
      case 'sp':
        strat = 'split'
      break
      default:
        strat = 'unknown'
    }
    return strat
  }

  compareMove(dealerCardValue, playerHandValue, move, hands = 1) {
    if(hands !== 1)
    return move === this.correctMove(dealerCardValue, playerHandValue)
  }
}

module.exports = Strategy