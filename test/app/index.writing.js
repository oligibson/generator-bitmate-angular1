'use strict';

const test = require('ava');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const TestUtils = require('bitmate-generator').TestUtils;

let context;

const files = [
    'client/index.html',
    'client/favicon.ico',
    'client/robots.txt',
    'client/.htaccess',
    '.bowerrc'
];

test.before(() => {
    context = TestUtils.mock('app');
    require('../../generators/app/index');
    process.chdir('../../');
});

test.beforeEach(() => {
    context.copyTemplate['client/index.html'] = null;
});

test(`Write 'index.html'`, t => {
    context.props = {};
    TestUtils.call(context, 'writing', {
        router: 'uirouter'
    });
    t.true(context.copyTemplate['client/index.html'].length > 0);
});

test(`Call this.copyTemplate 5 times`, t => {
    const spy = chai.spy.on(context, 'copyTemplate');
    TestUtils.call(context, 'writing', {
        router: 'uirouter'
    });
    expect(spy).to.have.been.called.exactly(files.length);
    files.forEach(file => t.true(context.copyTemplate[file].length > 0));
});