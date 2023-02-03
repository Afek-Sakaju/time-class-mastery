module.exports.validateNumber = function (num, allowedNull = false) {
    if (num === null && allowedNull) return;

    if (typeof num !== 'number') {
        throw Error('Time element must be a valid number');
    }
};

module.exports.validateBoolean = function (bool) {
    if (bool === false || bool === true) return;
    else throw Error('Boolean element must be true or false');
};
