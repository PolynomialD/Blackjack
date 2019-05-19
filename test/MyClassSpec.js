const MyClass = require('../src/MyClass')
const Gen = require('verify-it').Gen

describe('MyClass', () => {
  verify.it('should have a name', Gen.string, (name) => {
    const myClass = new MyClass(name)
    myClass.name.should.eql(name)
  })
})
