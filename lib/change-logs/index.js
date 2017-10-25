const _ = require('lodash');

const AddAggregationChangeLog = require('./add-aggregation-change-log');
const AddAssociationChangeLog = require('./add-association-change-log');
const AddEmbeddedChangeLog = require('./add-embedded-change-log');
const BaseChangeLog = require('./base-change-log');
const CreateEntityChangeLog = require('./create-entity-change-log');
const RemoveAssociationChangeLog = require('./remove-association-change-log');
const RemoveEmbeddedChangeLog = require('./remove-embedded-change-log');
const UpdateValueChangeLog = require('./update-value-change-log');
const constants = require('./constants');
const isValidAction = require('./is-valid-action');

const REGISTRY = [
    AddAggregationChangeLog,
    AddAssociationChangeLog,
    AddEmbeddedChangeLog,
    CreateEntityChangeLog,
    RemoveAssociationChangeLog,
    RemoveEmbeddedChangeLog,
    UpdateValueChangeLog
].reduce((memo, changeLogClass) => {
    const action = changeLogClass.action;

    if (memo[action]) {
        throw new Error(`Action '${action}' already defined by '${memo[action].name}'.`);
    }

    if (isValidAction(action)) {
        return _.extend(memo, {
            [action]: changeLogClass
        });
    } else {
        throw new Error(`Invalid action '${action}' from '${changeLogClass.name}'.`);
    }
}, {});

class ChangeLogs {
    constructor(instance) {
        this.instance = instance;

        if (!this.instance._meta) {
            this.instance._meta = {};
        }

        if (!this.instance._meta.history) {
            this.instance._meta.history = [];
        }
    }

    add(changeLog) {
        this.instance._meta.history.push(changeLog.toJSON());
        return this.instance;
    }

    toJSON() {
        return _.cloneDeep(this.instance._meta.history);
    }

    toFormResource(domain) {
        const history = _.cloneDeep(this.instance._meta.history);
        history.reverse();

        return history.map((changeLog) => {
            const ChangeLogClass = REGISTRY[changeLog.action];
            if (ChangeLogClass) {
                return BaseChangeLog.fromDocument(ChangeLogClass, changeLog).toFormResource(domain);
            }
        });
    }
}

ChangeLogs.constants = constants;

ChangeLogs.toFormResource = (domain, instance) => (new ChangeLogs(instance)).toFormResource(domain);

ChangeLogs.addAggregation = (req, instance, key, type, id) => {
    const changeLogs = new ChangeLogs(instance);
    const changeLog = AddAggregationChangeLog.fromReq(req, key, type, id);

    return changeLogs.add(changeLog);
};

ChangeLogs.addAssociation = (req, instance, key, label, type, id) => {
    const changeLogs = new ChangeLogs(instance);
    const changeLog = AddAssociationChangeLog.fromReq(req, key, label, type, id);

    return changeLogs.add(changeLog);
};

ChangeLogs.removeAssociation = (req, instance, key, label, type, id) => {
    const changeLogs = new ChangeLogs(instance);
    const changeLog = RemoveAssociationChangeLog.fromReq(req, key, label, type, id);

    return changeLogs.add(changeLog);
};

ChangeLogs.addEmbedded = (req, instance, key, type, id) => {
    const changeLogs = new ChangeLogs(instance);
    const changeLog = AddEmbeddedChangeLog.fromReq(req, key, type, id);

    return changeLogs.add(changeLog);
};

ChangeLogs.createEntity = (req, instance, label, type, id) => {
    const changeLogs = new ChangeLogs(instance);
    const changeLog = CreateEntityChangeLog.fromReq(req, label, type, id);

    return changeLogs.add(changeLog);
};

ChangeLogs.updateValue = (req, instance, key, oldValue, newValue) => {
    const changeLogs = new ChangeLogs(instance);
    const changeLog = UpdateValueChangeLog.fromReq(req, key, oldValue, newValue);

    return changeLogs.add(changeLog);
};

ChangeLogs.removeEmbedded = (req, instance, key) => {
    const changeLogs = new ChangeLogs(instance);
    const changeLog = RemoveEmbeddedChangeLog.fromReq(req, key);

    return changeLogs.add(changeLog);
};

module.exports = ChangeLogs;