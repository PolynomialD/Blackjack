class Html {
  static _buildElement(type, attributes, innerHtml) {
    const element = document.createElement(type)

    if(innerHtml) element.innerHTML = innerHtml
    if (attributes) this._setAttributes(element, attributes)
    return element
  }

  static _setAttributes(element, attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key])
    })
  }

  static textNode(text) {
    return document.createTextNode(text)
  }

  static div(attributes, innerHtml) {
    return this._buildElement('div', attributes, innerHtml)
  }

  static img(attributes) {
    return this._buildElement('img', attributes)
  }

  static input(attributes) {  
    return this._buildElement('input', attributes)
  }

  static button(attributes, innerHTML) {
    return this._buildElement('button', attributes, innerHTML)
  }

  static li(attributes) {
    return this._buildElement('li', attributes)
  }

  static clearHtml(...ids) {
    ids.forEach((id) => {
      document.getElementById(id).innerHTML = ''
    })
  }

  static getAndHideElement(...ids) {
    ids.forEach((id) => {
      document.getElementById(id).setAttribute('class', 'hidden')
    })
  }

  static hideElement(element) {
    if(element) {
      element.setAttribute('class', 'hidden')
    }
  }

  static getAndSetAttributes(id, attributes) {
    const element = document.getElementById(id)
    this._setAttributes(element, attributes)
  }

  static getAndAppendChild(id, child) {
    const parent = document.getElementById(id)
    parent.appendChild(child)
  }

  static appendChildren(parent, children) {
    children.forEach((child) => {
      parent.appendChild(child)
    })
  }

  static getAndAppendChildren(id, children) {
    const parent = document.getElementById(id)
    children.forEach((child) => {
      parent.appendChild(child)
    })
  }

  static setFocus(id) {
    document.getElementById(id).focus()
  }
}

module.exports = Html