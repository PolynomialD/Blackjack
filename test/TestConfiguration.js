require('mocha')
require('verify-it')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiDom = require('chai-dom')

chai.use(chaiDom)
chai.use(chaiAsPromised)
chai.should()
