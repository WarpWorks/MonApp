const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const formFeedback = require('./../form-feedback');
const patch = require('./../../patch');

module.exports = ($) => {
    $('[data-doc-level!=""][data-doc-level]').on('change', function() {
        const updatePath = $(this).data('doc-level');
        const updateValue = $(this).val();

        return Promise.resolve()
            .then(() => formFeedback.start($, this))
            .then(() => patch($, updatePath, updateValue))
            .then(() => formFeedback.success($, this))
            .catch((err) => {
                formFeedback.error($, this);
                console.error("***ERROR:", err);
                warpjsUtils.toast.error($, err.message, "Error updating field");
            });
    });
};
