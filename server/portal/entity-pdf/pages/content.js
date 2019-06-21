// const debug = require('./debug')('content');
const itemElement = require('./item-element');

module.exports = (documentResource) => {
    if (!documentResource || !documentResource._embedded || !documentResource._embedded.items) {
        return;
    }

    return documentResource._embedded.items.reduce(
        (memo, item) => memo.concat(itemElement(item)),
        []
    );
};
