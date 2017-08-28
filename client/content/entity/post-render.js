const addChild = require('./add-child');

const actionDeleteRow = require('./action-delete-row');
const actionLink = require('./action-link');
const actionPreview = require('./action-preview');

const addSibling = require('./add-sibling');
const associationModal = require('./association-modal');
const carouselPagination = require('./carousel-pagination');
const deleteEntity = require('./delete-entity');
const patchEntity = require('./patch-entity');
const progressBarModal = require('./../progress-bar-modal');
const tabContentNavigation = require('./tab-content-navigation');
const tablePanelItem = require('./table-panel-item');
const wysiwygEditor = require('./wysiwyg-editor');

module.exports = ($, result) => {
    progressBarModal.show($, 100);
    progressBarModal.hide();

    const instanceDoc = $('[data-warpjs-status="instance"]');

    actionDeleteRow($, instanceDoc);
    actionLink($, instanceDoc);
    actionPreview($, instanceDoc);
    associationModal($, instanceDoc);
    wysiwygEditor($, instanceDoc);

    tabContentNavigation($);
    carouselPagination($, instanceDoc);
    deleteEntity($);
    addSibling($);
    addChild($);
    patchEntity($);
    tablePanelItem($);
};
