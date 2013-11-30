/*global describe, it, assert, beforeEach, after*/
'use strict';

describe('require tests', function () {

  var bag = new window.Bag();

  beforeEach(function(done) {
    bag.clear(done);
  });

  after(function(done) {
    bag.clear(done);
  });


  it('require cached fail', function (done) {
    bag.require({ url: 'fixtures/require_text.txt', cached: true }, function (err, data) {
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
    bag.require('fixtures/require_text.txt', function () {
      bag.require({ url: 'fixtures/require_text.txt', cached: true }, function (err, data) {
        assert.notOk(err);
        assert.strictEqual(data, 'lorem ipsum');
        done();
      });
    });
  });


  it('inject JS', function (done) {
    window.test_inc = 0;
    bag.require('fixtures/require_increment.js', function (err) {
      assert.notOk(err);
      assert.strictEqual(window.test_inc, 1);
      done();
    });
  });


  it('inject JS from cache', function (done) {
    window.test_inc = 0;
    bag.require('fixtures/require_increment.js', function () {
      bag.require({ url: 'fixtures/require_increment.js', cached: true }, function (err) {
        assert.notOk(err);
        assert.strictEqual(window.test_inc, 2);
        done();
      });
    });
  });


  it('use the same `unique`', function (done) {
    var url = 'fixtures/require_const.js';
    bag.require({ url: url, unique: 123 }, function (err) {
      assert.notOk(err);
      assert.strictEqual(window.test_const, 5);
      // hack cache content
      bag.get(url, function (err, val) {
        assert.notOk(err);
        val.data = "window.test_const = 10;";
        bag.set(url, val, function () {
          // now make shure that data fetched from cache
          bag.require({ url: url, unique: 123 }, function (err) {
            assert.notOk(err);
            assert.strictEqual(window.test_const, 10);
            done();
          });
        });
      });
    });
  });


  it('use different `unique`', function (done) {
    var url = 'fixtures/require_const.js';
    bag.require({ url: url, unique: 123 }, function (err) {
      assert.notOk(err);
      assert.strictEqual(window.test_const, 5);
      // hack cache content
      bag.get(url, function (err, val) {
        assert.notOk(err);
        val.data = "window.test_const = 10;";
        bag.set(url, val, function () {
          // now make shure that data fetched from server again
          bag.require({ url: url, unique: 456 }, function (err) {
            assert.notOk(err);
            assert.strictEqual(window.test_const, 5);
            done();
          });
        });
      });
    });
  });


  it('require not existing file', function (done) {
    bag.require('./not_existing', function (err) {
      assert.ok(err);
      done();
    });
  });


  it('use external validator `isValidItem()`', function (done) {
    bag.isValidItem = function () { return false; };

    var url = 'fixtures/require_const.js';
    bag.require(url, function (err) {
      assert.notOk(err);
      assert.strictEqual(window.test_const, 5);
      // hack cache content
      bag.get(url, function (err, val) {
        assert.notOk(err);
        val.data = "window.test_const = 10;";
        bag.set(url, val, function () {
          // make shure that data fetched from cache,
          // because invalidated by external validator
          bag.require(url, function (err) {
            assert.notOk(err);
            assert.strictEqual(window.test_const, 5);
            done();
          });
        });
      });
    });
  });


  it('test execution order', function (done) {
    bag.require(['fixtures/require_const.js', 'fixtures/require_const2.js'], function (err) {
      assert.notOk(err);
      assert.strictEqual(window.test_const, 100);
      done();
    });
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


  it('force bypass cache (`live`=true)', function (done) {
    var url = 'fixtures/require_const.js';
    bag.require(url, function (err) {
      assert.notOk(err);
      assert.strictEqual(window.test_const, 5);
      // hack cache content
      bag.get(url, function (err, val) {
        assert.notOk(err);
        val.data = "window.test_const = 10;";
        bag.set(url, val, function () {
          // make shure that data fetched from cache,
          // because invalidated by external validator
          bag.require({url: url, live: true}, function (err) {
            assert.notOk(err);
            assert.strictEqual(window.test_const, 5);
            done();
          });
        });
      });
    });
  });


  it.skip('require() chaining', function (done) {
    done();
  });


});
