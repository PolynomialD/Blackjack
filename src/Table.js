class Table {
  constructor () {
    this.cards = []
    this.players = []
    this.playerBets = 0
  }
  
  drawCard(deck) {
    this.cards.push(deck.dealCard())
  }
  
  addPlayer(player) {
    player.position = this.players.length +1
    player.id = 'player ' + player.position
    this.players.push(player)
  }
}

module.exports = Table
