const Promise = require('bluebird');

const constants = require('./../constants');

module.exports = ($, modal, changedElement) => {
    const id = $(changedElement).data('warpjsId');
    const newValue = $(changedElement).val();

    return Promise.resolve()
        .then(() => window.WarpJS.toast.warning($, "Need to patch the association description", "TODO"))
        .then((res) => $(`.warpjs-section-selected-documents .warpjs-section-item[data-warpjs-id="${id}"]`, modal).data('warpjsDescription', newValue))
        .then(() => constants.setDirty())
    ;
};
