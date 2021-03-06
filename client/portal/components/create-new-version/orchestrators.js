import * as actionCreators from './action-creators';

// import _debug from './debug'; const debug = _debug('orchestrators');

const { proxy, toast } = window.WarpJS;

export const createVersion = async (dispatch, url, nextVersion) => {
    const toastLoading = await toast.loading($, `Creating version '${nextVersion}'...`, "Creating...");
    try {
        const res = await proxy.post($, url, { nextVersion });
        toast.success($, "Done");
        // eslint-disable-next-line require-atomic-updates
        window.location.href = res._links.newVersion.href;
    } catch (err) {
        const message = err && err.responseJSON ? err.responseJSON.message : 'Unknown';
        toast.error($, message, `Error creating version '${nextVersion}'`);
    } finally {
        toast.close($, toastLoading);
    }
};

export const hide = (dispatch) => {
    dispatch(actionCreators.hide());
    resetVersion(dispatch);
};

export const resetVersion = (dispatch) => {
    dispatch(actionCreators.resetVersion());
};

export const show = (dispatch) => {
    dispatch(actionCreators.show());
};

export const updateVersion = (dispatch, event) => {
    dispatch(actionCreators.updateVersion(event));
};
