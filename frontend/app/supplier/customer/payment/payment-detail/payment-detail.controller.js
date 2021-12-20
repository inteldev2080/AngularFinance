import moment from 'moment';

export default class SupplierCustomerPaymentDetailCtrl {
    constructor(PaymentService, $stateParams, $translate) {
        this._PaymentService = PaymentService;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
    }
    $onInit() {
        $.Pages.init();
        this.payment = this.$stateParams.payment;
        if (this.$translate.use() === 'ar') {
            this.payment.date = moment(new Date(this.payment.date)).format('YYYY-MM-DD');
        } else {
            this.payment.date = moment(new Date(this.payment.date)).format('DD-MM-YYYY');
        }
    }
}

SupplierCustomerPaymentDetailCtrl.$inject = ['PaymentService', '$stateParams', '$translate'];
