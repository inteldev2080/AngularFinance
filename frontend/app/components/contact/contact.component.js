
function ContactCtrl(SystemService, $translate) {
    const ctrl = this;
    ctrl.contactData = {};
    ctrl.$translate = $translate;
    ctrl.SystemService = SystemService;
    ctrl.$onInit = () => {
    };
    ctrl.addContact = (contactForm) => {
        if (contactForm.$invalid) return;
        const _onSuccess = () => {
            ctrl.notify('component.contact.message.success', 'success', 5000);
        };
        const _onError = () => {
            ctrl.notify('component.contact.message.error', 'danger', 5000);
        };
        SystemService.addContact(ctrl.contactData).then(_onSuccess, _onError);
    };
    ctrl.notify = (message, type, timeout) => {
        this.$translate(message).then((translation) => {
            $('body')
                .pgNotification({
                    style: 'bar',
                    message: translation,
                    position: 'top',
                    timeout,
                    type
                })
                .show();
        });
    };
}
ContactCtrl.$inject = ['SystemService', '$translate'];
const SuponContactComponent = {
    bindings: {
    },
    templateUrl: './app/components/contact/contact.component.html',
    controller: ContactCtrl,
    controllerAs: '$ctrl'
};
export default SuponContactComponent;

