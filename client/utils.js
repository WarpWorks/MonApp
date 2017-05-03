const Promise = require('bluebird');

const constants = require('./../lib/constants');

function ensureHalHeader(settings) {
    if (!settings.headers) {
        settings.headers = {};
    }
    settings.headers.Accept = constants.HAL_CONTENT_TYPE;

    if (!settings.dataType) {
        settings.dataType = 'json';
    }

    return settings;
}

function getCurrentPageHAL($, url) {
    return new Promise((resolve, reject) => {
        const defaultSettings = {
            method: 'GET',
            success(data, textStatus, jqXHR) {
                resolve({data, textStatus, jqXHR});
            },
            error(jqXHR, textStatus, errorThrown) {
                resolve({
                    error: {
                        textStatus,
                        errorThrown
                    },
                    data: jqXHR.responseJSON
                });
            }
        };

        if (url) {
            defaultSettings.url = url;
        }

        const settings = ensureHalHeader(defaultSettings);

        $.ajax(settings);
    });
}

function trace(level, arg1, arg2, arg3, arg4) {
    var tracelevel = 1; // 0=ignore
    if (tracelevel >= level && arg1 && arg2) {
        console.log(arg1 + '():');
        console.log(' - ' + arg2);
        if (arg3) {
            console.log(' - ' + arg3);
        }
        if (arg4) {
            console.log(' - ' + arg4);
        }
    }
}

module.exports = {
    ensureHalHeader,
    getCurrentPageHAL,
    HAL_CONTENT_TYPE: constants.HAL_CONTENT_TYPE,
    trace
};