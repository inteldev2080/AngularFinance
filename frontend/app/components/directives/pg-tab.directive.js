export default function pgTab($parse) {
    return {
        link(scope, element, attrs) {
            const slide = attrs.slide;
            const onShown = $parse(attrs.onShown);
      // Sliding effect for tabs
            $(element).on('show.bs.tab', (e) => {
                e = $(e.target).parent().find('a[data-toggle=tab]');

                const hrefCurrent = e.attr('href');

                if ($(hrefCurrent).is('.slide-left, .slide-right')) {
                    $(hrefCurrent).addClass('sliding');

                    setTimeout(() => {
                        $(hrefCurrent).removeClass('sliding');
                    }, 100);
                }
            });

            $(element).on('shown.bs.tab', {
                onShown
            }, (e) => {
                if (e.data.onShown) {
                    e.data.onShown(scope);
                }
            });

            $(element).click((e) => {
                e.preventDefault();
                $(element).tab('show');
            });
        }
    };
}
pgTab.$inject = ['$parse'];
