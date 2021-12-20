export default function compareTo() {
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: '=compareTo'
        },
        link(scope, element, attributes, ngModel) {
      ngModel.$validators.compareTo = function (modelValue) { // eslint-disable-line
          return modelValue === scope.otherModelValue;
      };

            scope.$watch('otherModelValue', () => {
                ngModel.$validate();
            });
        }
    };
}
