import config from './config/config';

const appSettings = {
  Month: {
    January: {
      en: 'January',
      ar: 'يناير'
    },
    February: {
      en: 'February',
      ar: 'فبراير'
    },
    March: {
      en: 'March',
      ar: 'مارس'
    },
    April: {
      en: 'April',
      ar: 'ابريل'
    },
    May: {
      en: 'May',
      ar: 'مايو'
    },
    June: {
      en: 'June',
      ar: 'يونيه'
    },
    July: {
      en: 'July',
      ar: 'يوليو'
    },
    August: {
      en: 'August',
      ar: 'اغسطس'
    },
    September: {
      en: 'September',
      ar: 'سبتمبر'
    },
    October: {
      en: 'October',
      ar: 'اكتوبر'
    },
    November: {
      en: 'November',
      ar: 'نوفمبر'
    },
    December: {
      en: 'December',
      ar: 'ديسمبر'
    }

  },
  Status: {
    Pending: {
      en: 'Pending',
      ar: 'قيد الانتظار'
    },
    Rejected: {
      en: 'Rejected',
      ar: 'مرفوض'
    },
    Canceled: {
      en: 'Canceled',
      ar: 'ملغي'
    },
    CanceledByCustomer: {
      en: 'CanceledByCustomer',
      ar: 'ملغي بواسطة العميل'
    },
    Accepted: {
      en: 'Accepted',
      ar: 'مقبول'
    },
    FailedToDeliver: {
      en: 'FailedToDeliver',
      ar: 'فشل التوصيل'
    },
    ReadyForDelivery: {
      en: 'ReadyForDelivery',
      ar: 'جاهز للتوصيل'
    },
    OutForDelivery: {
      en: 'OutForDelivery',
      ar: 'قيد التوصيل'
    },
    Delivered: {
      en: 'Delivered',
      ar: 'تم التوصيل'
    },
    Approved: {
      en: 'Approved',
      ar: 'تم القبول'
    }
  },
  Notifications: {
    Admin: {
      newPaymentsClaim: {
        en: 'You have received new payment claim to approve',
        ar: 'لقد تلقيت طلب تأكيد ايداع جديد للموافقة',
        actionUrl: 'app.admin.supplier.payment',
        url: '/admin/supplier/payments'
      },
      newSupplierRequest: {
        en: 'You have request to approve supplier',
        ar: 'لديك طلب لاعتماد المورد',
        actionUrl: 'app.admin.supplier.detail',
        url: '/admin/supplier/detail/:supplierId'
      },
      updateStaffAccount: {
        en: 'Your account information has been updated',
        ar: 'لقد تم تحديث بيانات حسابك الشخصي',
        actionUrl: 'app.admin.account.user',
        url: '/admin/account/user'
      }
    },
    Supplier: {
      newPaymentsClaim: {
        en: 'You have received new payment claim to approve',
        ar: 'لقد تلقيت طلب تأكيد ايداع جديد للموافقة',
        actionUrl: 'app.supplier.customer.detail',
        url: '/supplier/customer/details/:customerId'
      },
      newOrder: {
        en: 'You have received new order to take in action with',
        ar: 'لقد تلقيت طلبًا جديدًا لاتخاذ إجراء بشأنه',
        actionUrl: 'app.supplier.order.view.details',
        url: '/supplier/orders/view/details/:orderId'
      },
      paymentStatus: {
        en: 'Your payment changed status from {{currentStatus}} to {{nextStatus}}',
        ar: 'تم تغيير حالة دفعتك من {{currentStatus}} إلى {{nextStatus}}',
        actionUrl: 'app.supplier.account.payments',
        url: '/supplier/account/payments'
      },
      relationUpdate: {
        en: 'Your credit information has been updated',
        ar: 'تم تحديث معلومات الائتمان الخاصة بك',
        actionUrl: 'app.supplier.account.payments',
        url: '/supplier/account/payments'
      },
      newInvoice: {
        en: 'Your monthly invoice has been issued',
        ar: 'لقد تم إصدار فاتورتك الشهرية',
        actionUrl: 'app.supplier.account.payments',
        url: '/supplier/account/payments'
      },
      newOrderReview: {
        en: 'You have a review on an order',
        ar: 'لديك تقييم على طلب خاص بك',
        actionUrl: 'app.supplier.order.view.details',
        url: '/supplier/orders/view/details/:orderId'
      },
      updateStaffAccount: {
        en: 'Your account information has been updated',
        ar: 'لقد تم تحديث بيانات حسابك الشخصي',
        actionUrl: 'app.supplier.profile',
        url: '/supplier/profile'
      },
      orderStatus: {
        en: 'You order has changed status from {{currentStatus}} to {{nextStatus}}',
        ar: 'تم تغيير حالة طلبك من {{currentStatus}} إلى {{nextStatus}}',
        actionUrl: 'app.customer.orders.detail',
        url: '/customer/order/normalOrder/:orderId'
      },
      specialPriceRequest: {
        en: 'You have a request for special price',
        ar: 'لديك طلب سعر خاص لمنتج',
        actionUrl: 'app.supplier.product.detail',
        url: '/supplier/product/view/:productId'
      }
    },
    Customer: {
      newRecurringOrder: {
        en: 'You recurred order has been ordered successfully',
        ar: 'تم تنفيذ طلبك وهو قيد الانتظار الان',
        actionUrl: 'app.customer.orders.detail',
        url: '/customer/order/recurOrder/:orderId'
      },
      orderStatus: {
        en: 'You order has changed status from {{currentStatus}} to {{nextStatus}}',
        ar: 'تم تغيير حالة طلبك من {{currentStatus}} إلى {{nextStatus}}',
        actionUrl: 'app.customer.orders.detail',
        url: '/customer/order/normalOrder/:orderId'
      },
      paymentStatus: {
        en: 'Your payment changed status from {{currentStatus}} to {{nextStatus}}',
        ar: 'تم تغيير حالة دفعتك من {{currentStatus}} إلى {{nextStatus}}',
        actionUrl: 'app.customer.payments.list.suppliers',
        url: '/customer/payments/supplier/:supplierId'
      },
      inviteCustomer: {
        en: 'You have been invited to join {{representativeName}}',
        ar: 'لقد تم دعوتك للانضمام الى {{representativeName}}',
        actionUrl: 'app.supplier.products',
        url: '/customer/product/category/'
      },
      relationUpdate: {
        en: 'Your credit information has been updated',
        ar: 'تم تحديث معلومات الائتمان الخاصة بك',
        actionUrl: 'app.customer.payments.list.suppliers',
        url: '/customer/payments/supplier/:supplierId'
      },
      newInvoice: {
        en: 'Your monthly invoice has been issued',
        ar: 'لقد تم إصدار فاتورتك الشهرية',
        actionUrl: 'app.customer.payments.list.suppliers',
        url: '/customer/payments/supplier/:supplierId'
      },
      productSpecialPrice: {
        en: 'Check our offers and special prices on products',
        ar: 'تحقق من عروضنا وأسعار خاصة على المنتجات',
        actionUrl: 'app.customer.payments.list.suppliers',
        url: '/customer/payments/supplier/:supplierId'
      }
    }
  },
  feeCap: 25,
  feePercentage: 0.1,
  VAT: 1.15,
  VATPercent: 0.15,
  supplierAdminPercent: 0,
  mainUrl: (config.env === 'production' ? 'https://supplieson.com' : 'http://dev.supplieson.com'),
  imagesUrl: (config.env === 'production' ? 'https://supplieson.com/images/' : 'http://dev.supplieson.com/images/'),
  fileUploadUrl: (config.env === 'production' ? 'https://supplieson.com/api/upload/image/' : 'http://dev.supplieson.com/api/upload/image/'),
  momentFormat: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
  cronSwitch: true,
  bugsnagSwitch: false,
  emailSwitch: true,
  smsSwitch: true,
  specialPriceSwitch: false,
  customerSpecialPricesSwitch: true,
  duePaymentDays: 7,
  superAdmin: 'khaleel@indielabs.sa',
  suppliesOnEmail: 'contact@indielabs.sa',
  timeZone: 'Asia/Riyadh',
  maxImageSize: 12000000,
  systemTitle: 'SuppliesOn.com',
  orderPrefix: 'SUPOn-',
  transactionPrefix: 'SUPTr-',
  paymentPrefix: 'SUPay-',
  invoicePrefix: 'SUPIv-',
  orderIdInit: 120000000,
  transactionSUPCUSTIdInit: 130000001,
  transactionSUPIdInit: 130000002,
  paymentIdInit: 140000001,
  invoiceIdInit: 150000000,
  dateExpireValidation: 1825
};

module.exports = appSettings;
