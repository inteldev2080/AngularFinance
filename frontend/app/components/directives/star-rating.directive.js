export default function starRating() {
    return {
        restrict: 'EA',
        template: '<span class="stars m-l-5 pull-right"><i ng-repeat="star in stars" ng-click="toggle($index)" class="fa cursor" ng-class="star.filled?\'fa-star\' : \'fa-star-o\'"></i> </span>',
        scope: {
            ratingValue: '=ngModel',
            max: '=?', // optional (default is 5)
            onRatingSelect: '&?',
            readonly: '=?'
        },
        link(scope, element, attributes) {
            if (scope.max == undefined) {
                scope.max = 5;
            }
            function updateStars() {
                scope.stars = [];
                for (let i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            }

            scope.toggle = function (index) {
                if (scope.readonly == undefined || scope.readonly === false) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelect({
                        rating: index + 1
                    });
                }
            };
            scope.$watch('ratingValue', (oldValue, newValue) => {
                if (newValue || newValue === 0) {
                    updateStars();
                }
            });
        }
    };
}

