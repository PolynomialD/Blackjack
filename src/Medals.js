class Medals {

  static awardMedal(combo) {
    let medal
    switch (true) {
      case combo > 19: medal = 'gold'
      break;
      case combo > 9 && combo < 20: medal = 'silver'
      break;
      case combo > 5 && combo < 10: medal = 'bronze'
      break;
      default: medal = 'none'
    }
    return medal
  }
}

module.exports = Medals
