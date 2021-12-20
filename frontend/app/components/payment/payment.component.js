import moment from 'moment';

function ViewPaymentCtrl($scope, $translate, $rootScope) {

    const ctrl = this;
    ctrl.$onInit = () => {
        moment.locale('en');
        $rootScope.$on('paymentEventPopupModal', (evt, data) => {
            ctrl.bill = data;
        });
    };
    let total = 0;
    ctrl.total = (amount) => {
        total += amount;
        return total;
    };
    let vat = 0;
    ctrl.vat = (amount) => {
        vat += amount;
        return vat;
    };
    ctrl.close = () => {
        $('#view-payment').modal('hide');
    };
    ctrl.calculateTransaction = (item) => {
        if (ctrl.paymentType === 'SA' || ctrl.paymentType === 'AS') {
            ctrl.total((item.order.price + item.order.VAT) * item.PVAT);
            ctrl.vat((item.order.price + item.order.VAT) * item.PVAT * item.PVAT);
        }
        else {
            ctrl.total(item.order.price);
            ctrl.vat(item.order.VAT);
        }
    };
}

ViewPaymentCtrl.$inject = ['$scope', '$translate', '$rootScope'];

const ViewPaymentComponent = {
    bindings: {
        bill: '<',
        paymentType: '<'
    },
    controller: ViewPaymentCtrl,
    controllerAs: '$ctrl',
    templateUrl: 'app/components/payment/payment.component.html'
};
export default ViewPaymentComponent;
