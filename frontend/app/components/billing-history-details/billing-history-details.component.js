import moment from 'moment';

function BillingHistoryCtrl(CustomerService, SupplierService, PaymentService, $scope, $translate) {
    const ctrl = this;
    ctrl.$onInit = () => {
        moment.locale('en');
        $('#billingHistory').on('show.bs.modal', () => {
        });
    };
    ctrl.close = () => {
        $('#billingHistory').modal('hide');
    };
}
BillingHistoryCtrl.$inject = ['CustomerService', 'SupplierService', 'PaymentService', '$scope', '$translate'];

const BillingHistoryComponent = {
    bindings: {
        bill: '<'
    },
    controller: BillingHistoryCtrl,
    controllerAs: '$ctrl',
    templateUrl: 'app/components/billing-history-details/billing-history-details.component.html'
};
export default BillingHistoryComponent;
