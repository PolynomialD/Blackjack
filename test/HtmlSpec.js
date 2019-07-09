const Html = require('../src/Html')
const JSDOM = require("jsdom").JSDOM
const Gen = require('verify-it').Gen
const dom = new JSDOM(`<!DOCTYPE html>`)

before(() => {
  global.document = dom.window.document
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Html', () => {
  describe('div()', () => {
    verify.it('should return a div', () => {
      Html.div().should.match('div')
    })

    verify.it('should have the correct attributes', Gen.object, (attr) => {
      const div = Html.div(attr)
      Object.keys(attr).forEach((key) => {
        div.should.have.attr(key, attr[key])
      })
    })

    verify.it('should have the correct Html', Gen.string, (innerHtml) => {
      const div = Html.div(false, innerHtml)
      div.should.have.html(innerHtml)
    })
  })

  describe('img()', () => {
    verify.it('should return a img', () => {
      Html.img().should.match('img')
    })

    verify.it('should have the correct attributes', Gen.object, (attr) => {
      const img = Html.img(attr)
      Object.keys(attr).forEach((key) => {
        img.should.have.attr(key, attr[key])
      })
    })
  })

  describe('input()', () => {
    verify.it('should return an input', () => {
      Html.input().should.match('input')
    })

    verify.it('should have the correct attributes', Gen.object, (attr) => {
      const input = Html.input(attr)
      Object.keys(attr).forEach((key) => {
        input.should.have.attr(key, attr[key])
      })
    })
  })

  describe('li()', () => {
    verify.it('should return a li', () => {
      Html.li().should.match('li')
    })

    verify.it('should have the correct attributes', Gen.object, (attr) => {
      const li = Html.li(attr)
      Object.keys(attr).forEach((key) => {
        li.should.have.attr(key, attr[key])
      })
    })
  })

  describe('button()', () => {
    verify.it('should return a button', () => {
      Html.button().should.match('button')
    })

    verify.it('should have the correct attributes', Gen.object, (attr) => {
      const button = Html.button(attr)
      Object.keys(attr).forEach((key) => {
        button.should.have.attr(key, attr[key])
      })
    })

    verify.it('should have the correct Html', Gen.string, (innerHtml) => {
      const button = Html.button(false, innerHtml)
      button.should.have.html(innerHtml)
    })
  })

  describe('clearHtml()', () => {
    verify.it('should clear the innerHtml', Gen.string, Gen.string, (id, innerHtml) => {
      document.body.appendChild(Html.div({id}, innerHtml))
      Html.clearHtml(id)
      document.getElementById(id).should.have.html('')
    })
  })

  describe('checkForAndHideElement()', () => {
    verify.it('should check for and hide an element', Gen.string, (id) => {
      document.body.appendChild(Html.div({id}))
      Html.checkForAndHideElement(id)
      document.getElementById(id).should.have.class('hidden')
    })
  })

  describe('checkForAndShowButton()', () => {
    verify.it('should check for and show a button', Gen.string, (id) => {
      document.body.appendChild(Html.button({id}))
      Html.checkForAndShowButton(id)
      document.getElementById(id).should.have.class('displayInline')
    })
  })

  describe('showHintButton()', () => {
    verify.it('should show the hint button', () => {
      document.body.appendChild(Html.button({id: 'hint-button'}))
      Html.showHintButton()
      document.getElementById('hint-button').should.have.class('displayBlock')
    })
  })

  describe('getAndShowButton()', () => {
    verify.it('should get and show a button', Gen.string, (id) => {
      document.body.appendChild(Html.button({id}))
      Html.getAndShowButton(id)
      document.getElementById(id).should.have.class('displayInline')
    })
  })

  describe('getAndHideElement()', () => {
    verify.it('should get and hide an element', Gen.string, (id) => {
      document.body.appendChild(Html.div({id}))
      Html.getAndHideElement(id)
      document.getElementById(id).should.have.class('hidden')
    })
  })

  describe('hideElement()', () => {
    verify.it('should hide an element', () => {
      const element = Html.div()
      Html.hideElement(element)
      element.should.have.class('hidden')
    })
  })

  describe('getAndSetAttributes()', () => {
    verify.it('should get an element and set its attributes', Gen.string, Gen.object, (id, attr) => {
      const element = document.body.appendChild(Html.div({id}))
      Html.getAndSetAttributes(id, attr)
      Object.keys(attr).forEach((key) => {
        element.should.have.attr(key, attr[key])
      })
    })
  })

  describe('getAndAppendChild()', () => {
    verify.it('should get an element and append an element to it', Gen.string, (id) => {
      const parent = document.body.appendChild(Html.div({id}))
      const child = Html.div({id: 'child'})
      Html.getAndAppendChild(id, child)
      parent.should.have.descendant(child)
    })
  })

  describe('appendChildren()', () => {
    verify.it('should append elements to another element', Gen.integerBetween(1,10), (num) => {
      const parent = document.body.appendChild(Html.div({id: 'parent'}))
      const children = []
      for(let i=0; i<num; i++) {
       children.push(Html.div())
      }
      Html.appendChildren(parent, children)
      parent.should.have.descendants('div').and.have.length(num)
    })
  })

  describe('getAndAppendChildren()', () => {
    verify.it('should append elements to another element', Gen.string, Gen.integerBetween(1,10), (id, num) => {
      const parent = document.body.appendChild(Html.div({id}))
      const children = []
      for(let i=0; i<num; i++) {
       children.push(Html.div())
      }
      Html.getAndAppendChildren(id, children)
      parent.should.have.descendants('div').and.have.length(num)
    })
  })

  // describe('setFocus()', () => {
  //   verify.it('should set the focus to an element', Gen.string, (id) => {
     
  //   })
  // })
})
