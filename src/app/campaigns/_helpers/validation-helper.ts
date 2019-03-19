export class ValidationHelper {

    static isEmpty(str) {
        return (!str || str.length === 0 || /^\s*$/.test(str));
    }

    static minLength(str) {
        return str.length;
    }

    static maxLength(str) {
        return str.length;
    }

    static isURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?' + // port
            '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
            '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }
    static isNumber(str) {
        var pattern = /^[0-9]+\.?[0-9]*$/;
        return pattern.test(str);
    }
    static getArrayLength(array) {
        return array.length;
    }

} 