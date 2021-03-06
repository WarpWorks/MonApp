const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const EntityTypes = require('./../../../lib/core/entity-types');

// const debug = require('./debug')('overview-by-entity');

function buildTOCLevel(items, level, index) {
    // debug(`buildTOCLevel(level=${level}): items=`, items);
    const filteredItems = items.filter((item) => item.showItem);
    const cumulator = [];

    for (let i = index; i < filteredItems.length; i++) {
        const item = filteredItems[i];
        const currentLevel = parseInt(item.level[1], 10);

        if (currentLevel < level) {
            // We went up one level. End.
            break;
        } else if (currentLevel === level) {
            const resource = warpjsUtils.createResource('', {
                id: item.id,
                name: item.name,
                tocType: 'toc-item'
            });
            cumulator.push(resource);

            if (item._embedded && item._embedded.subDocuments) {
                // debug(`buildTOCLevel(level=${level}): build subDocuments=`, item._embedded.subDocuments);
                const subDocuments = item._embedded.subDocuments.map((subDocument) => warpjsUtils.createResource(subDocument._links.self.href, {
                    name: subDocument.label,
                    tocType: 'sub-document-item'
                }));

                resource.embed('items', subDocuments);
            }

            resource.embed('items', buildTOCLevel(filteredItems, level + 1, i + 1));
        }
    }

    return cumulator;
}

module.exports = (persistence, entity, instance, isSpecializedPageViewStyle, pageOverview) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', {
        type: "Panel",
        id: null,
        name: "Overview",
        description: "Document Overview",
        label: entity.getDisplayName(instance),
        isOverviewPanel: true,
        style: 'Transparent'
    }))
    .then((resource) => Promise.resolve()
        .then(() => entity.getRelationshipByName('Overview'))
        .then((relationship) => Promise.resolve()
            .then(() => {
                resource.id = relationship.id;

                if (!relationship.isAggregation || relationship.getTargetEntity().entityType === EntityTypes.EMBEDDED) {
                    resource.reference = {
                        type: relationship.type,
                        id: relationship.id
                    };
                }
            })
            .then(() => {
                const paragraphsByRelationship = require('./paragraphs-by-relationship');
                return paragraphsByRelationship(persistence, relationship, instance);
            })
        )
        .then((items) => {
            if (items && items.length) {
                resource.showPanel = true;
                resource.embed('items', items);

                // Need to convert paragraph into TOC.
                if (pageOverview) {
                    resource.embed('tableOfContents', buildTOCLevel(items, 1, 0));
                }
            }
        })
        .then(() => resource)
    )
;
