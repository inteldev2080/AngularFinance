import angular from 'angular';

function NotificationCtrl(RetryRequest, AppConstants, JwtService, $translate, $location) {
    const ctrl = this;
    ctrl.$translate = $translate;
    const retryRequest = RetryRequest;
    const request = {};
    request.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JwtService.get()}`
    };
    ctrl.$onInit = () => {
        ctrl.skip = 0;
        ctrl.notificationsCount = 0;
        ctrl.itemsPerPage = 5;
        ctrl.showNextBtn = false;
        ctrl.showPreviouseBtn = false;
        // ctrl.levels = ['success', 'warning', 'danger', 'info'];
        ctrl.getNotifications(ctrl.skip, ctrl.itemsPerPage);
    };
    ctrl.getNotifications = (skip, limit) => {
        request.method = 'GET';
        request.url = `${AppConstants.api}/notifications?skip=${skip}&limit=${limit}`;
        retryRequest(request).then(
            (res) => {
                ctrl.notifications = res.data.data.notifications || [];
                ctrl.notificationsCount = res.data.data.count;
                ctrl.notReadCount = res.data.data.notReadCount;
              /*  if (ctrl.notificationsCount > 0) {
                    ctrl.unReadNotifications = ctrl.getUnreadMessageCount();
                }*/
                if (ctrl.notificationsCount > ctrl.skip + ctrl.itemsPerPage) {
                    ctrl.showNextBtn = true;
                }
            },
            (err) => {
                ctrl.errors = err || [];
            }
        );
    };
    ctrl.markNotificationsAsRead = (notification) => {
        if (!notification.isRead) {
            request.method = 'PUT';
            request.url = `${AppConstants.api}/notifications/${notification._id}`;
            retryRequest(request).then(
               (res) => {
                   ctrl.getNotifications(ctrl.skip, ctrl.itemsPerPage);
               },
               (err) => {
                   ctrl.errors = err;
               }
           );
        }
    };
    ctrl.next = () => {
        ctrl.showPreviouseBtn = true;
        ctrl.skip += ctrl.itemsPerPage;
        if (ctrl.skip + ctrl.itemsPerPage >= ctrl.notificationsCount) {
            ctrl.showNextBtn = false;
        }
        ctrl.getNotifications(ctrl.skip, ctrl.itemsPerPage);
    };
    ctrl.previous = () => {
        ctrl.showNextBtn = true;
        ctrl.skip -= ctrl.itemsPerPage;
        if (ctrl.skip - ctrl.itemsPerPage < 0) {
            ctrl.showPreviouseBtn = false;
        }
        ctrl.getNotifications(ctrl.skip, ctrl.itemsPerPage);
    };
    ctrl.getUnreadMessageCount = () => {
        let count = 0;
        angular.forEach(ctrl.notifications, (item) => {
            count += item.isRead ? 0 : 1;
        });
        return count;
    };
}
NotificationCtrl.$inject = ['RetryRequest', 'AppConstants', 'JwtService', '$translate', '$location'];

const NotificationComponent = {
    bindings: {
    },
    controller: NotificationCtrl,
    controllerAs: '$ctrl',
    templateUrl: 'app/components/notification/notification.component.html',
};

export default NotificationComponent;

