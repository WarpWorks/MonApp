export default async (dispatch, relationship, event, item) => {
    const url = item._links.self.href;
    const data = {
        field: 'desc',
        value: event.target.value
    };

    const toastLoading = window.WarpJS.toast.loading($, "Updating description...");
    try {
        await window.WarpJS.proxy.patch($, url, data);
        window.WarpJS.toast.success($, "Updated description");
    } catch (err) {
        console.error("Error syncAssociationDescription(): err=", err);
        window.WarpJS.toast.error($, err.message, "Error!");
    } finally {
        window.WarpJS.toast.close($, toastLoading);
    }
};
