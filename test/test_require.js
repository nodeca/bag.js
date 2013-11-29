/*global describe, it, assert, before, after*/
'use strict';

describe('require tests', function () {

  var bag = new window.Bag();

  before(function(done) {
    bag.clear(done);
  });

  after(function(done) {
    bag.clear(done);
  });


  it('require cached fail', function (done) {
    var file_js = { url: 'fixtures/require_text.txt', cached: true };
    bag.require(file_js, function (err, data) {
      assert.notOk(data);
      done();
    });
  });


  it('require text', function (done) {
    bag.require('fixtures/require_text.txt', function (err, data) {
      assert.notOk(err);
      assert.strictEqual(data, 'lorem ipsum');
      done();
    });
  });


  it('require cached ok', function (done) {
    var file_txt = { url: 'fixtures/require_text.txt', cached: true };
    bag.require(file_txt, function (err, data) {
      assert.notOk(err);
      assert.strictEqual(data, 'lorem ipsum');
      done();
    });
  });


  it('inject JS', function (done) {
    bag.require('fixtures/require_increment.js', function (err) {
      assert.notOk(err);
      assert.strictEqual(window.test_inc, 1);
      done();
    });
  });


  it('inject JS from cache', function (done) {
    bag.require({ url: 'fixtures/require_increment.js', cached: true }, function (err) {
      assert.notOk(err);
      assert.strictEqual(window.test_inc, 2);
      done();
    });
  });


  it.skip('use the same `unique`', function (done) {
    done();
  });


  it.skip('use different `unique`', function (done) {
    done();
  });


  it.skip('require when cache not expired', function (done) {
    done();
  });


  it.skip('require when cache expired', function (done) {
    done();
  });


  it.skip('require not existing file', function (done) {
    done();
  });


  it.skip('use external validator `isValidItem()`', function (done) {
    done();
  });


  it.skip('test execution order', function (done) {
    done();
  });


  it.skip('test CSS injection', function (done) {
    done();
  });

  
  it.skip('different handlers for different mime-types', function (done) {
    done();
  });


  it.skip('multiple handler for the same mime-type', function (done) {
    done();
  });


  it.skip('remove mime-type handler', function (done) {
    done();
  });


  it.skip('require() with `live: true`, we attempt to fetch from the network first', function (done) {
    done();
  });


  it.skip('require() with `live: true`, we still store the result in the cache', function (done) {
    done();
  });


  it.skip('require() chaining', function (done) {
    done();
  });


});
