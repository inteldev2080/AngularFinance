import moment from 'moment';

function RecordPaymentCtrl(CustomerService, SupplierService, PaymentService, $scope, $translate, UserService) {
    const ctrl = this;
    ctrl.$onInit = () => {
        moment.locale('en');
        $('#date').datepicker({
            format: 'yyyy-mm-dd',
            language: 'en'
        });

        if (ctrl.customerFlag) {
            ctrl.getCustomers();
        }
        if (ctrl.supplierFlag) {
            ctrl.getSuppliers();
        }
        $scope.$on('getPayment', (event, id) => {
            ctrl.viewMode = true;
            ctrl.getPayment(id);
        });
        $('#payment').on('hide.bs.modal', () => {
            ctrl.viewMode = false;
        });
        $scope.$on('onPaymentChanged', (e, data, mode) => {
            ctrl.viewMode = mode;
            ctrl.payment = data;
            moment.locale('en');
            ctrl.payment.date = moment(new Date(ctrl.payment.date)).format('YYYY-MM-DD');
            $('#date').datepicker('setDate', ctrl.payment.date);
            $('#date').datepicker('update');
        });
    };
    ctrl.userType = UserService.getCurrentUser().type;

    ctrl.onSubmit = (paymentForm) => {
        if (paymentForm.$invalid) return;
        const _onSuccess = (res) => {
            ctrl.notify('component.record-payment.message.record.success', 'success', 1000);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            ctrl.notify('component.record-payment.message.record.failure', 'danger', 1000);
        };
        ctrl.onSave({ payment: this.payment })
        .then(_onSuccess, _onError);
    };
    ctrl.getCustomers = () => {
        CustomerService.getCustomers().then(
          // on success
          (res) => {
              ctrl.customers = res.data.data.customers;
          },
          // on error
          (err) => {
              ctrl.err = err.data;
          }
      );
    };
    ctrl.getSuppliers = () => {
        SupplierService.getSuppliers().then(
            // on success
            (res) => {
                this.suppliers = res.data.data.suppliers;
            },
            // on error+
            (err) => {
                ctrl.err = err.data;
            }
        );
    };
    ctrl.getPayment = (id) => {
        this.paymentIsLoaded = false;
        const _onSuccess = (res) => {
            this.payment = res.data.data;
            this.payment.date = moment(new Date(res.data.data.date)).format('DD-MM-YYYY');
            if ($translate.use() === 'ar') {
                this.payment.date = moment(new Date(res.data.data.date)).format('YYYY-MM-DD');
            }
            $('#payment').modal('show');
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = () => {
            this.paymentIsLoaded = true;
        };
        PaymentService.getPayment(id)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    };
    ctrl.acceptPayment = (id) => {
        $('#payment').modal('hide');
        this.acceptPaymentIsFinished = false;
        const _onSuccess = (res) => {
            this.payment = res.data.data;
            this.payment.date = moment(new Date(res.data.data.date)).format('YYYY-MM-DD');
            ctrl.notify('component.record-payment.message.accept.success', 'success', 1000);
            $scope.$emit('acceptPayment', this.payment._id);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            ctrl.notify('component.record-payment.message.accept.failure', 'danger', 1000);
        };
        const _onFinal = () => {
            this.acceptPaymentIsFinished = true;
        };
        PaymentService.acceptPayment(id)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    };
    ctrl.rejectPayment = (id) => {
        $('#payment').modal('hide');
        this.rejectPaymentIsFinished = false;
        const _onSuccess = (res) => {
            this.payment = res.data.data;
            this.payment.date = moment(new Date(res.data.data.date)).format('YYYY-MM-DD');
            ctrl.notify('component.record-payment.message.reject.success', 'success', 1000);
            $scope.$emit('rejectPayment', this.payment._id);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            ctrl.notify('component.record-payment.message.reject.failure', 'danger', 1000);
        };
        const _onFinal = () => {
            this.rejectPaymentIsFinished = true;
        };
        PaymentService.rejectPayment(id)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    };
    ctrl.notify = (message, type, timeout) => {
        $translate(message).then((translation) => {
            $('body').pgNotification({
                style: 'bar',
                message: translation,
                position: 'top',
                timeout,
                type
            }).show();
        });
    };
    ctrl.close = () => {
        $('#payment').modal('hide');
    };
}
RecordPaymentCtrl.$inject = ['CustomerService', 'SupplierService', 'PaymentService', '$scope', '$translate', 'UserService'];

const RecordPaymentComponent = {
    bindings: {
        onSave: '&',
        supplierFlag: '<',
        customerFlag: '<',
        payment: '<',
        viewMode: '<',
        showActions: '<'
    },
    controller: RecordPaymentCtrl,
    controllerAs: '$ctrl',
    templateUrl: 'app/components/payment/payment-record.component.html'
};
export default RecordPaymentComponent;
