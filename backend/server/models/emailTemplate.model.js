const mongoose = require('mongoose');

const TYPE = {
  NEWUSER: 'NEWUSER',
  SPECIALPRICES: 'SPECIALPRICES',
  RESETPASSWORD: 'RESETPASSWORD',
  FORGETPASSWORD: 'FORGETPASSWORD',
  INVITECUSTOMER: 'INVITECUSTOMER',
  INVITESTAFF: 'INVITESTAFF',
  INVITESUPPLIER: 'INVITESUPPLIER',
  BLOCK: 'BLOCK',
  UNBLOCK: 'UNBLOCK',
  PAYMENTPASTDUE: 'PAYMENTPASTDUE',
  REMOVEUSER: 'REMOVEUSER',
  UPDATEUSER: 'UPDATEUSER',
  CHECKOUTCART: 'CHECKOUTCART',
  DECLAREPAYMENT: 'DECLAREPAYMENT',
  ADDPAYMENT: 'ADDPAYMENT',
  APPROVEUSER: 'APPROVEUSER',
  NEWORDER: 'NEWORDER',
  ORDERSTATUS: 'ORDERSTATUS',
  ORDERSTATUSREJECTION: 'ORDERSTATUSREJECTION',
  ORDERREVIEW: 'ORDERREVIEW',
  NEWINVOICE: 'NEWINVOICE',
  PAYMENTSTATUS: 'PAYMENTSTATUS',
  CREDITLIMITSTATUS: 'CREDITLIMITSTATUS',
  CONTACTUS: 'CONTACTUS',
  FEEDBACK: 'FEEDBACK',
  GENERALMESSAGE: 'GENERALMESSAGE',
  RESETUSERPASSWORD: 'RESETUSERPASSWORD',
  RECURRINGORDERREMINDER: 'RECURRINGORDERREMINDER',
  REQUESTSPECIALPRICE: 'REQUESTSPECIALPRICE',
  EMAILREPLY: 'EMAILREPLY',
  INVITATION: 'INVITATION',
  NEWSUPPLIERORDER: 'NEWSUPPLIERORDER'
};

const KEYS = {
  recipientName: 'recipientName',
  orderId: 'orderId',
  orderPageUrl: 'orderPageUrl',
  loginPageUrl: 'loginPageUrl',
  representativeName: 'representativeName',
  userName: 'userName',
  password: 'password',
  landingPageUrl: 'landingPageUrl',
  productName: 'productName',
  resetLink: 'resetLink',
  resetFullLink: 'resetFullLink',
  invoiceId: 'invoiceId',
  month: 'month',
  dueDate: 'dueDate',
  paymentId: 'paymentId',
  amount: 'amount',
  feedbackPageLink: 'feedbackPageLink',
  orderReviewLink: 'orderReviewLink',
  prevStatus: 'prevStatus',
  currentStatus: 'currentStatus',
  newPassword: 'newPassword',
  rejectionReason: 'rejectionReason',
  body: 'body',
  supplier: 'supplier'
};

const emailTemplateSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      TYPE.NEWUSER, TYPE.SPECIALPRICES, TYPE.RESETPASSWORD,
      TYPE.FORGETPASSWORD, TYPE.INVITECUSTOMER, TYPE.INVITESTAFF, TYPE.BLOCK,
      TYPE.ORDERSTATUS, TYPE.ORDERREVIEW, TYPE.NEWINVOICE, TYPE.PAYMENTSTATUS,
      TYPE.CREDITLIMITSTATUS, TYPE.CONTACTUS, TYPE.FEEDBACK, TYPE.GENERALMESSAGE, TYPE.UNBLOCK,
      TYPE.PAYMENTPASTDUE, TYPE.REMOVEUSER, TYPE.UPDATEUSER, TYPE.CHECKOUTCART,
      TYPE.DECLAREPAYMENT, TYPE.ADDPAYMENT, TYPE.APPROVEUSER,
      TYPE.NEWORDER, TYPE.RESETUSERPASSWORD, TYPE.ORDERSTATUSREJECTION,
      TYPE.INVITESUPPLIER, TYPE.EMAILREPLY, TYPE.RECURRINGORDERREMINDER, TYPE.REQUESTSPECIALPRICE,
      TYPE.INVITATION, TYPE.NEWSUPPLIERORDER
    ],
  },
  key: {
    type: [String],
    required: true
  },
  template: {
    ar: {
      title: {
        type: String,
        required: true
      },
      body: {
        type: String,
        required: true
      }
    },
    en: {
      title: {
        type: String,
        required: true
      },
      body: {
        type: String,
        required: true
      }
    }
  },
  original_template: {
    ar: {
      title: {
        type: String,
        required: false
      },
      body: {
        type: String,
        required: false
      }
    },
    en: {
      title: {
        type: String,
        required: false
      },
      body: {
        type: String,
        required: false
      }
    }
  }

}, { timestamps: true });

// emailTemplateSchema.getTemplateByType
//   = function (templateType) { // eslint-disable-line func-names
//     return this.findOne({ type: templateType });
//   };


/**
 * @typedef Cart
 */
export default mongoose.model('EmailTemplate', emailTemplateSchema);
// export default mongoose.model('EmailTemplate', emailTemplateSchema);
