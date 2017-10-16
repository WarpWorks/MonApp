const warpjsUtils = require('@warp-works/warpjs-utils');

function findTopEmbedded(element) {
    return $(element).parents('[data-warpjs-entity-type="Embedded"]').last();
}

module.exports = ($, instanceDoc) => {
    // When a carousel drop-down is changed, move to that pane-body.
    instanceDoc.on('change', '.carousel-pagination .pagination-select', function() {
        const tabindex = $(this).val();
        $(this).closest('.panel-heading').next().children().addClass('hidden');
        $(this).closest('.panel-heading').next().children(`[data-option-index="${tabindex}"]`).removeClass('hidden');
        $(this).closest('.pagination-group')
            .children('.pagination-info')
            .children('.pagination-info-start')
            .text(parseInt($(this).val(), 10) + 1);
    });

    instanceDoc.on('click', '.carousel-pagination .pagination-left, .carousel-pagination .pagination-right', function() {
        const parent = $(this).closest('.pagination-group');
        const select = $('> .pagination-select', parent);
        const selectValue = parseInt(select.val(), 10);
        const pageLimit = parseInt($(this).data('pageLimit'), 10);

        if (selectValue !== pageLimit) {
            const delta = ($(this).data('pageDirection') === 'right') ? 1 : -1;
            const newIndex = selectValue + delta;
            select.val(newIndex).trigger('change');
        }
    });

    instanceDoc.on('click', '.carousel-pagination .pagination-add .glyphicon.pagination-add', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const topEmbedded = findTopEmbedded(this);

        const ajaxOptions = {
            method: 'POST',
            url: topEmbedded.data('warpjsUrl'),
            headers: {
                accept: warpjsUtils.constants.HAL_CONTENT_TYPE,
                contentType: 'application/json'
            },
            data: {
                docLevel: $(this).data('warpjsDocLevel')
            },
            dataType: 'json'
        };

        return Promise.resolve()
            .then(() => $.ajax(ajaxOptions))
            .then((res) => document.location.reload())
            .catch((err) => {
                // TODO: Give UI feedback.
                console.log("Error adding carousel:", err);
            })
        ;
    });

    instanceDoc.on('click', '.carousel-pagination .pagination-remove .glyphicon.pagination-remove', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const parent = $(this).closest('.pagination-group');
        const select = $('> .pagination-select', parent);
        const option = $('option:selected', select);

        if (option.length) {
            const topEmbedded = findTopEmbedded(this);

            const ajaxOptions = {
                method: 'DELETE',
                url: topEmbedded.data('warpjsUrl'),
                headers: {
                    'Accept': warpjsUtils.constants.HAL_CONTENT_TYPE,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    docLevel: $(option).data('warpjsDocLevel')
                }, null, 2),
                dataType: 'json'
            };

            Promise.resolve()
                .then(() => $.ajax(ajaxOptions))
                .then((res) => document.location.reload())
                .catch((err) => {
                    // TODO: Give UI feedback.
                    console.log("Error adding carousel:", err);
                })
            ;
        }
    });
};