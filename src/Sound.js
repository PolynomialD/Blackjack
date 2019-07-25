class Sound {
  static playSound(sound, option) {
    const path = `../assets/audio/${sound}.mp3`
    const audio = new Audio(path)
    if(option === 'loop') {
      audio.loop = true
    } else if(option) {
      audio.volume = option
    }
    audio.play()
  }
}

module.exports = Sound
