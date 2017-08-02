const debug = require('debug')('W2:WarpJS:crud:FindByID');
var ObjectID = require('mongodb').ObjectID;
const RoutesInfo = require('@quoin/expressjs-routes-info');

const warpjsUtils = require('@warp-works/warpjs-utils');

function findOneCB(done, domain, db, collection, id, currentCommand, error, results) {
    if (results) {
        let msg = `Found instance for ID=${results._id} in Domain ${domain}`;
        const result = results;
        const breadcrumb = [];
        const resultList = [];

        // Recursive Closure:
        // eslint-disable-next-line no-inner-declarations
        function createBreadcrumb(mongoError, mongoResult) {
            let err;

            if (mongoError) {
                err = true;
                msg = mongoError;
            } else if (mongoResult) {
                const resource = warpjsUtils.createResource(
                    RoutesInfo.expand('W2:content:app', {
                        domain,
                        type: mongoResult.type || mongoResult.domainName,
                        oid: mongoResult._id.toString()
                    }), {
                        _id: mongoResult._id,
                        type: mongoResult.type || mongoResult.domainName,
                        shortHand: mongoResult.Name || mongoResult.type || mongoResult.domainName
                    }
                );

                breadcrumb.unshift(resource.toJSON());
            }
            if (mongoError || !mongoResult || mongoResult.isRootInstance) {
                resultList.push({
                    queryType: implementation.TYPE,
                    queryID: currentCommand.queryID,
                    matchingEntity: result,
                    breadcrumb,
                    portalView: RoutesInfo.expand('entity', {
                        type: result.type,
                        id: result._id.toString()
                    }),
                    error: err,
                    status: msg
                });
                debug(`breadcrumb(): msg=${msg}`);
                done(resultList);
            } else {
                const parentName = mongoResult.parentBaseClassName;
                const parentCollection = db.collection(parentName);
                parentCollection.findOne({
                    _id: ObjectID(mongoResult.parentID)
                }, createBreadcrumb);
            }
        }

        createBreadcrumb(error, results);
    } else {
        const status = error || `No matching object for ID=${id}`;
        done([{
            error: true,
            status
        }]);
    }
}

function implementation(domain, db, collection, currentCommand, done) {
    const id = currentCommand.targetID;
    if (!id) {
        throw new warpjsUtils.WarpJSError(`FindByID-Query must contain 'targetID'!`);
    }

    collection.findOne({_id: ObjectID(id)}, findOneCB.bind(null, done, domain, db, collection, id, currentCommand));
}

implementation.TYPE = 'FindByID';

module.exports = implementation;
