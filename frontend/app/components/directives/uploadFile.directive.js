export default function fileModel($parse, $translate) {
    return {
        restrict: 'A',
        link(scope, element, attrs) {
            const model = $parse(attrs.fileModel);
            const modelSetter = model.assign;
            element.bind('change', () => {
                const fileSize = element[0].files[0].size / (1024 * 1024);
                if (fileSize > 4) {
                  /*  $translate('component.upload.message.bigImage').then((translation) => {
                        $('body')
                            .pgNotification({
                                style: 'bar',
                                message: translation,
                                position: 'top',
                                timeout: 5000,
                                type: 'danger'
                            })
                            .show();
                    });*/
                } else {
                    scope.$apply(() => {
                        modelSetter(scope, element[0].files[0]);
                    });
                }
            });
        }
    };
}
fileModel.$inject = ['$parse', '$translate'];

