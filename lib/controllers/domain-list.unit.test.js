const RoutesInfo = require('@quoin/expressjs-routes-info');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./domain-list');

const expect = testHelpers.expect;

describe("lib/controllers/domain-list", () => {
    beforeEach(() => {
        RoutesInfo.reset();

        // Because it's needed by the utils basicRender()
        const routesInfo = new RoutesInfo('/foo', '/bar');
        routesInfo.route('w2-app:app', '/');
        routesInfo.route('w2-app:home', '/home');
    });

    afterEach(() => {
        RoutesInfo.reset();
    });

    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(2);
    });

    it("should generate 406 for unknown accept", () => {
        const reqOptions = {
            headers: {
                Accept: 'unknown'
            }
        };

        const {req, res} = testHelpers.createMocks(reqOptions);

        moduleToTest(req, res);

        expect(res._getStatusCode()).to.equal(406);
    });

    it("should return HTML when asking for HTML", () => {
        const reqOptions = {
            originalUrl: '/foo/',
            app: {
                get(key) {
                    if (key === 'w2-app:baseUrl') {
                        return '/bar';
                    }
                }
            },
            headers: {
                Accept: 'text/html'
            }
        };

        const {req, res} = testHelpers.createMocks(reqOptions);
        moduleToTest(req, res);

        expect(res._getStatusCode()).to.equal(200);
    });
});