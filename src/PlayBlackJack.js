const Player = require('./Player')
const BlackJackGame = require('./BlackJackGame.js')
const colours = ['red', 'blue', 'black', 'green', 'orange', 'purple']
let colourIndex = 0
const players = []
let stickCounter = 0
let betCount = 0
let game
let roundNumber

function addPlayerByClick(event) {
  if (event.keyCode === 13) {
    event.preventDefault()
    addNewPlayer()
  }
}

function addNewPlayer() {
  const name = document.getElementById('nameInput')
  const chips = document.getElementById('chipsInput')
  if(chips.value !== '') {
    const player = new Player(name.value, chips.value)
    name.value = ''
    chips.value = 10000
    players.push(player)
    const li = document.createElement('li')
    const nameNode = document.createTextNode(`${player.getName()}  `)
    const chipsNode = document.createTextNode(`chips: ${player.getChips()}`)
    
    li.appendChild(nameNode)
    li.appendChild(chipsNode)

    document.getElementById('nameInput').focus()
    document.getElementById('playersList').appendChild(li)
    document.getElementById('createGameButton').setAttribute('class', 'inputButton')
    document.getElementById('createGameButton').setAttribute('onclick', 'createBlackJackGame()')
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
    playerImage.setAttribute('id', `player${index}-img`)
    playerImage.setAttribute('type', 'button')
    playerImage.setAttribute('onclick', `makeBet(${index})`)
    playerImage.setAttribute('src', '../assets/avatars/player_avatar.png')
    playerImage.setAttribute('class', 'playerImage cursor')
 
    const playerName = document.createElement('div')
    playerName.setAttribute('id', `player${index}-name`)
    playerName.innerHTML = player.name 
    
    const playerChipsText =  document.createElement('div')
    playerChipsText.setAttribute('id', `player${index}-chips-text`)
    playerChipsText.setAttribute('class', 'chipsText')
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
  
    const betDiv = document.createElement('div')
    betDiv.setAttribute('id', `player${index}-bet-div`)
    betDiv.setAttribute('class', 'bet-div')
     
    playerDiv.appendChild(playerImage)
    playerDiv.appendChild(playerName)
    playerDiv.appendChild(playerChips)
    playerDiv.appendChild(playerCards)
    playerDiv.appendChild(playerHandValue)
    playerDiv.appendChild(betInput)
    playerDiv.appendChild(betDiv)
    
    playerDivs.push(playerDiv)
  })
  playerDivs.reverse().forEach((playerDiv) => {
    playerRow.appendChild(playerDiv)
  })
}

function makeBet(index) {
  const betInput = document.getElementById(`player${index}-bet-input`)
  const betDiv = document.getElementById(`player${index}-bet-div`)

  if(betInput.value !== '' && betInput.value > 0) {
    game.players[index].placeBet(Number(betInput.value))
    document.getElementById('hint-text').innerHTML = ''
    document.getElementById(`player${index}-img`).setAttribute('onclick', '')
    document.getElementById(`player${index}-img`).setAttribute('class', 'playerImage')
    betInput.setAttribute('class', 'hidden')
    betDiv.innerHTML = `Bet:${game.players[index].getBets()[0]}`
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
    document.getElementById('deck-button').setAttribute('class', 'buttonImage cursor')
    betCount = 0
   
  }
  refreshChipsTotals()
}

function makeBets(event) {
  if(event.button === 2) {
    game.players.forEach((player, index) => {
      if(player.getBets().length === 0) {
        makeBet(index)
      }
    })
    dealCards()
  }
}

function dealCards() {
  game.dealCards()
  displayDealerCard()
  displayPlayerCards()

  game.players.forEach((player, index) => {
    const drawCardButton = document.createElement('button')
    drawCardButton.setAttribute('id', `player${index}-drawCardButton`)
    drawCardButton.setAttribute('class', 'button')
    drawCardButton.setAttribute('onclick', `drawCard(${index}, 1)`)
    drawCardButton.innerHTML = 'Card'
    if(index !== 0) drawCardButton.setAttribute('class', 'hidden')

    const stickButton = document.createElement('button')
    stickButton.setAttribute('id', `player${index}-stickButton`)
    stickButton.setAttribute('class', 'button')
    stickButton.setAttribute('onclick', `stick(${index})`)
    stickButton.innerHTML = 'Stick'
    if(index !== 0) stickButton.setAttribute('class', 'hidden')

    const splitButton = document.createElement('button')
    splitButton.setAttribute('id', `player${index}-splitButton`)
    splitButton.setAttribute('class', 'button')
    splitButton.setAttribute('onclick', `splitCards(${index})`)
    splitButton.innerHTML = 'Split'
    if(index !== 0) splitButton.setAttribute('class', 'hidden')

    const doubleButton = document.createElement('button')
    doubleButton.setAttribute('id', `player${index}-doubleButton`)
    doubleButton.setAttribute('class', 'button')
    doubleButton.setAttribute('onclick', `doubleDown(${index})`)
    doubleButton.innerHTML = 'Double'
    if(index !== 0) doubleButton.setAttribute('class', 'hidden')

    const playerDiv = document.getElementById(`player${index}-div`)
    playerDiv.appendChild(drawCardButton)
    playerDiv.appendChild(stickButton) 

    if(player.getBets()[0] <= player.getChips()) {
      playerDiv.appendChild(doubleButton)
    }
    if(player.hands[0].isSplittable() && player.getChips() >= player.getBets()[0]) {
      playerDiv.appendChild(splitButton)
    }
    document.getElementById(`player${index}-hand-value`).innerHTML = game.handValue(game.players[index].showHand(1))
  })
  document.getElementById('deck-button').setAttribute('class', 'hidden')
  document.getElementById('hint-button').setAttribute('class', 'hidden')
  document.getElementById('hint-text').innerHTML = ''
}

function drawCard(index, hand = 1) {
  if(document.getElementById(`player${index}-doubleButton`)) {
    document.getElementById(`player${index}-doubleButton`).setAttribute('class', 'hidden')
  }
  if(document.getElementById(`player${index}-splitButton`)) {
    document.getElementById(`player${index}-splitButton`).setAttribute('class', 'hidden')
  }
  game.players[index].receiveCard(game.deck.dealCard(), hand)
  if(game.handValue(game.players[index].showHand(hand)) > 21) {
    stick(index, hand)
  }
  if(hand === 1) {
    const handOne = document.getElementById(`player${index}-hand-value`)
    handOne.innerHTML = game.handValue(game.players[index].showHand(1))
  }
  if(hand === 2) {
    const handTwo = document.getElementById(`player${index}-split-hand-value`)
    handTwo.innerHTML = game.handValue(game.players[index].showHand(2))
  }
  displayPlayerCards()
}

function stick(index, hand = 1) {
  if( document.getElementById(`player${index}-doubleButton`)) {
    document.getElementById(`player${index}-doubleButton`).setAttribute('class', 'hidden')
  }
  if(document.getElementById(`player${index}-splitButton`)) {
  document.getElementById(`player${index}-splitButton`).setAttribute('class', 'hidden')
  }
  const handAmount = game.players[index].hands.length
  if(hand === 1) {
    const handValue = document.getElementById(`player${index}-hand-value`)
    handValue.innerHTML = game.handValue(game.players[index].showHand(1))
    document.getElementById(`player${index}-drawCardButton`).setAttribute('class', 'hidden')
    document.getElementById(`player${index}-stickButton`).setAttribute('class', 'hidden')
    stickCounter++
  }
  if(hand === 2) {
     const splitHandValue = document.getElementById(`player${index}-split-hand-value`)
     splitHandValue.innerHTML = game.handValue(game.players[index].showHand(2)) 
    document.getElementById(`player${index}-split-drawCardButton`).setAttribute('class', 'hidden')
    document.getElementById(`player${index}-split-stickButton`).setAttribute('class', 'hidden')
    stickCounter++
  }
  if(index+1 === players.length && stickCounter === handAmount) {
    playDealersHand()
    document.getElementById('dealer-img').setAttribute('onclick', 'nextRound()')
    document.getElementById('dealer-img').setAttribute('class', 'buttonImage cursor')
    stickCounter = 0
  } else if(stickCounter === handAmount) {
    document.getElementById(`player${index+1}-drawCardButton`).setAttribute('class', 'button displayInline')
    document.getElementById(`player${index+1}-stickButton`).setAttribute('class', 'button displayInline')
    if(document.getElementById(`player${index+1}-doubleButton`)) {
      document.getElementById(`player${index+1}-doubleButton`).setAttribute('class', 'button displayInline')
    }
      stickCounter = 0
    if(document.getElementById(`player${index+1}-splitButton`)) {
      document.getElementById(`player${index+1}-splitButton`).setAttribute('class', 'button displayBlock')
    }
  }
}

function splitCards(index) {
  game.players[index].splitHand()
  game.players[index].receiveCard(game.deck.dealCard())
  game.players[index].receiveCard(game.deck.dealCard(), 2)
  refreshChipsTotals()

  const playerCards = document.createElement('div')
  playerCards.setAttribute('id', `player${index}-split-cards`)

  const playerHandValue = document.getElementById(`player${index}-hand-value`)
  playerHandValue.innerText = game.handValue(game.players[index].showHand(1))

  const playerSplitHandValue = document.createElement('div')
  playerSplitHandValue.setAttribute('id', `player${index}-split-hand-value`)
  playerSplitHandValue.setAttribute('class', 'playerHandValue')
  playerSplitHandValue.innerText = game.handValue(game.players[index].showHand(2))

  const playerBetDiv = document.createElement('div')
  playerBetDiv.setAttribute('id', `player${index}-split-bet-div`)
  playerBetDiv.innerHTML = `bet:${game.players[index].getBets()[0]}`
  
  const drawCardButton = document.createElement('button')
  drawCardButton.setAttribute('id', `player${index}-split-drawCardButton`)
  drawCardButton.setAttribute('class', 'button')
  drawCardButton.setAttribute('onclick', `drawCard(${index},2)`)
  drawCardButton.innerHTML = 'Card'

  const stickButton = document.createElement('button')
  stickButton.setAttribute('id', `player${index}-split-stickButton`)
  stickButton.setAttribute('class', 'button')
  stickButton.setAttribute('onclick', `stick(${index},2)`)
  stickButton.innerHTML = 'Stick'

  const chipsDiv = document.getElementById(`player${index}-chips`)
  chipsDiv.appendChild(playerCards)
  chipsDiv.appendChild(playerSplitHandValue)
  chipsDiv.appendChild(playerBetDiv)
  chipsDiv.appendChild(drawCardButton)
  chipsDiv.appendChild(stickButton)
  document.getElementById(`player${index}-doubleButton`).setAttribute('class', 'hidden')
  document.getElementById(`player${index}-splitButton`).setAttribute('class', 'hidden')
  displayPlayerCards()  
}

function doubleDown(index) {
  const player = game.players[index]
  const bet = player.removeBet()
  player.receiveChips(bet)
  player.placeBet(Number(bet * 2))
  player.receiveCard(game.deck.dealCard())
  document.getElementById(`player${index}-bet-div`).innerHTML = `Bet:${player.getBets()[0]}`
  document.getElementById(`player${index}-doubleButton`).setAttribute('class', 'hidden')
  stick(index)
  displayPlayerCards()
  refreshChipsTotals()
}

function playDealersHand() {
  game.playDealersHand()
  if(roundNumber === 1) {
    document.getElementById('hint-button').setAttribute('class', 'displayBlock')
  }
  document.getElementById('dealer-hand-value').innerHTML = game.handValue(game.dealer.showHand())
  document.getElementById('dealer-hand-value').setAttribute('class', '')
  displayAllCards()
  setHandValueColours()  
  const playersChipsAndBets = getPlayersChipsAndBets()
  game.payWinners()
  refreshChipsTotals()
  showChipsDifference(playersChipsAndBets)
}

function createBlackJackGame() {
  roundNumber = 1
  setUpTable()
  game = new BlackJackGame(null, players)
  game.deck.shuffle()
  document.getElementById('hint-button').setAttribute('class', 'displayBlock')
  console.log(game.deck)
}

function nextRound() {
  if(game.deck.size() < (game.getNumberOfPlayers()+1) * 8) {
    game.deck = game.createBlackJackDeck()
    window.alert('new cards!')
  }
  roundNumber++
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
  document.getElementById('dealer-img').setAttribute('class', 'buttonImage')
  setUpTable()
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
  cardBack.setAttribute('id', 'dealer-card-back')
  cardBack.setAttribute('class', 'card')
  cardBack.setAttribute('src', `../assets/cards/card_back_${colours[colourIndex]}.png`)
  cardBack.setAttribute('onclick', 'changeCardColour()')
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
    const betDiv =  document.getElementById(`player${index}-bet-div`)
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

function changeCardColour() {
  if(colourIndex === 5) {
    colourIndex = 0
  } else {
    colourIndex++
  }
  document.getElementById('dealer-card-back').setAttribute('src', `../assets/cards/card_back_${colours[colourIndex]}.png`)
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

function displayTheCount() {
  let count = 0
  game.deck.dealtCards.forEach((card) => {
    if(card.value < 7) {
      count++
    } else if(card.value > 9) {
      count--
    }
  })
  const cardsInDeck = game.deck.size()
  const cardsTotal = game.deck.dealtCardsSize() + cardsInDeck
  const hintText = document.getElementById('hint-text')
  if(roundNumber === 1 && cardsInDeck !== cardsTotal) {
    hintText.innerHTML = 'Click the dealer to continue'
  } else if(roundNumber === 1 && game.players[0].getBets()[0]) {
    hintText.innerHTML = 'Click the deck to continue'
  } else if(roundNumber === 1 && game.players[0].getBets() !== []) {
    hintText.innerHTML = 'Right click the deck to place all bets and deal cards'
  } else {
    hintText.innerHTML = `The Count Is ${count} with ${cardsInDeck}/${cardsTotal} cards remaining  `
  }
}

window.changeCardColour = changeCardColour
window.makeBets = makeBets
window.addPlayerByClick = addPlayerByClick
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
