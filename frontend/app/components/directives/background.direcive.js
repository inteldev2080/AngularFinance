export default function background() {
    return function (scope, element, attrs) {
        attrs.$observe('background', (url) => {
            element.css({
                'background-image': `url(${url})`,
                'background-size': 'cover',
                'background-position': 'center',
                'background-repeat': 'no-repeat'
            });
        });
    };
}
