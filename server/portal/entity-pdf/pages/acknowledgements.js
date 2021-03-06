// const debug = require('./debug')('acknowledgements');
const oxfordComma = require('./../../../../lib/utils/oxford-comma');

const extractUsers = (items) => items.reduce(
    (memo, item) => {
        if (item._embedded.items && item._embedded.items.length) {
            return memo.concat(item._embedded.items.map((user) => {
                if (user._embedded.companies) {
                    const companies = user._embedded.companies.map((company) => company.label);
                    return `${user.label} (${companies.join('/')})`;
                } else {
                    return user.label;
                }
            }));
        } else {
            return memo;
        }
    },
    []
);

module.exports = async (documentResource) => {
    const year = (new Date()).getFullYear();

    const acknowledgement = "This document is a work product of the Industrial Internet Consortium (IIC)";

    let groups = [];
    if (documentResource._embedded.workGroups && documentResource._embedded.workGroups.length) {
        groups = groups.concat(documentResource._embedded.workGroups.map((workGroup) => `${workGroup.name} Working Group`));
    }

    if (documentResource._embedded.taskGroups && documentResource._embedded.taskGroups.length) {
        groups = groups.concat(documentResource._embedded.taskGroups.map((taskGroup) => `${taskGroup.name} Task Group`));
    }

    groups.forEach((group, index) => {
        if (index) {
            groups[index] = `its ${group}`;
        }
    });

    groups = oxfordComma(groups);

    const content = [{
        text: `Copyright © ${year}, Industrial Internet Consortium`,
        style: 'paragraph',
        pageBreak: 'before'
    }, {
        text: 'Acknowledgements',
        headlineLevel: 1,
        style: 'headline1'
    }, {
        text: `${acknowledgement}${groups ? ` ${groups}` : ''}.`,
        style: 'paragraph'
    }];

    if (documentResource._embedded) {
        if (documentResource._embedded.editors && documentResource._embedded.editors.length) {
            content.push({
                text: 'Editors',
                style: 'headline'
            });

            const names = extractUsers(documentResource._embedded.editors);
            content.push({
                text: oxfordComma(names)
            });
        }

        if (documentResource._embedded.authors && documentResource._embedded.authors.length) {
            content.push({
                text: 'Authors',
                style: 'headline'
            });

            content.push({
                text: "The following persons have written substantial portion of material content in this document:",
                style: 'paragraph'
            });

            const names = extractUsers(documentResource._embedded.authors);
            content.push({
                text: oxfordComma(names),
                style: 'paragraph'
            });
        }

        if (documentResource._embedded.contributors && documentResource._embedded.contributors.length) {
            content.push({
                text: 'Contributors',
                style: 'headline'
            });

            content.push({
                text: "The following persons have contributed valuable ideas and feedback that significantly improve the content and quality of this document:",
                style: 'paragraph'
            });

            const names = extractUsers(documentResource._embedded.contributors);
            content.push({
                text: oxfordComma(names),
                style: 'paragraph'
            });
        }

        content.push({
            text: "IIC ISSUE REPORTING",
            style: 'headline'
        });

        content.push({
            text: [
                "All IIC documents are subject to continuous review and improvement. ",
                "As part of this process, we encourage readers to report any ambiguities, ",
                "inconsistencies or inaccuracies they may find in this Document or ",
                "other IIC materials by sending an email to ",
                {
                    text: "admin@iiconsortium.org",
                    link: 'mailto:admin@iiconsortium.org',
                    style: 'link'
                },
                "."
            ],
            style: 'paragraph'
        });
    }

    return content;
};
