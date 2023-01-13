module.exports.validateNumber = function (num, allowedNull = false) {
    if (num === null && allowedNull) return;

    if (typeof num !== 'number') {
        throw Error('Time element must be a valid number');
    }
};
