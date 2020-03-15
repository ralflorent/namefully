"use strict";
/**
 * Validation rules
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
exports.__esModule = true;
/**
 * Represents a set of validation rules (regex)
 * @class
 * @static fields only
 * @implements {Validator}
 */
var ValidationRule = /** @class */ (function () {
    function ValidationRule() {
    }
    ValidationRule.namon = /^[a-zA-Z]+((['-][a-zA-Z])?[a-zA-Z]*)*$/;
    ValidationRule.fullname = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    ValidationRule.firstname = /^[a-zA-Z]+((['-][a-zA-Z])?[a-zA-Z]*)*$/;
    ValidationRule.middlename = /^[a-zA-Z]+(([' -][a-zA-Z])?[a-zA-Z]*)*$/;
    ValidationRule.lastname = /^[a-zA-Z]+((['-][a-zA-Z])?[a-zA-Z]*)*$/;
    return ValidationRule;
}());
exports.ValidationRule = ValidationRule;
