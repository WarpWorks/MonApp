import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { initialize } from './action-creators';
import Container from './container';
import reducers from './reducers';

// import _debug from './debug'; const debug = _debug('index');

const PLACEHOLDER = 'warpjs-paragraph-aggregations';

export default async ($, modal, clickedElement) => {
    // debug(`clickedElement=`, clickedElement);

    const aggregationSelected = $(clickedElement).data('warpjsAggregation');
    const aggregations = $(modal).data('warpjsAggregations');

    const store = window.WarpJS.ReactUtils.createStore(reducers, {}, [], process.env.NODE_ENV === 'development');
    store.dispatch(initialize(aggregations, aggregationSelected));

    ReactDOM.render(
        <Provider store={store} id={PLACEHOLDER}>
            <Container />
        </Provider>,
        $(`.${PLACEHOLDER}`).get(0)
    );
};
