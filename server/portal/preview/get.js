const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsPlugins = require('@warp-works/warpjs-plugins');
const warpjsUtils = require('@warp-works/warpjs-utils');

const convertCustomLinks = require('./../instance/convert-custom-links');
const serverUtils = require('./../../utils');
const walkExtract = require('./../instance/walk-extract');

module.exports = (req, res) => {
    const { type, id } = req.params;

    warpjsUtils.wrapWith406(res, {
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            // Try if in index first
            Promise.resolve()
                .then(() => warpjsPlugins.getPlugin('search'))
                .then((plugin) => plugin ? plugin.module.getDocument(plugin.config, type, id) : null)
                .then((indexed) => {
                    if (indexed) {
                        return warpjsUtils.createResource(req, {
                            title: indexed.title,
                            desc: null,
                            content: convertCustomLinks(indexed.snippet),
                            type,
                            id
                        });
                    } else {
                        const persistence = serverUtils.getPersistence();
                        const config = serverUtils.getConfig();

                        return Promise.resolve()
                            .then(() => serverUtils.getEntity(null, type))
                            .then((entity) => Promise.resolve()
                                .then(() => entity.getInstance(persistence, id))
                                .then((instance) => Promise.resolve()
                                    .then(() => walkExtract(persistence, entity, instance, [], config.previews.overviewPath))
                                    .then((overviews) => (overviews.length && overviews[0]) || null)
                                    .then((overview) => warpjsUtils.createResource(req, {
                                        title: instance.Name,
                                        desc: instance.desc,
                                        content: convertCustomLinks(overview && overview.Content), // FIXME: Hard-coded attribute.
                                        type,
                                        id
                                    }))
                                )
                            )
                            .finally(() => persistence.close())
                        ;
                    }
                })
                .then((resource) => warpjsUtils.sendHal(req, res, resource, RoutesInfo))
                .catch((err) => serverUtils.sendError(req, res, err))
            ;
        }
    });
};
