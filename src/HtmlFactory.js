class HtmlFactory {
  static img (attributes) {
    const image = document.createElement('img')
    Object.keys(attributes).forEach((key) => {
      image.setAttribute(key, attributes[key])
    })
    return image
  }

  static input (attributes) {
    const input = document.createElement('input')
    Object.keys(attributes).forEach((key) => {
      input.setAttribute(key, attributes[key])
    })
    return input
  }
}

module.exports = HtmlFactory