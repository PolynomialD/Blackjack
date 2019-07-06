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
})
