class Medals {

  static awardMedal(combo) {
    let medal
    switch (true) {
      case combo > 19: medal = {
        name: 'gold',
        value: combo
    }
      break
      case combo > 9 && combo < 20: medal = {
        name: 'silver',
        value: combo
    }
      break
      case combo > 5 && combo < 10: medal = {
        name: 'bronze',
        value: combo
      }
      break
      default: medal = {
        name: 'wood',
        value: 0
      }
    }
    return medal
  }
}

module.exports = Medals
