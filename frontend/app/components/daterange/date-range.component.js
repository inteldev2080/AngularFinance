import moment from 'moment';

function DateRangeCtrl($scope, $translate) {
    const ctrl = this;
    ctrl.$onInit = () => {
        moment.locale('en');
        $('#datepicker-range').datepicker({
            format: 'yyyy-mm-dd',
            language: 'ar'
        });
        $('#datepicker-range #startDate').datepicker('setDate', ctrl.startDate);
        $('#datepicker-range #endDate').datepicker('setDate', ctrl.endDate);
        $('#datepicker-range #endDate').datepicker()
            .on('changeDate', (e) => {
                ctrl.onChange();
            });
        $('#datepicker-range #startDate').datepicker()
            .on('changeDate', (e) => {
                ctrl.onChange();
            });
    };
}
DateRangeCtrl.$inject = ['$scope', '$translate'];

const DateRangeComponent = {
    bindings: {
        startDate: '=',
        endDate: '=',
        onChange: '&'
    },
    controller: DateRangeCtrl,
    controllerAs: '$ctrl',
    templateUrl: 'app/components/daterange/date-range.component.html'
};
export default DateRangeComponent;
