
describe('localStorage tests', function () {

  var bag = new window.Bag({
    stores: [ 'localstorage' ]
  });

  var key = 'test_key';
  var obj = { lorem: 'imsum', dolorem: 'casum' };
  var obj2 = { tratum: 'curem', lafem: 'pendum' };


  it('key set', function (done) {
    bag.set(key, obj, function (err) {
      assert.ok(!err);
      done();
    });
  });


  it('key get', function (done) {
    bag.get(key, function (err, data) {
      assert.ok(!err);
      assert.deepEqual(obj, data);
      done();
    });
  });


  it('key update', function (done) {
    bag.set(key, obj2, function (err) {
      assert.ok(!err);
      bag.get(key, function (err, data) {
        assert.ok(!err);
        assert.deepEqual(obj2, data);
        done();
      });
    });
  });


  it('key remove', function (done) {
    bag.remove(key, function (err) {
      assert.isUndefined(err);

      bag.get(key, function(err, data) {
        assert.ok(!!err);
        assert.notOk(!!data);
        done();
      });
    });
  });

});
