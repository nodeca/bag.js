
describe('storages tests', function () {


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


});
