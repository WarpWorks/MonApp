import debounce from 'lodash/debounce';

import Component from './component';
import * as orchestrators from './orchestrators';

const mapStateToProps = (state, ownProps) => Object.freeze({
    name: state.name,
    relationship: (state && state.items && state.items.length) ? state.items[0] : {}
});

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    addAssociation: (items, item, itemsUrl, reorderUrl) => orchestrators.addItem(dispatch, items, item, itemsUrl, reorderUrl),
    moveDown: (url) => (items, item) => orchestrators.moveItem(dispatch, items, item, true, url),
    moveUp: (url) => (items, item) => orchestrators.moveItem(dispatch, items, item, false, url),
    removeItem: (items, item) => orchestrators.removeItem(dispatch, items, item),
    syncAssociationDescription: (relationship) => (event, item) => orchestrators.syncAssociationDescription(dispatch, relationship, event, item),
    updateAssociationDescription: (relationship) => (event, item) => orchestrators.updateAssociationDescription(dispatch, relationship, event, item)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    moveDown: dispatchProps.moveDown(stateProps.relationship._links.reorder.href),
    moveUp: dispatchProps.moveUp(stateProps.relationship._links.reorder.href),
    syncAssociationDescription: debounce(dispatchProps.syncAssociationDescription(stateProps.relationship), 250),
    updateAssociationDescription: dispatchProps.updateAssociationDescription(stateProps.relationship),
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
