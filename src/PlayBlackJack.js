const Html = require('./Html')
const BlackJackGame = require('./BlackJackGame')
const game = new BlackJackGame()

function addPlayerByClick(click) {
  if (click.keyCode === 13) {
    click.preventDefault()
    addNewPlayer()
  }
}

function addNewPlayer() {
  const name = document.getElementById('nameInput')
  const chips = document.getElementById('chipsInput')
  if(chips.value !== '') {
    game.addPlayer(name.value, chips.value)
    playSound('click2')

    const li = Html.li()
    Html.appendChildren(li, [
      Html.textNode(`${name.value}  `),
      Html.textNode(chips.value)
    ])
    name.value = ''
    chips.value = 10000
    Html.setFocus('nameInput')
    Html.getAndAppendChild('playersList', li)
    Html.getAndSetAttributes('createGameButton', {
      class: 'inputButton',
      onclick: 'startGame()'
    })
  }
}

function placeBet(index) {
  const betInput = document.getElementById(`player${index}-bet-input`)
  const betDiv = document.getElementById(`player${index}-bet-div`)

  if(betInput.value !== '' && betInput.value > 0) {
    game.players[index].placeBet(Number(betInput.value))

    Html.clearHtml('hint-text')

    Html.getAndSetAttributes(`player${index}-img`, {
      onclick: '',
      class: 'playerImage'
    })

    Html.getAndHideElement(`player${index}-increase-bet-button`, `player${index}-decrease-bet-button`)
    Html.hideElement(betInput)
    betDiv.innerHTML = `Bet:${game.players[index].getBets()[0]}`
    game.addBetToCount()
    playSound('chips_stack1')
  }
  if(game.getBetCount() === game.getNumberOfPlayers()) {
    Html.getAndSetAttributes(`deck-button`, {
      onclick: 'dealCards()',
      class: 'buttonImage cursor'
    })
    if(game.deck.dealtCardsSize() === 0) {
      Html.showHintButton()
    } else {
      Html.getAndHideElement('hint-button')
      Html.clearHtml('hint-text')
    }
  }
  refreshChipsTotals()
}

function makeBets(click) {
  if(click.button === 2) {
    game.players.forEach((player, index) => {
      if(player.getBets().length === 0) {
        placeBet(index)
      }
    })
    dealCards()
  }
}

function createPlayerElements() {
  Html.getAndSetAttributes('table-div', { class: 'displayBlock' })
  Html.getAndHideElement('createGameForm')

  const playerDivs = game.players.map((player, index) => {
    const playerChips = Html.div({
      id: `player${index}-chips`
    })
    playerChips.appendChild(Html.div({
      id: `player${index}-chips-text`,
      class: 'chipsText'
    }, `${player.getChips()}`))

    const elements = [
      Html.img({
        id: `player${index}-img`,
        type: 'button',
        onClick: `placeBet(${index})`,
        src: '../assets/avatars/player_avatar.png',
        class: 'playerImage cursor'
      }),

      Html.div({
        id: `player${index}-name`
      }, player.getName()),

      playerChips,

      Html.div({
        id: `player${index}-cards`
      }),
      Html.div({
        id: `player${index}-hand-value`,
        class: 'playerHandValue'
      }),

      Html.button({
        id: `player${index}-increase-bet-button`,
        class: 'displayBlock bet-button',
        onclick: `increaseBet(${index})`
      }, '+'),

      Html.input({
        id: `player${index}-bet-input`,
        class: 'betInput',
        value: 1000
      }),

      Html.button({
        id: `player${index}-decrease-bet-button`,
        class: 'displayBlock bet-button',
        onclick: `decreaseBet(${index})`
      }, '-'),

      Html.div({
        id: `player${index}-bet-div`,
        class: 'bet-div'
      }),

      Html.div({
        id: `player${index}-insurance-div`,
        class: 'bet-div'
      })
    ]

    const playerDiv = Html.div({
      id: `player${index}-div`,
      class: 'playerDiv displayInline'
    })
    Html.appendChildren(playerDiv, elements)
    return playerDiv
  })
  playerDivs.reverse().forEach((playerDiv) => {
    Html.getAndAppendChild('players-div', playerDiv)
  })
}

function createSplitButtons() {
  playSound('card_place1')

  const player = game.getCurrentPlayer()
  const hand = game.players[player].showHand(0)
  document.getElementById(`player${player}-hand-value`).innerText = game.handValue(hand)

  const elements = [
    Html.div({
      id: `player${player}-split-cards`
    }),
    
    Html.div({
      id: `player${player}-split-hand-value`,
      class: 'playerHandValue'
    }, game.handValue(game.players[player].showHand(1))),
    
    Html.div({
      id: `player${player}-split-bet-div`
    }, `bet :${game.players[player].getBets()[0]}`),
    
    Html.button({
      id: `player${player}-split-drawCardButton`,
      class: 'button',
      onclick: `drawCard(${player},1)`
    }, 'Card'),

    Html.button({
      id: `player${player}-split-stickButton`,
      class: 'button',
      onclick: `splitHandStick()`
    }, 'Stick')
  ]

  Html.getAndAppendChildren(`player${player}-chips`, elements)

  Html.getAndHideElement(`player${player}-doubleButton`)
  Html.getAndHideElement(`player${player}-splitButton`)
}

function createPlayerButtons() {
  game.players.forEach((player, index) => {
    const drawCardButton = Html.button({
      id: `player${index}-drawCardButton`,
      class: 'button',
      onclick: `drawCard(${index}, 0)`
    })
    drawCardButton.innerHTML = 'Card'
    if(index !== 0) Html.hideElement(drawCardButton)

    const stickButton = Html.button({
      id: `player${index}-stickButton`,
      class: 'button',
      onclick: `stick()`
    })
    stickButton.innerHTML = 'Stick'
    if(index !== 0) Html.hideElement(stickButton)

    const splitButton = Html.button({
      id: `player${index}-splitButton`,
      class: 'button',
      onclick: `splitCards()`
    })
    splitButton.innerHTML = 'Split'
    if(index !== 0) Html.hideElement(splitButton)

    const doubleButton = Html.button({
      id: `player${index}-doubleButton`,
      class: 'button',
      onclick: `doubleDown()`
    })
    doubleButton.innerHTML = 'Double'
    if(index !== 0) Html.hideElement(doubleButton)

    const insuranceButton = Html.button({
      id: `player${index}-insuranceButton`,
      class: 'button',
      onclick: `insuranceBet()`
    })
    insuranceButton.innerHTML = 'Insurance'
    if(index !== 0) Html.hideElement(insuranceButton)

    const playerDiv = document.getElementById(`player${index}-div`)
    playerDiv.appendChild(drawCardButton)
    playerDiv.appendChild(stickButton) 

    if(player.getBets()[0] <= player.getChips()) {
      playerDiv.appendChild(doubleButton)
    }
    if(player.hands[0].isSplittable() && player.getChips() >= player.getBets()[0]) {
      playerDiv.appendChild(splitButton)
    }
    if(game.dealer.hand.cards[1].value === 11) {
      playerDiv.appendChild(insuranceButton)
    }
    document.getElementById(`player${index}-hand-value`).innerHTML = game.handValue(game.players[index].showHand(0))
  })
  Html.getAndHideElement('deck-button','hint-button')
  Html.clearHtml('hint-text')
}

function drawCard(index, hand) {
  Html.checkForAndHideElement(`player${index}-doubleButton`)
  Html.checkForAndHideElement(`player${index}-splitButton`)

  game.players[index].receiveCard(game.deck.dealCard(), hand)

  if(hand === 0) {
    const handDiv = document.getElementById(`player${index}-hand-value`)
    const handValue = game.handValue(game.players[index].showHand(0))
    handDiv.innerHTML = handValue
    if(handValue > 21) {
      stick()
    } else {
      playSound('card_place1')
    }
  }
  if(hand === 1) {
    const splitHandDiv = document.getElementById(`player${index}-split-hand-value`)
    const splitHandValue = game.handValue(game.players[index].showHand(1))
    splitHandDiv.innerHTML = splitHandValue
    if(splitHandValue > 21) {
      splitHandStick()
    } else {
      playSound('card_place1')
    }
  }
  displayPlayerCards()
}

function stick() {
  const index = game.getCurrentPlayer()
  const player = game.players[index]

  player.stick()

  Html.checkForAndHideElement(`player${index}-doubleButton`)
  Html.checkForAndHideElement(`player${index}-splitButton`)
  Html.getAndHideElement(`player${index}-drawCardButton`)
  Html.getAndHideElement(`player${index}-stickButton`)

  setHandValue(0)

  if(player.getStatus() === 'done') {
    nextPlayer(index)
  }
}

function splitHandStick() {
  const index = game.getCurrentPlayer()
  const player = game.players[index]

  player.splitHandStick()
  
  Html.getAndHideElement(`player${index}-split-drawCardButton`)
  Html.getAndHideElement(`player${index}-split-stickButton`)

  setHandValue(1)

  if(player.getStatus() === 'done') {
    nextPlayer(index)
  }
}

function doubleDown() {
  const index = game.getCurrentPlayer()
  game.doubleDown()

  Html.getAndHideElement(`player${index}-doubleButton`)
  Html.getAndHideElement(`player${index}-drawCardButton`)
  Html.getAndHideElement(`player${index}-stickButton`)
  Html.checkForAndHideElement(`player${index}-splitButton`)
  document.getElementById(`player${index}-bet-div`).innerHTML = `Bet:${game.players[index].getBets()[0]}`

  setHandValue(0)
  displayPlayerCards()
  refreshChipsTotals()
  nextPlayer(index)
}

function nextPlayer(index) {
  if(index+1 === game.getNumberOfPlayers()) {
    playDealersHand()
  } else {
    game.nextPlayer()

    Html.checkForAndShowButton(`player${index+1}-drawCardButton`)
    Html.checkForAndShowButton(`player${index+1}-stickButton`)
    Html.checkForAndShowButton(`player${index+1}-doubleButton`)
    Html.checkForAndShowButton(`player${index+1}-splitButton`)
    Html.checkForAndShowButton(`player${index+1}-insuranceButton`)
  }
}

function insuranceBet() {
  const index = game.getCurrentPlayer()
  const player = game.players[index]
  Html.getAndHideElement(`player${index}-insuranceButton`)
  player.placeInsuranceBet()
  document.getElementById(`player${index}-insurance-div`).innerHTML = `Insurance: ${player.getInsuranceBet()}`
  refreshChipsTotals()
}

function startGame() {
  playSound('card_fan1')
  createPlayerElements()
  game.deck.shuffle()
  Html.showHintButton()
  console.log(game.deck)
}

function dealCards() {
  playSound('fast_deal1')
  game.dealCards()
  displayDealerCard()
  displayPlayerCards()
  createPlayerButtons()
}

function splitCards() {
  playSound('card_split1')
  game.splitHand()
  createSplitButtons()
  refreshChipsTotals()
  displayPlayerCards()
}

function playDealersHand() {
  game.addToHistory()
  console.log(game.history)
  Html.getAndSetAttributes('dealer-img', {
    onclick: 'nextRound()',
    class: 'buttonImage cursor'
  })
  game.playDealersHand()
  displayAllCards()
  const playersChips = game.getPlayersChipsAndBets()
  if(game.getRound() === 1) Html.showHintButton()

  game.payWinners()
  setHandValueColours()
  refreshChipsTotals()
  showChipsDifference(playersChips)
  playSound('chips1')
}

function nextRound() {
  game.nextRound()
  playSound('card_fan1')
  if(game.deck.dealtCardsSize() === 0) window.alert('new cards!')
  Html.clearHtml('dealer-cards-div', 'players-div', 'dealer-hand-value', 'hint-text')
  Html.getAndSetAttributes('deck-button', {
    class: 'buttonImage displayInline',
    onclick: ''
  })
  Html.getAndSetAttributes('dealer-img', {
    class: 'buttonImage',
    onclick: ''
  })
  Html.showHintButton()
  createPlayerElements()
}

function displayPlayerCards() {
  game.players.forEach((player, index) => {
    Html.clearHtml(`player${index}-cards`)
    player.hands[0].cards.forEach((_, i ) => {
      const cardToAppend = Html.img({
        class: 'card',
        src: `${player.showHand(0)[i].image}`
      })
      Html.getAndAppendChild(`player${index}-cards`, cardToAppend)
    })
    if(document.getElementById(`player${index}-split-cards`)) {
      Html.clearHtml(`player${index}-split-cards`)
      player.hands[1].cards.forEach((_, i ) => {
        const cardToAppend = Html.img({
          class: 'card',
          src: `${player.showHand(1)[i].image}`
        })
        Html.getAndAppendChild(`player${index}-split-cards`, cardToAppend)
      })
    }
  })
}

function displayDealerCard() {
  const cards = [
    Html.img({
      id: 'dealer-card-back',
      class: 'card',
      src: game.deck.getCardBackPath(),
      onclick: 'changeCardColour(); displayDealerCard()'
    }),

    Html.img({
      class: 'card',
      src: `${game.dealer.showHand()[1].image}`
    })
  ]

  Html.clearHtml('dealer-cards-div')
  Html.getAndAppendChildren('dealer-cards-div', cards)
}

function displayAllCards() {
  Html.clearHtml('dealer-cards-div')
  for(let i=0; i<game.dealer.handSize(); i++) {
    const cardToAppend = Html.img({
      class: 'card',
      src: `${game.dealer.showHand()[i].image}`
    })
    Html.getAndAppendChild('dealer-cards-div', cardToAppend)
  }
  displayPlayerCards()
}


function refreshChipsTotals() {
  game.players.forEach((player, index) => {
    document.getElementById(`player${index}-chips-text`).innerHTML = `${player.getChips()}`
  })
}

function showChipsDifference(playersChips) {
  game.players.forEach((player, index) => {
    const difference = player.getChips() - playersChips[index]
    const valueDiv = Html.div({
      class: 'bet-div'
    }, (difference < 0) ? `Lost: ${difference}` : (difference > 0) ? `Won: ${difference}` : 'Break Even')
    Html.getAndAppendChild(`player${index}-insurance-div`, valueDiv)
  })
}

function changeCardColour() {
  game.changeCardColour()
}

  function setHandValue(hand) {
    const index = game.getCurrentPlayer()
    const split = (hand === 0) ? '' : '-split'
    const handValue = game.handValue(game.players[index].showHand(hand))
    const handDiv = document.getElementById(`player${index}${split}-hand-value`)
    handDiv.innerHTML = handValue

    if(handValue > 21) {
      handDiv.setAttribute('class', 'loseColour')
      playSound('groan1')
    } else {
      playSound('click1')
    }
  }

function setHandValueColours() {
  const dealerHandValue = document.getElementById('dealer-hand-value')
  dealerHandValue.innerHTML = game.handValue(game.dealer.showHand())
  dealerHandValue.setAttribute('class', '')
  if(game.handValue(game.dealer.showHand()) > 21) {
    dealerHandValue.setAttribute('class', 'loseColour')
  }
  game.players.forEach((player, index) => {
    document.getElementById(`player${index}-hand-value`).setAttribute('class', `playerHandValue ${player.getHandResult()}Colour`)
    if(player.hands.length === 2) {
      document.getElementById(`player${index}-split-hand-value`).setAttribute('class', `playerHandValue ${player.getSecondHandResult()}Colour`)
    }
  })
}

function displayTheCount() {
  const cardsInDeck = game.deck.size()
  const dealtCards = game.deck.dealtCardsSize()
  const cardsTotal = dealtCards + cardsInDeck
  const hintText = document.getElementById('hint-text')
  if(game.getRound() !== 1) { 
    hintText.innerHTML = `The Count Is ${game.getCardCount()} with ${cardsInDeck}/${cardsTotal} cards remaining  `
  } else if(dealtCards !== 0) {
    hintText.innerHTML = 'Click the dealer to continue'
  } else if(game.players[0].getBets()[0]) {
    hintText.innerHTML = 'Click the deck to continue'
  } else if(game.players[0].getBets() !== []) {
    hintText.innerHTML = 'Right click the deck to place all bets and deal cards'
  } 
}

function increaseBet(index) {
  const input = document.getElementById(`player${index}-bet-input`)
  const currentBet = Number(input.value)
  input.value = currentBet + 500
}

function decreaseBet(index) {
  const input = document.getElementById(`player${index}-bet-input`)
  const currentBet = Number(input.value)
  input.value = currentBet - 500
}

function playSound(sound, option) {
  const path = `../assets/audio/${sound}.mp3`
  const audio = new Audio(path)
  if(option === 'loop') audio.loop = true
  audio.play()
}

window.insuranceBet = insuranceBet
window.increaseBet = increaseBet
window.decreaseBet = decreaseBet
window.playSound = playSound
window.splitHandStick = splitHandStick
window.displayDealerCard = displayDealerCard
window.changeCardColour = changeCardColour
window.makeBets = makeBets
window.addPlayerByClick = addPlayerByClick
window.doubleDown = doubleDown
window.displayTheCount = displayTheCount
window.splitCards = splitCards
window.placeBet = placeBet
window.dealCards = dealCards
window.drawCard = drawCard
window.stick = stick
window.startGame = startGame
window.addNewPlayer = addNewPlayer
window.nextRound = nextRound
