// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'babel-regenerator-runtime';
import ReactDOM from 'react-dom';

import IndividualContributionHeader from './individual-contribution-header';

import debug from './../debug';

const Promise = require('bluebird');

const actionGoto = require('./../../shared/action-goto');
const documentStatus = require('./../document-status');
const inlineEdit = require('./../inline-edit');
const preview = require('./../preview');
const tableOfContents = require('./../table-of-contents');
const template = require('./template.hbs');
const panelItems = require('./panel-items');
const imageResizer = require('./image-resizer');
const log = debug('client/portal/instance/index');

(($) => $(document).ready(() => Promise.resolve()
    .then(() => window.WarpJS.getCurrentPageHAL($))
    .then(
        (result) => {
            if (result.error) {
                $(window.WarpJS.CONTENT_PLACEHOLDER).html(window.WarpJS.error(result.data));
            } else {
                $(window.WarpJS.CONTENT_PLACEHOLDER).html(template(result.data));

                if (result.data && result.data._embedded && result.data._embedded.pages) {
                    const page = result.data._embedded.pages[0];

                    if (page && page.name) {
                        document.title = page.name;
                    }

                    if (page && page._embedded && page._embedded.previews) {
                        page._embedded.previews.forEach((preview) => window.WarpJS.cache.set(preview._links.preview.href, {
                            title: preview.title,
                            content: preview.content
                        }));
                    }

                    preview($);

                    const state = window.WarpJS.flattenHAL(result.data);
                    log(`state=`, state);

                    window.WarpJS.ReactUtils.initReactBootstrapDisplayNames();

                    const individualContributionHeaderPlaceholder = document.getElementById('warpjs-individual-contribution-header-placeholder');
                    if (individualContributionHeaderPlaceholder) {
                        ReactDOM.render(<IndividualContributionHeader page={state.pages[0]} />, individualContributionHeaderPlaceholder);
                    }
                }

                panelItems($);
                inlineEdit($);
                tableOfContents($);
                actionGoto($);
                documentStatus($, result.data);

                window.WarpJS.displayCookiePopup(result.data.customMessages, result.data._links.acceptCookies);

                imageResizer($);
            }
        },
        (err) => {
            console.error("Error contacting server:", err);
            window.WarpJS.toast.error($, err.message, "Error contacting server");
        }
    )
    .catch((err) => {
        console.error("Error processing response:", err);
        window.WarpJS.toast.error($, err.message, "Error processing response");
    })
))(jQuery);
