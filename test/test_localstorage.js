
describe('localStorage tests', function () {

  var bag = new window.Bag({
    stores: [ 'localstorage' ]
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
      .then(function (val) {
        assert.isUndefined(val);
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
      .then(function (val) {
        assert.isUndefined(val);
      });
  });


  function pTimeout(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  it('keep not expired', function () {
    return bag.set(key, obj, 1)
      .then(function () { return pTimeout(10); })
      .then(function () { return bag.clear(true); })
      .then(function () { return bag.get(key); })
      .then(function (data) {
        assert.deepEqual(obj, data);
      });
  });


  it('clear expired', function () {
    return bag.set(key, obj, 0.005)
      .then(function () { return pTimeout(10); })
      .then(function () { return bag.clear(true); })
      .then(function () { return bag.get(key); })
      .then(function (data) {
        assert.isUndefined(data);
      });
  });

});
