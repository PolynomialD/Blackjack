class Medals {

  static awardMedal(combo) {
    let medal
    switch (true) {
      case combo > 29: medal = {
        name: 'gold',
        value: combo
    }
      break
      case combo > 19 && combo < 30: medal = {
        name: 'silver',
        value: combo
    }
      break
      case combo > 9 && combo < 20: medal = {
        name: 'bronze',
        value: combo
      }
      break
      default: medal = {
        name: 'no medal',
        value: 0
      }
    }
    return medal
  }
}

module.exports = Medals
