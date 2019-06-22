class HtmlFactory {
  static img (attributes) {
    const image = document.createElement('img')
    Object.keys(attributes).forEach((key) => {
      image.setAttribute(key, attributes[key])
    })
    return image
  }
}

module.exports = HtmlFactory