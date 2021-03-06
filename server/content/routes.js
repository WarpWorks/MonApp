const RoutesInfo = require('@quoin/expressjs-routes-info');

const { routes } = require('./constants');
const aggregationFilters = require('./aggregation-filters');
const domain = require('./domain');
const domains = require('./domains');
const domainType = require('./domain-type');
const domainTypes = require('./domain-types');
const entitySibling = require('./entity-sibling');
const fileUpload = require('./../edition/file-upload');
const home = require('./home');
const inlineEdit = require('./inline-edit');
const inlineEditAssociation = require('./inline-edit-association');
const instanceRelationshipItem = require('./instance-relationship-item');
const instanceRelationshipItems = require('./instance-relationship-items');
const inlineEditAssociationReorder = require('./inline-edit-association-reorder');
const inlineEditAddImage = require('./inline-edit-add-image');
const inlineEditParagraphAggregationUpdate = require('./inline-edit-paragraph-aggregation-update');
const inlineEditDeleteImage = require('./inline-edit-delete-image');
const instances = require('./instances');
const instance = require('./instance');
const instanceHistory = require('./instance-history');
const instanceRelationship = require('./instance-relationship');
const orphans = require('./orphans');
const status = require('./status');

const ROUTE_OPTIONS = {
    allowPatch: 'application/json'
};

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route(routes.home, '/', home);
    routesInfo.route(routes.domains, '/domain', domains);
    routesInfo.route(routes.domain, '/domain/{domain}', domain);
    routesInfo.route(routes.fileUpload, '/domain/{domain}/file-upload', fileUpload);
    routesInfo.route(routes.orphans, '/domain/{domain}/orphans', orphans);
    routesInfo.route(routes.entities, '/domain/{domain}/type{?profile}', domainTypes);
    routesInfo.route(routes.entity, '/domain/{domain}/type/{type}{?profile}', domainType);
    routesInfo.route(routes.instances, '/domain/{domain}/type/{type}/instance', instances);
    routesInfo.route(routes.instance, '/domain/{domain}/type/{type}/instance/{id}', instance, ROUTE_OPTIONS);
    routesInfo.route(routes.history, '/domain/{domain}/type/{type}/instance/{id}/history', instanceHistory);
    routesInfo.route(routes.sibling, '/domain/{domain}/type/{type}/instance/{id}/sibling', entitySibling);
    routesInfo.route(routes.status, '/domain/{domain}/type/{type}/instance/{id}/status/{status}', status);
    routesInfo.route(routes.relationship, '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}', instanceRelationship, ROUTE_OPTIONS);
    routesInfo.route(routes.instanceRelationshipItems, '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}/items', instanceRelationshipItems, ROUTE_OPTIONS);
    routesInfo.route(routes.aggregationFilters, '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}/filters', aggregationFilters, ROUTE_OPTIONS);
    routesInfo.route(routes.instanceRelationshipItem, '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}/items/{itemId}', instanceRelationshipItem, ROUTE_OPTIONS);
    routesInfo.route(routes.relationshipPage, '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}/page/{page}', instance);

    routesInfo.route(routes.inlineEdit, '/domain/{domain}/type/{type}/instance/{id}/inline-edit{?view}', inlineEdit);
    routesInfo.route(routes.inlineEditAssociation, '/domain/{domain}/type/{type}/instance/{id}/inline-edit/associations/{name}', inlineEditAssociation);
    routesInfo.route(routes.inlineEditAssociationReorder, '/domain/{domain}/type/{type}/instance/{id}/inline-edit/associations/{name}/reorder', inlineEditAssociationReorder, ROUTE_OPTIONS);

    routesInfo.route(routes.inlineEditAddImage, '/domain/{domain}/type/{type}/instance/{id}/inline-edit-add-image', inlineEditAddImage);
    routesInfo.route(routes.inlineEditParagraphAggregationUpdate, '/domain/{domain}/type/{type}/instance/{id}/update-paragraph-aggregation/{reln}', inlineEditParagraphAggregationUpdate);
    routesInfo.route(routes.inlineEditDeleteImage, '/domain/{domain}/type/{type}/instance/{id}/inline-edit-delete-image', inlineEditDeleteImage);
    return routesInfo;
};
