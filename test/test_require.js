
describe('require tests', function () {

  var bag = new window.Bag({
    stores: [ 'localstorage' ]
  });

  var file_js = { url: 'fixtures/require-test.js' };

  before(function() {
    bag.clear(false, function(err) {
      assert.notOk(err);
      //done();
    });
  });

  it('require plain text', function (done) {
    var file_txt = { url: 'fixtures/require-test.txt' };
    bag.require(file_txt, function (err, data) {
      assert.notOk(err);
      done();
     });
  });

  it('js inject', function (done) {
    bag.require(file_js, function (err, data) {
      assert.notOk(err);
      assert.strictEqual(window.require_test1, 'test1');
      done();
    });
  });

  it('require cached', function (done) {
    var file_js = { url: 'fixtures/require-test.js', cached: true };
    bag.require(file_js, function (err, data) {
      assert.notOk(data);
      bag.require(file_js, function (err, data) {
        assert.notOk(data);
      });
      done();
    });
  });

  it('require cached fail', function (done) {
    var file_js = { url: 'wrong-file-name.js', cached: true };
    bag.require(file_js, function (err, data) {
      assert.notOk(data);
      done();
    });
  });

});
