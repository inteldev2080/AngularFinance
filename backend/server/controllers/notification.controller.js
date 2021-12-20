import httpStatus from 'http-status';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
import Response from '../services/response.service';
import Notification from '../models/notification.model';

function list(req, res) {
  Notification.find({ user: req.user })
    .then((notifications) => {
      const notificationArrNotRead = notifications.filter(c => c.isRead === false);
      const notificationsArr = notificationArrNotRead.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : ((a.createdAt > b.createdAt) ? -1 : 0)); // eslint-disable-line no-nested-ternary
      const notificationResultArr = notificationsArr.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > notificationsArr.length ? (notificationsArr.length)
        : (Number(req.query.limit) + Number(req.query.skip))));
      const resultObject = {
        notifications: notificationResultArr,
        count: notifications.length,
        notReadCount: notificationArrNotRead.length
      };
      res.json(Response.success(resultObject));
    });
}
function update(req, res) {
  const notification = req.notification;
  if (notification.user.toString() === req.user._id.toString()) {
    notification.isRead = true;
    notification.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
    notification.save()
      .then(savedNotification => res.json(Response.success(savedNotification)))
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else {
    res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
  }
}
function get(req, res) {
  const notification = req.notification;
  res.json(Response.success(notification));
}
function load(req, res, next, id) {
  Notification.findById(id)
    .then((notification) => {
      if (notification) {
        req.notification = notification;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}
function createNotification(type, notificationObject, currentStatus,
                            nextStatus, representativeName, stateParams) {
  const notification = new Notification({
    reference: {
      type,
      refObjectId: notificationObject.refObjectId
    },
    level: notificationObject.level,
    user: notificationObject.user,
    actionTitle: {
      ar: '',
      en: '',
      actionUrl: ''
    },
    url: '',
    stateParams: notificationObject.stateParams,
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
    updatedAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  });
  const user = appSettings.Notifications[notificationObject.userType];
  const key = user[notificationObject.key];
  const findCurrent = '{{currentStatus}}';
  const findNext = '{{nextStatus}}';
  const findRepresentativeName = '{{representativeName}}';
  const arLanguage = 'ar';
  const enLanguage = 'en';
  const actionUrl = 'actionUrl';
  const routeUrl = 'url';
  let messageAr = key[arLanguage];
  let messageEn = key[enLanguage];
  let url = key[routeUrl];
  if (currentStatus && nextStatus) {
    messageAr = messageAr.replace(findCurrent, appSettings.Status[currentStatus].ar);
    messageAr = messageAr.replace(findNext, appSettings.Status[nextStatus].ar);
    messageEn = messageEn.replace(findCurrent, appSettings.Status[currentStatus].en);
    messageEn = messageEn.replace(findNext, appSettings.Status[nextStatus].en);
  }
  if (representativeName) {
    messageAr = messageAr.replace(findRepresentativeName, representativeName);
    messageAr = messageAr.replace(findRepresentativeName, representativeName);
    messageEn = messageEn.replace(findRepresentativeName, representativeName);
    messageEn = messageEn.replace(findRepresentativeName, representativeName);
  }
  notification.actionTitle.ar = messageAr;
  notification.actionTitle.en = messageEn;
  notification.actionTitle.actionUrl = key[actionUrl];
  switch (notification.stateParams) {
    case 'order':
      url = url.replace(':orderId', stateParams);
      notification.url = `${appSettings.mainUrl}${url}`;
      break;
    case 'payment':
      url = url.replace(':paymentId', stateParams);
      notification.url = `${appSettings.mainUrl}${url}`;
      break;
    case 'invoice':
      url = url.replace(':invoiceId', stateParams);
      notification.url = `${appSettings.mainUrl}${url}`;
      break;
    case 'customer':
      url = url.replace(':customerId', stateParams);
      notification.url = `${appSettings.mainUrl}${url}`;
      break;
    case 'supplier':
      url = url.replace(':supplierId', stateParams);
      notification.url = `${appSettings.mainUrl}${url}`;
      break;
    case 'product':
      url = url.replace(':productId', stateParams);
      notification.url = `${appSettings.mainUrl}${url}`;
      break;
    case 'user':
      notification.url = `${appSettings.mainUrl}${url}`;
      break;
    default: break;
  }

  notification.save(savedNotification => console.log(Response.success(savedNotification)))
    .catch(e => console.log('Error:', e));
}

export default {
  list,
  update,
  get,
  createNotification,
  load
};
