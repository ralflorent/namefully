"use strict";
/**
 * Validation types
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
exports.__esModule = true;
/**
 * Enum for the validation types
 * @enum
 */
var ValidatorType;
(function (ValidatorType) {
    ValidatorType[ValidatorType["NONE"] = 0] = "NONE";
    ValidatorType[ValidatorType["NAMON"] = 1] = "NAMON";
    ValidatorType[ValidatorType["NAMA"] = 2] = "NAMA";
    ValidatorType[ValidatorType["ARR_NAMES"] = 3] = "ARR_NAMES";
    ValidatorType[ValidatorType["ARR_STRING"] = 4] = "ARR_STRING";
    ValidatorType[ValidatorType["FULL_NAME"] = 5] = "FULL_NAME";
    ValidatorType[ValidatorType["PREFIX"] = 6] = "PREFIX";
    ValidatorType[ValidatorType["FIRST_NAME"] = 7] = "FIRST_NAME";
    ValidatorType[ValidatorType["MIDDLE_NAME"] = 8] = "MIDDLE_NAME";
    ValidatorType[ValidatorType["LAST_NAME"] = 9] = "LAST_NAME";
    ValidatorType[ValidatorType["SUFFIX"] = 10] = "SUFFIX";
    ValidatorType[ValidatorType["CUSTOM"] = 11] = "CUSTOM";
})(ValidatorType = exports.ValidatorType || (exports.ValidatorType = {}));
