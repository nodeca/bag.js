
describe('extra tests', function () {


  it.skip('use localstorage by priority', function (done) {
    var b = new window.Bag({ stores: ['localstorage', 'websql'] });
    done();
  });


  it.skip('use websql by priority', function (done) {
    var b = new window.Bag({ stores: ['websql', 'localstorage'] });
    done();
  });


  it.skip('reset localstorage when quota exeeded (2.5-5Mb)', function (done) {
    done();
  });


  it('init without `new` keyword', function() {
    assert.instanceOf(new window.Bag(), window.Bag);
    assert.instanceOf(window.Bag(), window.Bag);
  });


});
