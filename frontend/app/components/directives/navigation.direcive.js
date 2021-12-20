
export default function isActive($location) {
    return function (scope, element, attrs) {
        scope.$watch(attrs.isActive, (path) => {
            let isAct = false;
            if (path instanceof Array) {
                for (let i = 0; i < path.length; i++) {
                    if ($location.path().indexOf(path[i]) > -1) {
                        isAct = true;
                    }
                }
            } else {
                isAct = $location.path().indexOf(path) > -1;
            }

            if (isAct) {
                $(element).addClass('active');
                $(element).addClass(attrs.customClasses);
            } else {
                $(element).removeClass('active');
                $(element).removeClass(attrs.customClasses);
            }
        });
    };
}

isActive.$inject = ['$location'];
