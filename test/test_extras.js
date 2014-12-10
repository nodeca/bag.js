/*global describe, it, assert*/
'use strict';

describe('extra tests', function () {


  it('use localstorage by priority', function (done) {
    var b = new window.Bag({ stores: [ 'localstorage', 'websql' ] });
    b.set('ls_test', 'ls_test', function () {
      var b1 = new window.Bag({ stores: [ 'localstorage' ] });
      b1.get('ls_test', function (err, data) {
        assert.notOk(err);
        assert.strictEqual(data, 'ls_test');
        b.clear(done);
      });
    });
  });


  it('use websql by priority', function (done) {
    var b = new window.Bag({ stores: [ 'websql', 'localstorage' ] });
    b.set('wsql_test', 'wsql_test', function () {
      var b1 = new window.Bag({ stores: [ 'websql' ] });
      b1.get('wsql_test', function (err, data) {
        assert.notOk(err);
        assert.strictEqual(data, 'wsql_test');
        b.clear(done);
      });
    });
  });


  it('reset localstorage (namespace) when quota exceeded (2.5-5Mb)', function (done) {
    var b = new window.Bag({ stores: [ 'localstorage' ] });

    // create big data (>5mb in json)
    var huge = new Array(1000000);
    for (var i = 0, l = huge.length; i < l; i++) { huge[i] = '1234567890'; }

    b.set('permanent', 'permanent', function (err) {
      assert.notOk(err);
      b.set('tmp', 'tmp', 15, function (err) {
        assert.notOk(err);
        b.set('huge', huge, function (err) {
          assert.ok(err);

          b.get('tmp', function (err) {
            assert.ok(err);
            b.get('permanent', function (err) {
              assert.ok(err);
              b.clear(done);
            });
          });
        });
      });
    });
  });


  it('test namespace (only for localStorage)', function (done) {
    var b = new window.Bag({ prefix: 'ns', stores: [ 'localstorage' ] });

    b.set('key', 'value', function () {
      assert.ok(localStorage.ns__key);
      var val = JSON.parse(localStorage.ns__key).value;
      assert.strictEqual(val, 'value');
      b.clear(done);
    });
  });


  it('init without `new` keyword', function() {
    /*eslint-disable new-cap*/
    assert.instanceOf(new window.Bag(), window.Bag);
    assert.instanceOf(window.Bag(), window.Bag);
  });


});
