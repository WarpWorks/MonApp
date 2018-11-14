module.exports = Object.freeze({
    MODAL_NAME: 'warpjs-inline-edit',
    IS_DIRTY: 'warpjsIsDirty',
    get selector() {
        return `[data-warpjs-modal="${this.MODAL_NAME}"]`;
    },
    setDirty() {
        $(this.selector).data(this.IS_DIRTY, true);
    },
    onClose(modal) {
        modal = modal || $(this.selector);
        modal.on('hidden.bs.modal', () => {
            if (modal.data(this.IS_DIRTY)) {
                window.WarpJS.toast.loading($, "Data has been updated, please reload the page", "Reload needed");
            }
            modal.remove();
        });
    }
});
