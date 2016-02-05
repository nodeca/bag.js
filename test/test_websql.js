
describe('WebSQL tests', function () {

  var bag = new window.Bag({
    stores: [ 'websql' ]
  });

  var key = 'test_key';
  var obj = { lorem: 'imsum', dolorem: 'casum' };
  var obj2 = { tratum: 'curem', lafem: 'pendum' };

  before(function () {
    bag.clear();
  });

  after(function () {
    bag.clear();
  });


  it('key set', function () {
    return bag.set(key, obj);
  });


  it('key get', function () {
    return bag.get(key)
      .then(function (data) {
        assert.deepEqual(obj, data);
      });
  });


  it('key update', function () {
    return bag.set(key, obj2)
      .then(function () {
        return bag.get(key);
      })
      .then(function (data) {
        assert.deepEqual(obj2, data);
      });
  });


  it('key remove', function () {
    return bag.remove(key)
      .then(function () {
        return bag.get(key);
      })
      .then(null, function (err) {
        assert.ok(err);
      });
  });


  it('persistance', function () {
    return bag.set(key, obj)
      .then(function () {
        return bag.clear(true);
      })
      .then(function () {
        return bag.get(key);
      })
      .then(function (data) {
        assert.deepEqual(obj, data);
      });
  });


  it('clear', function () {
    return bag.set(key, obj)
      .then(function () {
        return bag.clear();
      })
      .then(function () {
        return bag.get(key);
      })
      .then(null, function (err) {
        assert.ok(err);
      });
  });


  it('keep not expired', function (done) {
    bag.set(key, obj, 1, function (err) {
      assert.notOk(err);
      setTimeout(function () {
        bag.clear(true, function (err) {
          assert.notOk(err);
          bag.get(key, function (err, data) {
            assert.notOk(err);
            assert.deepEqual(obj, data);
            done();
          });
        });
      }, 10);
    });
  });


  it('clear expired', function (done) {
    bag.set(key, obj, 0.005, function (err) {
      assert.notOk(err);
      setTimeout(function () {
        bag.clear(true, function (err) {
          assert.notOk(err);
          bag.get(key, function (err) {
            assert.ok(err);
            done();
          });
        });
      }, 10);
    });
  });

});
