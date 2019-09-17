import Component from './component';
import { orchestrators } from './flux';

const { wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => {
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    hideModal: async () => orchestrators.hideModal(dispatch),
    showModal: (event) => orchestrators.showModal(dispatch, event)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
