const Player = require('./Player')
const BlackJackGame = require('./BlackJackGame.js')
const players = []
let stickCounter = 0
let betCount = 0
let game
let roundCount

function addNewPlayer() {
  const name = document.getElementById('nameInput')
  const chips = document.getElementById('chipsInput')
  if(chips.value !== '') {
    const player = new Player(name.value, chips.value)
    name.value = ''
    chips.value = 10000
    players.push(player)
    const li = document.createElement('li')
    const nameNode = document.createTextNode(`${player.getName()}: `)
    const chipsNode = document.createTextNode(`chips: ${player.getChips()}`)
    
    li.appendChild(nameNode)
    li.appendChild(chipsNode)

    document.getElementById('nameInput').focus()
    document.getElementById('playersList').appendChild(li)
    document.getElementById('createGameButton').setAttribute('class', 'displayInline')
  } 
}

function setUpTable() {
  document.getElementById('table-div').setAttribute('class', 'displayBlock')
  document.getElementById('createGameForm').setAttribute('class', 'hidden')
  const playerRow = document.getElementById('players-div')
  const playerDivs = []

  players.forEach((player, index) => {
    const playerDiv = document.createElement('div')
    playerDiv.setAttribute('id', `player${index}-div`)
    playerDiv.setAttribute('class', 'playerDiv displayInline')
    
    const playerImage = document.createElement('img')
    playerImage.setAttribute('src', '../assets/avatars/player_avatar.png')
    playerImage.setAttribute('class', 'playerImage')
 
    const playerName = document.createElement('div')
    playerName.setAttribute('id', `player${index}-name`)
    playerName.innerHTML = player.name 
    
    const playerChipsText =  document.createElement('div')
    playerChipsText.setAttribute('id', `player${index}-chips-text`)
    playerChipsText.innerHTML = `${player.getChips()}`
    const playerChips = document.createElement('div')
    playerChips.setAttribute('id', `player${index}-chips`)
    playerChips.appendChild(playerChipsText)
    
    const playerCards = document.createElement('div')
    playerCards.setAttribute('id', `player${index}-cards`)

    const playerHandValue = document.createElement('div')
    playerHandValue.setAttribute('id', `player${index}-hand-value`)
    playerHandValue.setAttribute('class', 'playerHandValue')
    
    const betInput = document.createElement('input')
    betInput.setAttribute('id', `player${index}-bet-input`)
    betInput.setAttribute('class', 'betInput')
    betInput.setAttribute('type', 'number')
    betInput.setAttribute('step', '500')
    betInput.setAttribute('value', '1000')
    const betButtonDiv = document.createElement('div')
    betButtonDiv.setAttribute('id', `player${index}-bet-button-div`)
    const betButton = document.createElement('button')
    betButton.setAttribute('id', `player${index}-bet-button`)
    betButton.setAttribute('onclick', `makeBet(${index})`)
    betButton.innerHTML = 'Place Bet'
    betButtonDiv.appendChild(betButton)
    
    playerDiv.appendChild(playerImage)
    playerDiv.appendChild(playerName)
    playerDiv.appendChild(playerChips)
    playerDiv.appendChild(playerCards)
    playerDiv.appendChild(playerHandValue)
    playerDiv.appendChild(betInput)
    playerDiv.appendChild(betButtonDiv)
    
    playerDivs.push(playerDiv)
  })
  playerDivs.reverse().forEach((playerDiv) => {
    playerRow.appendChild(playerDiv)
  })
}

function makeBet(index) {
  const betInput = document.getElementById(`player${index}-bet-input`)
  const betButton = document.getElementById(`player${index}-bet-button-div`)

  if(betInput.value !== '') {
    game.players[index].placeBet(Number(betInput.value))
    betInput.setAttribute('class', 'hidden')
    betButton.innerHTML = `bet:${game.players[index].getBets()[0]}`
    betCount++
  }
  if(betCount === game.getNumberOfPlayers()) {
    if(game.deck.dealtCards.length === 0) {
      document.getElementById('hint-button').setAttribute('class', 'displayInline')
    } else {
      document.getElementById('hint-button').setAttribute('class', 'hidden')
      document.getElementById('hint-text').innerHTML = ''
    }
    document.getElementById('deck-button').setAttribute('onclick', 'dealCards()')
    betCount = 0
   
  }
  refreshChipsTotals()
}

function dealCards() {
  game.dealCards()
  displayDealerCard()
  displayPlayerCards()

  game.players.forEach((player, index) => {
    const drawCardButton = document.createElement('button')
    drawCardButton.setAttribute('id', `player${index}-drawCardButton`)
    drawCardButton.setAttribute('onclick', `drawCard(${index})`)
    drawCardButton.innerHTML = 'Card'
    if(index !== 0) drawCardButton.setAttribute('class', 'hidden')

    const stickButton = document.createElement('button')
    stickButton.setAttribute('id', `player${index}-stickButton`)
    stickButton.setAttribute('onclick', `stick(${index})`)
    stickButton.innerHTML = 'Stick'
    if(index !== 0) stickButton.setAttribute('class', 'hidden')

    const splitButton = document.createElement('button')
    splitButton.setAttribute('id', `player${index}-splitButton`)
    splitButton.setAttribute('onclick', `splitCards(${index})`)
    splitButton.innerHTML = 'Split'
    if(index !== 0) splitButton.setAttribute('class', 'hidden')

    const doubleButton = document.createElement('button')
    doubleButton.setAttribute('id', `player${index}-doubleButton`)
    doubleButton.setAttribute('onclick', `doubleDown(${index})`)
    doubleButton.innerHTML = 'Double'
    if(index !== 0) doubleButton.setAttribute('class', 'hidden')

    const playerDiv = document.getElementById(`player${index}-div`)
    playerDiv.appendChild(drawCardButton)
    playerDiv.appendChild(stickButton)
    playerDiv.appendChild(doubleButton)

    if(player.hands[0].isSplittable() && player.getChips() >= player.getBets()[0]) {
      playerDiv.appendChild(splitButton)
    }

  })
  document.getElementById('deck-button').setAttribute('class', 'hidden')
  document.getElementById('hint-button').setAttribute('class', 'hidden')
  document.getElementById('hint-text').innerHTML = ''
}

function displayPlayerCards() {
  game.players.forEach((player, index) => {
    const playerCardsDiv = document.getElementById(`player${index}-cards`)
    playerCardsDiv.innerHTML = ''
    player.hands[0].cards.forEach((card, i ) => {
      const cardToAppend = document.createElement('img')
      cardToAppend.setAttribute('class', 'card')
      cardToAppend.setAttribute('src', `${player.showHand()[i].image}`)
      playerCardsDiv.appendChild(cardToAppend)
    })
    if(document.getElementById(`player${index}-split-cards`)) {
      const playerCardsSplitDiv = document.getElementById(`player${index}-split-cards`)
      playerCardsSplitDiv.innerHTML = ''
      player.hands[1].cards.forEach((card, i ) => {
        const cardToAppend = document.createElement('img')
        cardToAppend.setAttribute('class', 'card')
        cardToAppend.setAttribute('src', `${player.showHand(2)[i].image}`)
        playerCardsSplitDiv.appendChild(cardToAppend)
      })
    }
  })
}

function displayDealerCard() {
  const dealerCardsDiv = document.getElementById('dealer-cards-div')
  const cardBack = document.createElement('img')
  cardBack.setAttribute('class', 'cardBack')
  cardBack.setAttribute('src', '../assets/cards/card_back.png')
  dealerCardsDiv.innerHTML = ''
  dealerCardsDiv.appendChild(cardBack)
  const cardToAppend = document.createElement('img')
  cardToAppend.setAttribute('class', 'card')
  cardToAppend.setAttribute('src', `${game.dealer.showHand()[1].image}`)
  dealerCardsDiv.appendChild(cardToAppend)
}

function displayAllCards() {
  const dealerCardsDiv = document.getElementById('dealer-cards-div')
  dealerCardsDiv.innerHTML = ''
  for(let i=0; i<game.dealer.handSize(); i++) {
    const cardToAppend = document.createElement('img')
    cardToAppend.setAttribute('class', 'card')
    cardToAppend.setAttribute('src', `${game.dealer.showHand()[i].image}`)
    dealerCardsDiv.appendChild(cardToAppend)
  }
  displayPlayerCards()
}

function drawCard(index, hand) {
  game.players[index].receiveCard(game.deck.dealCard(), hand)
  if(game.handValue(game.players[index].showHand(hand)) > 21) {
    stick(index, hand)
  }
  displayPlayerCards()
}

function stick(index, hand = 1) {
  if(document.getElementById(`player${index}-splitButton`)) {
  document.getElementById(`player${index}-splitButton`).setAttribute('class', 'hidden')
  }
  const handSize = game.players[index].hands.length
  if(hand === 1) {
    document.getElementById(`player${index}-hand-value`).innerHTML = game.handValue(game.players[index].showHand(1))
    document.getElementById(`player${index}-drawCardButton`).setAttribute('class', 'hidden')
    document.getElementById(`player${index}-stickButton`).setAttribute('class', 'hidden')
    stickCounter++
  }
  if(hand === 2) {
    document.getElementById(`player${index}-split-hand-value`).innerHTML = game.handValue(game.players[index].showHand(2))
    document.getElementById(`player${index}-split-drawCardButton`).setAttribute('class', 'hidden')
    document.getElementById(`player${index}-split-stickButton`).setAttribute('class', 'hidden')
    stickCounter++
  }
  if(index+1 === players.length && stickCounter === handSize) {
    playDealersHand()
    document.getElementById('dealer-img').setAttribute('onclick', 'nextRound()')
    stickCounter = 0
  } else if(stickCounter === handSize) {
    document.getElementById(`player${index+1}-drawCardButton`).setAttribute('class', 'displayInline')
    document.getElementById(`player${index+1}-stickButton`).setAttribute('class', 'displayInline')
    document.getElementById(`player${index+1}-doubleButton`).setAttribute('class', 'displayInline')
    stickCounter = 0
    if(document.getElementById(`player${index+1}-splitButton`)) {
      document.getElementById(`player${index+1}-splitButton`).setAttribute('class', 'displayBlock')
    }
  }
}

function splitCards(index) {
  if(game.players[index].getChips() >= game.players[index].getBets()[0]) {
    game.players[index].splitHand()
    game.players[index].receiveCard(game.deck.dealCard())
    game.players[index].receiveCard(game.deck.dealCard(), 2)

    refreshChipsTotals()

    const playerCards = document.createElement('div')
    playerCards.setAttribute('id', `player${index}-split-cards`)

    const playerHandValue = document.createElement('div')
    playerHandValue.setAttribute('id', `player${index}-split-hand-value`)
    playerHandValue.setAttribute('style', 'font-size:18px')

    const playerBetDiv = document.createElement('div')
    playerBetDiv.setAttribute('id', `player${index}-split-bet-div`)
    playerBetDiv.innerHTML = `bet:${game.players[index].getBets()[0]}`
    
    const drawCardButton = document.createElement('button')
    drawCardButton.setAttribute('id', `player${index}-split-drawCardButton`)
    drawCardButton.setAttribute('onclick', `drawCard(${index},2)`)
    drawCardButton.innerHTML = 'Card'

    const stickButton = document.createElement('button')
    stickButton.setAttribute('id', `player${index}-split-stickButton`)
    stickButton.setAttribute('onclick', `stick(${index},2)`)
    stickButton.innerHTML = 'Stick'

    const chipsDiv = document.getElementById(`player${index}-chips`)
    chipsDiv.appendChild(playerCards)
    chipsDiv.appendChild(playerHandValue)
    chipsDiv.appendChild(playerBetDiv)
    chipsDiv.appendChild(drawCardButton)
    chipsDiv.appendChild(stickButton)

  document.getElementById(`player${index}-splitButton`).setAttribute('class', 'hidden')
  displayPlayerCards()
  }
}

function getPlayersChipsAndBets() {
  const playersChips = []
    game.players.forEach((player) => {
      const chips = player.getChips() + player.getBets().reduce((total,number) => {
        return total + number
      })
      playersChips.push(chips)
    })
    return playersChips
}

function showChipsDifference(playersChips) {
  game.players.forEach((player, index) => {
    const difference = player.getChips() - playersChips[index]
    const betDiv =  document.getElementById(`player${index}-bet-button-div`)
    const playerDiffDiv = document.createElement('div')
    if(difference < 0) {
      playerDiffDiv.innerHTML = `Lost:${difference}`
    } else if(difference > 0) {
      playerDiffDiv.innerHTML = `Won:${difference}`
    } else {
      playerDiffDiv.innerHTML = 'Break Even'
    }
    betDiv.appendChild(playerDiffDiv)
  })
}

function refreshChipsTotals() {
  game.players.forEach((player, index) => {
    const chipsDivText = document.getElementById(`player${index}-chips-text`)
  chipsDivText.innerHTML = `${player.getChips()}`
  })
}

function setHandValueColours() {
  const dealerHandValue = game.handValue(game.dealer.showHand())
  if(dealerHandValue > 21) {
    document.getElementById('dealer-hand-value').setAttribute('class', 'loseColour')
  }
  game.players.forEach((player, index) => {
    const valueDiv = document.getElementById(`player${index}-hand-value`)
    const playerHandValue = game.handValue(player.hands[0].showCards())     
    if(playerHandValue === 21 && player.hands[0].size() === 2){
      valueDiv.setAttribute('class', 'playerHandValue winColour')
    } else if(playerHandValue < 22 && playerHandValue > dealerHandValue) {
      valueDiv.setAttribute('class', 'playerHandValue winColour')
    } else if(playerHandValue < 22 && dealerHandValue > 21) {
      valueDiv.setAttribute('class', 'playerHandValue winColour')
    } else if(playerHandValue < 22 && playerHandValue === dealerHandValue) {
      valueDiv.setAttribute('class', 'playerHandValue drawColour')
    } else {
      valueDiv.setAttribute('class', 'playerHandValue loseColour')
    }    
  })
  game.players.forEach((player, index) => {
    if(player.hands.length === 2) {
      const valueDiv = document.getElementById(`player${index}-split-hand-value`)
      const playerHandValue = game.handValue(player.hands[1].showCards())     
      if(playerHandValue === 21 && player.hands[1].size() === 2){
        valueDiv.setAttribute('class', 'playerHandValue winColour')
      } else if(playerHandValue < 22 && playerHandValue > dealerHandValue) {
        valueDiv.setAttribute('class', 'playerHandValue winColour')
      } else if(playerHandValue < 22 && dealerHandValue > 21) {
        valueDiv.setAttribute('class', 'playerHandValue winColour')
      } else if(playerHandValue < 22 && playerHandValue === dealerHandValue) {
        valueDiv.setAttribute('class', 'playerHandValue drawColour')
      } else {
        valueDiv.setAttribute('class', 'playerHandValue loseColour')
      }
    }
  })
}

function doubleDown(index) {
  const bet =  game.players[index].removeBet() * 2
  game.players[index].placeBet(bet)
  game.players[index].receiveCard(game.deck.dealCard())
  document.getElementById(`player${index}-bet-button-div`).innerHTML = `bet:${game.players[index].getBets()[0]}`
  document.getElementById(`player${index}-doubleButton`).setAttribute('class', 'hidden')
  stick(index)
  displayPlayerCards()
}

function playDealersHand() {
  game.playDealersHand()
  document.getElementById('dealer-hand-value').innerHTML = game.handValue(game.dealer.showHand())
  displayAllCards()
  setHandValueColours()  
  const playersChipsAndBets = getPlayersChipsAndBets()
  game.payWinners()
  refreshChipsTotals()
  showChipsDifference(playersChipsAndBets)
  if(roundCount === 1) {
    document.getElementById('hint-button').setAttribute('class', 'displayBlock')
  }
}

function createBlackJackGame() {
  roundCount = 1
  setUpTable()
  game = new BlackJackGame(null, players)
  game.deck.shuffle()
  console.log(game.deck)
}

function nextRound() {
  roundCount++
  game.dealer.discardHand()
  game.players.forEach((player) => {
    player.discardHands()
  })
  game.players.forEach((player, index) => {
    if(player.getChips() === 0) {
      game.removePlayer(index)
    }
  })
  document.getElementById('dealer-cards-div').innerHTML = ''
  document.getElementById('players-div').innerHTML = ''
  document.getElementById('dealer-hand-value').innerHTML = ''
  document.getElementById('hint-text').innerHTML = ''
  document.getElementById('deck-button').setAttribute('class', 'buttonImage displayInline')
  document.getElementById('deck-button').setAttribute('onclick', '')
  document.getElementById('hint-button').setAttribute('class', 'displayBlock')
  document.getElementById('dealer-img').setAttribute('onclick', '')
  setUpTable()
}

function displayTheCount() {
  let count = 0
  game.deck.dealtCards.forEach((card) => {
    if(card.value < 7) {
      count++
    } else if(card.value > 9) {
      count--
    }
  })
  const cardsInDeck = game.deck.cards.length
  const cardsTotal = game.deck.dealtCards.length + cardsInDeck
  const hintText = document.getElementById('hint-text')
  if(roundCount === 1 && cardsInDeck === cardsTotal) {
    hintText.innerHTML = 'Click the deck to continue'
  } else if(roundCount === 1) {
    hintText.innerHTML = 'Click the dealer to continue'
  } else {
    hintText.innerHTML = `The Count Is ${count} with ${cardsInDeck}/${cardsTotal} cards remaining  `
  }
}

window.doubleDown = doubleDown
window.displayTheCount = displayTheCount
window.splitCards = splitCards
window.makeBet = makeBet
window.dealCards = dealCards
window.drawCard = drawCard
window.stick = stick
window.createBlackJackGame = createBlackJackGame
window.addNewPlayer = addNewPlayer
window.nextRound = nextRound
