const Deck = require('./Deck')
const Dealer = require('./Dealer')
const Table = require('./Table')

class BlackJackGame {
  constructor () {
    this.deck = new Deck()
    this.dealer = new Dealer()
    this.table = new Table()
    this.players = this.table.players
  }

  dealCards() {
    for(let i in this.players) {
      this.players[i].hand.push(this.deck.dealCard(),this.deck.dealCard())
      // console.log(this.players[i].hand)
    }
    this.dealer.hand.push(this.deck.dealCard(),this.deck.dealCard()) 
    // console.log(this.dealer.hand)
  }
  dealerHandValue() {
    const hand = this.dealer.hand
    // console.log(
    //   'dealer hand: ', hand,
    //   'hand value: ', this.handValue(hand)
    // )
    return this.handValue(hand)
  }

  playerHandValue(player) {
    const hand = this.players[player-1].hand
    // console.log(
    //   `player${player} hand: `, hand,
    //   'hand value: ', this.handValue(hand)
    // )
    return this.handValue(hand)
  }
  changeAce(valueArray) {
    valueArray.sort((a,b) => a - b)
    let highCard = valueArray.length - 1
    if(valueArray[highCard] === 11) {
      valueArray[highCard] = 1
      return valueArray
    } else { 
      return valueArray
    }
  }

  createValueArray(hand) {
    const valueArray = []
    for(let card in hand) {
      switch(hand[card].value) {
        case 'A': valueArray.push(11)
        break
        case 'J': valueArray.push(10)
        break
        case 'Q': valueArray.push(10)
        break
        case 'K': valueArray.push(10)
        break
        default: valueArray.push(hand[card].value)
      }
    }
    return valueArray
  }
  handValue(hand) { 
    let valueArray = this.createValueArray(hand)
    if(valueArray.reduce((a, b) => a + b) <= 21) {
      return valueArray.reduce((a, b) => a + b)
    } else {
      return this.changeAce(valueArray).reduce((a, b) => a + b)
    }
  }

}

module.exports = BlackJackGame
