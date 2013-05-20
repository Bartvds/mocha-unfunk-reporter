var expect = require('chai').expect;
describe('async tests', function () {
    it('first passes', function (done) {
        setTimeout(function () {
            expect(true).to.equal(true);
            done();
        }, 10);
    });
    it('second fails', function (done) {
        setTimeout(function () {
            expect(true).to.equal(false);
            done();
        }, 10);
    });
    it('third passes', function (done) {
        setTimeout(function () {
            expect(true).to.equal(true);
            done();
        }, 10);
    });
});
describe('kitteh', function () {
    describe('can', function () {
        it('meow', function () {
            expect(true, 'once').to.equal(true);
        });
        describe('has', function () {
            it('milk', function () {
                expect(true).to.equal(true);
            });
            it('cheeseburgers', function () {
                expect(true).to.equal(true);
                expect(true).to.equal(true);
                expect(true).to.equal(true);
            });
            describe('some', function () {
                it('yarn', function () {
                    expect(2).to.equal(2);
                });
                it('hats', function () {
                    expect('hat').to.equal('silly');
                });
            });
            describe('no', function () {
                it('dogs', function () {
                    expect(true).to.equal(true);
                    expect('dogs').to.equal('not here');
                });
            });
        });
    });
});
