
describe('extra tests', function () {


  it('use localstorage by priority', function () {
    var b  = new window.Bag({ stores: [ 'localstorage', 'websql' ] });
    var b1 = new window.Bag({ stores: [ 'localstorage' ] });

    return b.set('ls_test', 'ls_test')
      .then(function () {
        return b1.get('ls_test');
      })
      .then(function (data) {
        assert.strictEqual(data, 'ls_test');
        return b.clear();
      });
  });


  it('use websql by priority', function () {
    var b  = new window.Bag({ stores: [ 'websql', 'localstorage' ] });
    var b1 = new window.Bag({ stores: [ 'websql' ] });

    return b.set('wsql_test', 'wsql_test')
      .then(function () {
        return b1.get('wsql_test');
      })
      .then(function (data) {
        assert.strictEqual(data, 'wsql_test');
        return b.clear();
      });
  });


  it('reset localstorage (namespace) when quota exceeded (2.5-5Mb)', function () {
    var b = new window.Bag({ stores: [ 'localstorage' ] });

    // create big data (>5mb in json)
    var huge = new Array(1000000);
    for (var i = 0, l = huge.length; i < l; i++) huge[i] = '1234567890';

    return b.set('permanent', 'permanent')
      .then(function () {
        return b.set('tmp', 'tmp', 15);
      })
      .then(function () {
        return b.set('huge', huge);
      })
      .then(function () {
        throw new Error('Set hude data should fail');
      }, function () {
        return b.get('tmp');
      })
      .then(function (val) {
        assert.isUndefined(val);

        return b.get('permanent');
      })
      .then(function (val) {
        assert.isUndefined(val);
        return b.clear();
      });
  });


  it('test namespace (only for localStorage)', function () {
    var b = new window.Bag({ prefix: 'ns', stores: [ 'localstorage' ] });

    return b.set('key', 'value')
      .then(function () {
        assert.ok(localStorage.ns__key);
        var val = JSON.parse(localStorage.ns__key).value;
        assert.strictEqual(val, 'value');
        return b.clear();
      });
  });


  it('init without `new` keyword', function () {
    /*eslint-disable new-cap*/
    assert.instanceOf(new window.Bag(), window.Bag);
    assert.instanceOf(window.Bag(), window.Bag);
  });


});
