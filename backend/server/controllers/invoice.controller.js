import async from 'async';
import httpStatus from 'http-status';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
import Response from '../services/response.service';
import Invoice from '../models/invoice.model';
import Payments from '../models/pendingPayment.model';
import Supplier from '../models/supplier.model';
import Customer from '../models/customer.model';
import Order from '../models/order.model';
import ExportService from './exportFileService';
import OrderProduct from '../models/orderProduct.model';

var QRCode = require('qrcode')
// const moment = require('moment-timezone');

function get(req, res) {
  const invoice = req.invoice;

  const transactionTotal = invoice.transactions.map(c => c.amount).reduce((sum, value) => sum + value, 0);
  const products = [];
  async.waterfall([
    function passParameter(callback) {
      let transIndex = 0;
      invoice.transactions.forEach((transactionObject) => {
        OrderProduct.find({ order: transactionObject.order })
          .populate({
            path: 'product',
            select: '_id englishName arabicName englishDescription arabicDescription unit',
            populate: {
              path: 'unit'
            }
          })
          .then((orderProducts) => {
            orderProducts.forEach((productObject) => {
              products.push(productObject);
              transIndex += 1;
              if (transIndex === invoice.transactions.length) {
                callback(null, products);
              }
            });
          });
      });
    }
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else
      if (req.query.export) {
        if (req.user.language === 'en') {
          ExportService.exportReceiptFile('report_template/main_header/english_header.html',
            'report_template/invoice/invoice-body-english.html', { invoice, products: result, transactionTotal },
            'Invoice', `${moment().tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
          // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
        } else {
          ExportService.exportReceiptFile('report_template/main_header/arabic_header.html',
            'report_template/invoice/invoice-body-arabic.html', { invoice, products: result, transactionTotal },
            'فاتورة', `${moment().tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
          // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
        }
      } else {
        res.json(Response.success({ invoice, products: result, transactionTotal }));
      }
  });
}

function list(req, res) {
  Invoice.find()
    .sort({
      createdAt: -1
    })
    .then((invoices) => {
      res.json(Response.success(invoices));
    });
}
function createInvoice(req, res){
  const supplierId = req.user._id;
  const orderId = req.params.orderId;
  Order.findById(orderId)
  .then((order)=> {
    const nextInvoiceId = moment().tz(appSettings.timeZone).format('x');
    const invoice = new Invoice({
      invoiceId: `${appSettings.invoicePrefix}${nextInvoiceId}`,
      supplier : supplierId,
      order : orderId,
      customer : order.customer,
      dueDate: moment().add(Number(appSettings.duePaymentDays), 'days').tz(appSettings.timeZone).format(appSettings.momentFormat),
      createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
      price : order.price,
      VAT : order.VAT
    });
     invoice.save(function(err,result){
      res.json(Response.success(result));
     });
  })
}
function getInvoices(req, res){
  const startDate = new Date(req.query.startDate.toString());
  const endDate = new Date(req.query.endDate.toString());
  const supplierInvoiceReport = {
    supplierId: '',
    numberOfInvoices: '',
    totalCredit: '',
    invoices: [],
    totalRevenue:0,
    avgDailyNumberOfInvoices: 0,
    avgDailyRevenue:0
  };
  let query = {
    createdAt: { $gte: startDate, $lte: endDate },
    $and: [{ supplier: req.user._id }]
  };
  
  async.waterfall([
    function passParameter(callback) {
      callback(null, req, supplierInvoiceReport,
        req.query.skip, req.query.limit);
    },
    getNumberInvoices,
    function getRevenue(supplierInvoiceReport, callback) {
      const revenue = supplierInvoiceReport.invoices
        .reduce((sum, row) => sum + row.price, 0);
        supplierInvoiceReport.totalRevenue = revenue;
      callback(null, supplierInvoiceReport);
    },
    function getAvgNumberInvoiceAndRevenue(supplierInvoiceReport, callback){
      const oneday = 1000 * 60 * 60 * 24;
      // Convert both dates to milliseconds
      const date1ms = startDate.getTime();
      const date2ms = endDate.getTime();
      // Calculate the difference in milliseconds
      const differencems = date2ms - date1ms;
      // Convert back to days and return
      const diff = Math.round(differencems / oneday);
      Invoice.aggregate([
        {
          $match: query
        },{
          $lookup:
            {
              from: "orders",
              localField: "branch",
              foreignField: "_id",
              as: "orders"
            }
       },{
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
              year: { $year: '$createdAt' }
            },
            count: { $sum: 1 },
            total: { $sum: '$price' }
          }
        }
      ], (err, invoices) => {
        if (err) {
          res.json(err);
        } else {
          const sumOrders = invoices
            .map(m => m.count)
            .reduce((sum, value) => sum + value, 0);
          const sumRevenue = invoices
            .map(m => m.total)
            .reduce((sum, value) => sum + value, 0);
            supplierInvoiceReport.avgDailyNumberOfInvoices = sumOrders / diff;
            supplierInvoiceReport.avgDailyRevenue = sumRevenue / diff;
          callback(null, supplierInvoiceReport);
        }
      });
    }
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else if (req.query.export) {
      if (req.user.language === 'en') {
        ExportService.exportFile(`report_template/invoiceReport/invoice-report-header-english.html`,
          `report_template/invoiceReport/invoice-report-body-english.html`, result,
          'Invoice Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res
          );
        // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
      } else {
        ExportService.exportFile(`report_template/invoiceReport/invoice-report-header-arabic.html`,
          `report_template/invoiceReport/invoice-report-body-arabic.html`, result,
          'تقرير المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
        // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
      }
    } else {
      res.json(Response.success(result));
    }
  });
    
}

function getNumberInvoices(req, supplierInvoiceReport,skip, limit, callback){

  const startDate = new Date(req.query.startDate.toString());
  const endDate = new Date(req.query.endDate.toString());
  endDate.setDate(endDate.getDate() + 1);

  let query = {
    createdAt: { $gte: startDate, $lte: endDate },
    $and: [{ supplier: req.user._id }]
  };
  
  let branchMatch = {};
  if(req.query.branchId !== "All"){
    branchMatch = {branch : req.query.branchId};
  }else{
    branchMatch = {};
  }
  
  if(req.query.customerId !== "All"){
    Customer.findById(req.query.customerId).then((customer)=>{
      Invoice.find(query)
      .populate('supplier')
      .populate('customer')
      .populate({
          path: 'order',
          match: branchMatch
      })
      //.skip(Number(skip))
      //.limit(Number(limit))
      .then((acceptedInvoices) => {
        if(acceptedInvoices){
          var invoices = [];
          acceptedInvoices.forEach((acceptedInvoicesObj) => {
            if((acceptedInvoicesObj.customer.customer == req.query.customerId || acceptedInvoicesObj.customer._id == req.query.customerId) && acceptedInvoicesObj.order){
              let invoice = {};
              invoice = {
                invoice_id: acceptedInvoicesObj._id,
                invoiceId: acceptedInvoicesObj.invoiceId,
                supplier: acceptedInvoicesObj.supplier,
                // customer: acceptedInvoicesObj.customer,
                customer: customer,
                order : acceptedInvoicesObj.order,
                isPaid: acceptedInvoicesObj.isPaid,
                total: acceptedInvoicesObj.total,
                close: acceptedInvoicesObj.close,
                price : acceptedInvoicesObj.price,
                VAT: acceptedInvoicesObj.VAT,
                createdAt: acceptedInvoicesObj.createdAt
              };
              invoices.push(invoice);
            }
          });
          for (var i = skip; i < skip + limit; i ++){
            if(invoices[i]){
              supplierInvoiceReport.invoices.push(invoices[i]);
            }
            
          }
          supplierInvoiceReport.numberOfInvoices = invoices.length;
          callback(null, supplierInvoiceReport);
        }else{
          supplierInvoiceReport.invoices = [];
          supplierInvoiceReport.numberOfInvoices = 0;
          callback(null, supplierInvoiceReport);
        }
      });
    })
  }else{
    Invoice.find(query)
      .populate('supplier')
      .populate({
          path: 'order',
          match: branchMatch
      })
      //.skip(Number(skip))
      // .limit(Number(limit))
      .then((acceptedInvoices) => {
        if(acceptedInvoices){
           Customer.aggregate(
            {
              $lookup: {
                from: 'customers',
                localField: '_id',
                foreignField: 'customer',
                as: 'Staffs'
              }
              
            },
            {$match : {type: 'Customer'}}
            
          ).then((customers)=>{
            var invoices = [];
            customers.forEach(customer => {
              acceptedInvoices.forEach(acceptedInvoicesObj => {
                if(customer._id.toString() == acceptedInvoicesObj.customer.toString()){
                  let invoice = {};
                  invoice = {
                    invoice_id: acceptedInvoicesObj._id,
                    invoiceId: acceptedInvoicesObj.invoiceId,
                    supplier: acceptedInvoicesObj.supplier,
                    customer: customer,
                    order : acceptedInvoicesObj.order,
                    isPaid: acceptedInvoicesObj.isPaid,
                    total: acceptedInvoicesObj.total,
                    close: acceptedInvoicesObj.close,
                    price : acceptedInvoicesObj.price,
                    VAT: acceptedInvoicesObj.VAT,
                    createdAt: acceptedInvoicesObj.createdAt
                  };
                  invoices.push(invoice);
                }else{
                  customer.Staffs.forEach(staff => {
                    if(staff._id.toString() == acceptedInvoicesObj.customer.toString()){
                      let invoice = {};
                      invoice = {
                        invoice_id: acceptedInvoicesObj._id,
                        invoiceId: acceptedInvoicesObj.invoiceId,
                        supplier: acceptedInvoicesObj.supplier,
                        customer: customer,
                        order : acceptedInvoicesObj.order,
                        isPaid: acceptedInvoicesObj.isPaid,
                        total: acceptedInvoicesObj.total,
                        close: acceptedInvoicesObj.close,
                        price : acceptedInvoicesObj.price,
                        VAT: acceptedInvoicesObj.VAT,
                        createdAt: acceptedInvoicesObj.createdAt
                      };
                      invoices.push(invoice);
                    }
                  });
                }
              });
            });
            for (var i = skip; i < skip + limit; i ++){
              if(invoices[i]){
                supplierInvoiceReport.invoices.push(invoices[i]);
              }
              
            }
            supplierInvoiceReport.numberOfInvoices = invoices.length;
            callback(null, supplierInvoiceReport);
          })         
        }else{
          supplierInvoiceReport.invoices = [];
          supplierInvoiceReport.numberOfInvoices = 0;
          callback(null, supplierInvoiceReport);
        }
      });
  }
}
function create(req, res) {
  if (req.user.type === 'Admin') {
    Payments.find({ $and: [{ status: 'Pending' }, { customer: null }, { supplier: req.query.supplierId }] })
      .populate({
        path: 'supplier',
        select: '_id representativeName'
      })
      .then((payments) => {
        const invoiceObject = new Invoice({
          payments,
          supplier: payments[0].supplier,
          dueDate: moment().add(Number(appSettings.duePaymentDays), 'days').tz(appSettings.timeZone).format(appSettings.momentFormat),
          createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
        });
        invoiceObject.save()
          .then((invoiceSaved) => {
            payments.forEach((paymentObj) => {
              paymentObj.invoice = invoiceSaved._id;
              paymentObj.save();
            });
            res.json(Response.success(invoiceSaved));
          })
          .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
      });
  }
  if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ], (err, result) => {
      Payments.find({ $and: [{ status: 'Pending' }, { supplier: result }, { customer: req.query.customerId }] })
        .populate({
          path: 'supplier',
          select: '_id representativeName'
        })
        .populate({
          path: 'customer',
          select: '_id representativeName'
        })
        .then((payments) => {
          Customer.findById(req.query.customerId)
            .select('_id representativeName')
            .then((customer) => {
              const invoiceObject = new Invoice({
                payments,
                supplier: result,
                customer,
                dueDate: moment().add(Number(appSettings.duePaymentDays), 'days').tz(appSettings.timeZone).format(appSettings.momentFormat),
                createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
              });
              invoiceObject.save()
                .then((invoiceSaved) => {
                  payments.forEach((paymentObj) => {
                    paymentObj.invoice = invoiceSaved._id;
                    paymentObj.save();
                  });
                  res.json(Response.success(invoiceSaved));
                })
                .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
            });
        });
    });
  }
}
function getInvoice(req, res){

  const QRUrl = "http://dev.supplieson.com/api/invoices/getInvoice?";
  
  Invoice.findOne({_id : req.query.id})
  .populate('customer')
  .populate('order')
  .then((invoiceDetail) => {
    var order = invoiceDetail.order;
    new Promise((resolve, reject) => {
      OrderProduct.find({order: order._id}).populate('product').then((product) => {
        order['_doc']['orderProduct'] = product;
        resolve(invoiceDetail, order);
      });
    }).then((invoiceDetail, order)=>{
      Customer.findById(invoiceDetail.customer.customer).then((customer)=>{
        invoiceDetail.customer = customer;
        Supplier.findOne()
          .where('staff').in([invoiceDetail.supplier])
          .then((supplier) => {
            invoiceDetail.supplier = supplier;
            
            if(req.query.export){
              QRCode.toDataURL(QRUrl + "id="+invoiceDetail._doc._id+"&export=pdf", function (err, url) {
                invoiceDetail._doc.image = url;
                if(req.user){
                  if (req.user.language === 'en') {
                    ExportService.exportFile(`report_template/invoice/invoice-header-english.html`,
                      `report_template/invoice/invoice-body-english.html`, invoiceDetail._doc,
                      invoiceDetail._doc.invoiceId, ``, req.query.export, res
                      );
                    // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                  } else {
                    ExportService.exportFile(`report_template/invoice/invoice-header-arabic.html`,
                      `report_template/invoice/invoice-body-arabic.html`, invoiceDetail._doc,
                      'تقرير المعاملات النقدية', `من:`, req.query.export, res);
                    // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                  }
                }else{
                  ExportService.exportFile(`report_template/invoice/invoice-header-english.html`,
                      `report_template/invoice/invoice-body-english.html`, invoiceDetail._doc,
                      invoiceDetail._doc.invoiceId, ``, req.query.export, res
                  );
                  // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                }
              })
            }else{
              QRCode.toDataURL(QRUrl +"id="+invoiceDetail._doc._id+"&export=pdf", function (err, url) {
                invoiceDetail._doc.image = url;
                res.json(Response.success(invoiceDetail));
              })
                  
            }
          });
      })
    });
  });
}

function load(req, res, next, id) {
  Invoice.findById(id)
    .populate({
      path: 'supplier',
      select: '_id representativeName staff',
      populate: {
        path: 'staff',
        select: '_id email mobileNumber firstName lastName address'
      }
    })
    .populate({
      path: 'customer',
      select: '_id representativeName user',
      populate: {
        path: 'user',
        select: '_id email mobileNumber firstName lastName address'
      }
    })
    .populate({
      path: 'transactions',
      populate: {
        path: 'order'
      }
    })
    .then((invoice) => {
      if (invoice) {
        req.invoice = invoice;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Helper Function
 * Get supplier using the user.
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function getSupplierFromUser(userId, callback) {
  Supplier.findOne()
    .select('_id representativeName')
    .where('staff').in([userId])
    .exec((err, supplier) => callback(err, supplier));
}

export default {
  load,
  get,
  list,
  create,
  getInvoices,
  createInvoice,
  getInvoice
};
