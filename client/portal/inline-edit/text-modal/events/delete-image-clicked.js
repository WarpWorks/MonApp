const constants = require('./../../../../edition/file-upload/constants.js');
const inlineConstants = require('./../../constants.js');
const modalTemplate = require('./delete-file.hbs');
const TITLE = "Delete image";

function getModal($, instanceDoc) {
    return $(constants.MODAL_DELETE_SELECTOR, instanceDoc);
}

module.exports = ($, modal) => {

    modal.on('click', '.warpjs-inline-edit-image-delete-button', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const deleteButton = $(this);

        let imageDeleteModal = getModal($, $('body'));
        if (!imageDeleteModal.length) {
            $('body').append(modalTemplate({
                MODAL_NAME: 'file-delete',
                title: TITLE,
                url: deleteButton.data('warpjsUrl')
            }));

            imageDeleteModal = getModal($, $('body'));

            $('[data-warpjs-action="cancel-delete"]', imageDeleteModal).on('click', function(e) {
                imageDeleteModal.modal('hide');
            });

            imageDeleteModal.on('hidden.bs.modal', (event) => {
                imageDeleteModal.remove();
            });

            $('[data-warpjs-action="confirm-delete"]').on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();

                imageDeleteModal.modal('hide');
                const deleteUrl = $('[data-warpjs-action="file-delete"]').data('warpjsDeleteImageUrl');
                const docLevel = $('[data-warpjs-action="file-delete"]').data('warpjsDocLevel');
                const itemId = $('[data-warpjs-action="file-delete"]').data('warpjsItemId');

                const data = {
                    "docLevel": docLevel,
                    "id": itemId
                };

                Promise.resolve()
                    .then(() => window.WarpJS.toast.loading($, "deleting file...", TITLE))
                    .then((toastLoading) => Promise.resolve()
                        .then(() => $.ajax({
                            method: 'POST',
                            url: deleteUrl,
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify(data)
                        }))
                        .then((res) => window.WarpJS.toast.success($, "File deleted successfully.", TITLE))
                        .then(() => inlineConstants.setDirty())
                        .then(() => true)
                        .catch((err) => {
                            // eslint-disable-next-line no-console
                            console.error("Error delete-file:", err);
                            window.WarpJS.toast.error($, "File delete failed!", TITLE);
                        })
                        .finally(() => window.WarpJS.toast.close($, toastLoading))
                    )
                ;
            });

            imageDeleteModal.modal('show');
        }
    });
};