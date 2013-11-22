
describe('require tests', function () {

  var bag = new window.Bag();

  before(function(done) {
    bag.clear(false, function(err) {
      assert.notOk(err);
      done();
    });
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
    bag.require('fixtures/require_increment.js', function (err, data) {
      assert.notOk(err);
      assert.strictEqual(window.test_inc, 1);
      done();
    });
  });


  it('inject JS from cache', function (done) {
    bag.require({ url: 'fixtures/require_increment.js', cached: true }, function (err, data) {
      assert.notOk(err);
      assert.strictEqual(window.test_inc, 2);
      done();
    });
  });


});
