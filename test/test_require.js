
describe('require tests', function () {

  var bag = new window.Bag({ stores: [ 'localstorage' ] });

  beforeEach(function () {
    return bag.clear();
  });

  after(function () {
    return bag.clear();
  });


  it('require cached fail', function () {
    return bag.require({ url: 'fixtures/require_text.txt', cached: true })
      .then(null, function (err) {
        assert.ok(err);
      });
  });


  it('require text', function () {
    return bag.require('fixtures/require_text.txt')
      .then(function (data) {
        assert.strictEqual(data, 'lorem ipsum');
      });
  });


  it('require cached ok', function () {
    var url = 'fixtures/require_text.txt';

    return bag.require(url)
      // hack cache content
      .then(function () {
        return bag.get(url);
      })
      .then(function (val) {
        val.data = 'tandrum aver';
        return bag.set(url, val);
      })
      .then(function () {
        // require & make sure data is from cache
        return bag.require({ url: url, cached: true });
      })
      .then(function (data) {
        assert.strictEqual(data, 'tandrum aver');
      });
  });


  it('inject JS', function () {
    window.test_inc = 0;

    return bag.require('fixtures/require_increment.js')
      .then(function () {
        assert.strictEqual(window.test_inc, 1);
      });
  });


  it('inject JS from cache', function () {
    window.test_inc = 0;

    return bag.require('fixtures/require_increment.js')
      .then(function () {
        return bag.require({ url: 'fixtures/require_increment.js', cached: true });
      })
      .then(function () {
        assert.strictEqual(window.test_inc, 2);
      });
  });


  it('use the same `unique`', function () {
    var url = 'fixtures/require_const.js';

    return bag.require({ url: url, unique: 123 })
      .then(function () {
        assert.strictEqual(window.test_const, 5);
      })
      // hack cache content
      .then(function () {
        return bag.get(url);
      })
      .then(function (val) {
        val.data = 'window.test_const = 10;';
        return bag.set(url, val);
      })
      .then(function () {
        // now make shure that data fetched from cache
        return bag.require({ url: url, unique: 123 });
      })
      .then(function () {
        assert.strictEqual(window.test_const, 10);
      });
  });


  it('use different `unique`', function () {
    var url = 'fixtures/require_const.js';

    return bag.require({ url: url, unique: 123 })
      .then(function () {
        assert.strictEqual(window.test_const, 5);
      })
      // hack cache content
      .then(function () {
        return bag.get(url);
      })
      .then(function (val) {
        val.data = 'window.test_const = 10;';
        return bag.set(url, val);
      })
      .then(function () {
        // now make shure that data fetched from server again
        return bag.require({ url: url, unique: 456 });
      })
      .then(function () {
        assert.strictEqual(window.test_const, 5);
      });
  });


  it('require not existing file', function () {
    return bag.require('./not_existing')
      .then(null, function (err) { assert.ok(err); });
  });


  it('use external validator `isValidItem()`', function () {
    bag.isValidItem = function () { return false; };

    var url = 'fixtures/require_const.js';

    return bag.require(url)
      .then(function () {
        assert.strictEqual(window.test_const, 5);
      })
      // hack cache content
      .then(function () {
        return bag.get(url);
      })
      .then(function (val) {
        val.data = 'window.test_const = 10;';
        return bag.set(url, val);
      })
      .then(function () {
        // make shure that data fetched from cache,
        // because invalidated by external validator
        return bag.require(url);
      })
      .then(function () {
        assert.strictEqual(window.test_const, 5);
      });
  });


  it('test execution order', function () {
    return bag.require([ 'fixtures/require_const.js', 'fixtures/require_const2.js' ])
      .then(function () {
        assert.strictEqual(window.test_const, 100);
      });
  });


  it('add/replace handler', function () {
    var b = new window.Bag();
    var handled = false;
    b.addHandler('application/javascript', function () { handled = true; });

    return b.require('fixtures/require_const.js')
      .then(function () { assert.ok(handled); });
  });


  it('remove mime-type handler', function () {
    var b = new window.Bag();

    b.removeHandler('application/javascript');

    window.test_const = 0;

    return b.require('fixtures/require_const.js')
      .then(function () {
        assert.strictEqual(window.test_const, 0);
      });
  });


  it('force bypass cache (`live`=true)', function () {
    var url = 'fixtures/require_const.js';

    return bag.require(url)
      .then(function () {
        assert.strictEqual(window.test_const, 5);
      })
      // hack cache content
      .then(function () {
        return bag.get(url);
      })
      .then(function (val) {
        val.data = 'window.test_const = 10;';
        return bag.set(url, val);
      })
      .then(function () {
        // make shure that data fetched from cache,
        // because invalidated by external validator
        return bag.require({ url: url, live: true });
      })
      .then(function () {
        assert.strictEqual(window.test_const, 5);
      });
  });

});
