import namespace from './namespace';

const { toast } = window.WarpJS;
const { actionCreator, baseAttributeReducer, concatenateReducers, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'INIT',
    'SET_DIRTY'
]);

const actionCreators = Object.freeze({
    init: (pageHal) => actionCreator(actions.INIT, { pageHal }),
    setDirty: () => actionCreator(actions.SET_DIRTY)
});

export const orchestrators = Object.freeze({
    init: (dispatch, pageHal) => dispatch(actionCreators.init(pageHal)),
    setDirty: (dispatch) => dispatch(actionCreators.setDirty()),
    refreshPage: async (dispatch, isDirty) => {
        if (isDirty) {
            toast.loading($, "Data has been updated, page will be reloaded.", "Reload needed");
            setTimeout(() => document.location.reload(), 1500);
        }
    }
});

export const reducers = concatenateReducers([{
    actions: [ actions.INIT ],
    reducer: (state = {}, action) => setNamespaceSubstate(state, namespace, action.payload.pageHal)
}, {
    actions: [ actions.SET_DIRTY ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'isDirty', true)
}]);
