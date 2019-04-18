import cloneDeep from 'lodash/cloneDeep';
import extend from 'lodash/extend';

import actions from './actions';
import namespace from './namespace';
import { reducers as userProfileDocumentsReducers } from './../user-profile-documents';

const NAMESPACE = namespace();

const initializeState = (state = {}, action) => {
    const substate = cloneDeep(action.payload);
    return extend({}, state, { [NAMESPACE]: substate });
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.INITIAL_STATE ], reducer: initializeState },
    userProfileDocumentsReducers,
    window.WarpJS.ReactComponents.reducers
]);
