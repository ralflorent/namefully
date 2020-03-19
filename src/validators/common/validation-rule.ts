/**
 * Validation rules
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

/**
 * Represents a set of validation rules (regex)
 * @class
 * @static
 */
export class ValidationRule {
    /**
     * Matches one name part (namon) that is of nature:
     * - English
     * - European
     * - Spanish
     * - hyphenated
     * - with apostrophe
     */
    static namon: RegExp = /^[a-zA-Z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]+((['-][a-zA-Z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff])?[a-zA-Z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]*)*$/

    /**
     * Matches 1+ name parts (namon) that are of nature:
     * - English
     * - European
     * - Spanish
     * - hyphenated
     * - with apostrophe
     * - with comma
     * - with period
     * - with space
     */
    static fullname: RegExp = /^[a-zA-Z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]+(([',. -][a-zA-Z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff ])?[a-zA-Z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]*)*$/

    /**
     * Matches one name part (namon) that is of nature:
     * - English
     * - European
     * - Spanish
     * - hyphenated
     * - with apostrophe
     */
    static firstname: RegExp = /^[a-zA-Z\u00D6\u00D8-\u00f6\u00f8-\u00ff]+((['-][a-zA-Z\u00D6\u00D8-\u00f6\u00f8-\u00ff])?[a-zA-Z\u00D6\u00D8-\u00f6\u00f8-\u00ff]*)*$/

    /**
     * Matches 1+ names part (namon) that are of nature:
     * - English
     * - European
     * - Spanish
     * - hyphenated
     * - with apostrophe
     * - with space
     */
    static middlename: RegExp = /^[a-zA-Z\u00D6\u00D8-\u00f6\u00f8-\u00ff]+(([' -][a-zA-Z\u00D6\u00D8-\u00f6\u00f8-\u00ff])?[a-zA-Z\u00D6\u00D8-\u00f6\u00f8-\u00ff]*)*$/

    /**
     * Matches one name part (namon) that is of nature:
     * - English
     * - European
     * - Spanish
     * - hyphenated
     * - with apostrophe
     */
    static lastname: RegExp = /^[a-zA-Z\u00D6\u00D8-\u00f6\u00f8-\u00ff]+((['-][a-zA-Z\u00D6\u00D8-\u00f6\u00f8-\u00ff])?[a-zA-Z\u00D6\u00D8-\u00f6\u00f8-\u00ff]*)*$/
}
