export default function emailValidator() {
    return {
        require: 'ngModel',
        link($scope, $attr, $elem, ctrl) {
            const regex = new RegExp('/^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_\\.]*$/', 'i');
            ctrl.$validators.emailValidator = function (value) {
                const valid = regex.test(value);
                return valid ? value : undefined;
            };
        }
    };
}
