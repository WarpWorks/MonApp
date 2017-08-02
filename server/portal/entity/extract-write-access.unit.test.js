const RoutesInfo = require('@quoin/expressjs-routes-info');
const testHelpers = require('@quoin/node-test-helpers');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../config');
const extractWriteAccess = require('./extract-write-access');

const expect = testHelpers.expect;

describe("server/portal/entity/extract-write-access", () => {
    it("should export a function with 5 params", () => {
        expect(extractWriteAccess).to.be.a('function').to.have.lengthOf(5);
    });

    it("should not add _link.edit", () => {
        const req = {};
        const resource = warpjsUtils.createResource('/foo', {});
        const persistence = {};
        const entity = {
            canBeEditedBy() {
                return false;
            }
        };
        const instance = {};

        return extractWriteAccess(req, resource, persistence, entity, instance)
            .then(
                () => {
                    expect(resource._links).not.to.have.property('edit');
                },
                testHelpers.unexpectedFlow.bind(null, "Should not have failed")
            );
    });

    it.skip("should add _links.edit", () => {
        const req = {};
        const resource = warpjsUtils.createResource('/foo', {});
        const persistence = {};
        const entity = {
            canBeEditedBy() {
                return true;
            }
        };
        const instance = {
            type: 'some-type',
            id: 'some-id',
            Name: "Some Name"
        };

        return extractWriteAccess(req, resource, persistence, entity, instance)
            .then(
                () => {
                    expect(resource._links).to.have.property('edit');
                    expect(resource._links.edit.toJSON()).to.deep.equal({
                        rel: 'edit',
                        href: RoutesInfo.expand('W2:content:app', {
                            domain: config.domainName,
                            type: instance.type,
                            oid: instance.id
                        }),
                        title: 'Edit "Some Name"'
                    });
                },
                testHelpers.unexpectedFlow.bind(null, "Should not have failed")
            );
    });
});
