var expect = require('chai').expect;
describe('async tests', function () {
    it('first passes', function (done) {
        process.nextTick(function () {
            expect(true).to.equal(true);
            done();
        });
    });
    it('second fails', function (done) {
        process.nextTick(function () {
            expect(true).to.equal(false);
            done();
        });
    });
    it('third passes', function (done) {
        process.nextTick(function () {
            expect(true).to.equal(true);
            done();
        });
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
            describe('and some', function () {
                it('yarn', function () {
                    expect(2).to.equal(2);
                });
                it('hats', function () {
                    expect('hat').to.equal('silly');
                });
            });
            describe('and also', function () {
                it('dogs', function () {
                    expect(true).to.equal(true);
                    expect('dogs').to.equal('not here');
                });
            });
        });
    });
});
