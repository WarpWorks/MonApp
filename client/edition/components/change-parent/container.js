import pageHalNamespace from './../../../components/page-hal/namespace';

import Component from './component';
import { orchestrators } from './flux';

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const { hideModal, showModal } = orchestrators;

const mapStateToProps = (state, ownProps) => {
    const pageHal = getNamespaceSubstate(state, pageHalNamespace);

    return Object.freeze({
        title: pageHal && pageHal._links && pageHal._links.changeParent ? pageHal._links.changeParent.title : null,
        url: pageHal && pageHal._links && pageHal._links.changeParent ? pageHal._links.changeParent.href : null
    });
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    hideModal: async () => hideModal(dispatch),
    showModal: async () => showModal(dispatch)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
