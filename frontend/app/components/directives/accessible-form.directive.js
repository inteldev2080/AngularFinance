export default function accessibleForm() {
    return {
        restrict: 'A',
        link(scope, elem) {
            // set up event handler on the form element
            elem.on('submit', () => {
                // find the first invalid element
                const firstInvalid = elem[0].querySelector('.ng-invalid');

                // if we find one, set focus
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            });
        }
    };
}
