import moment from 'moment';

export default class NewOrdersCtrl {
    constructor(OrderService, $translate, $stateParams, SystemService) {
        this._OrderService = OrderService;
        this._$translate = $translate;
        this.ordersStatus = 'Pending';
        this.$stateParams = $stateParams;
        this._SystemService = SystemService;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        moment.locale('en');
        this.query = {
            skip: 0,
            limit: 15,
            startDate: moment()
                .subtract(1, 'months')
                .format('YYYY-MM-DD'),
            endDate: moment()
                .add(1, 'day')
                .format('YYYY-MM-DD')
        };

        this.date = moment().format('dddd, MMM DD');
        $('#daterangepicker')
            .daterangepicker({
                timePicker: true,
                timePickerIncrement: 30,
                format: 'YYYY-MM-DD',
                startDate: moment()
                    .subtract(1, 'months')
                    .format('YYYY-MM-DD'),
                endDate: moment()
                    .add(1, 'day')
                    .format('YYYY-MM-DD')
            }, (start, end, label) => {
            });
        $('#daterangepicker')
            .on('apply.daterangepicker', (ev, picker) => {
                this.query.startDate = picker.startDate.format('YYYY-MM-DD');
                this.query.endDate = picker.endDate.format('YYYY-MM-DD');
                this.getNewOrders(this.query);
            });
        this.getNewOrders(this.query);
        this.ordersCurrentPage = 1;
        this.cityList = [{ _id: 'All', englishName: 'All', arabicName: 'All' }];
        this.citySelect = null;
        this.getSystemCities();
    }

    getNewOrders(query) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.orderList = res.data.data;
                this.ordersTotalPages = Math.ceil(
                    this.orderList.count / this.query.limit
                );
            }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = (err) => {
            this.ordersIsLoaded = true;
        };
        this._OrderService.getNewOrders(query, this.$stateParams.productId).then(_onSuccess, _onError).finally(_onFinal);
    }

    setOrdersCurrentPage(pageNumber) {
        this.ordersCurrentPage = pageNumber;
        this.query.skip = (pageNumber - 1) * this.query.limit;
        this.getNewOrders(this.query);
    }

    getSystemCities() {
        const _onSuccess = (res) => {
            this.cityList = [...this.cityList, ...res.data.data];
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
            }
        };
        const _onFinal = (err) => {

        };
        this._SystemService.getSystemCities()
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    onChangeCity() {
        this.currentPage = 1;
        this.query.skip = 0;
        if (this.citySelect._id == 'All') {
            this.query.city = null;
        } else {
            this.query.city = this.citySelect._id;
        }

        this.getNewOrders(this.query);
    }
}
NewOrdersCtrl.$inject = ['OrderService', '$translate', '$stateParams', 'SystemService'];
