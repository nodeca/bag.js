/*global describe, it, assert*/
'use strict';

describe('extra tests', function () {


  it('use localstorage by priority', function (done) {
    var b = new window.Bag({ stores: ['localstorage', 'websql'] });
    b.set('ls_test', 'ls_test', function () {
      var b1 = new window.Bag({ stores: ['localstorage'] });
      b1.get('ls_test', function (err, data) {
        assert.notOk(err);
        assert.strictEqual(data, 'ls_test');
        b.clear(done);
      });
    });
  });


  it('use websql by priority', function (done) {
    var b = new window.Bag({ stores: ['websql', 'localstorage'] });
    b.set('wsql_test', 'wsql_test', function () {
      var b1 = new window.Bag({ stores: ['websql'] });
      b1.get('wsql_test', function (err, data) {
        assert.notOk(err);
        assert.strictEqual(data, 'wsql_test');
        b.clear(done);
      });
    });
  });


  it.skip('reset localstorage when quota exceeded (2.5-5Mb)', function (done) {
    done();
  });


  it('init without `new` keyword', function() {
    assert.instanceOf(new window.Bag(), window.Bag);
    assert.instanceOf(window.Bag(), window.Bag);
  });


});
