import fs from 'fs';
import path from 'path';
// import async from 'async';
// import httpStatus from 'http-status';
// import Response from '../services/response.service';
// import FileExport from '../models/exportFile.model';
// import Order from '../models/order.model';
// import Supplier from '../models/supplier.model';
// import Transaction fro m '../models/transaction.model';
// import OrderProduct from '../models/orderProduct.model';

// const jsreportXlsx = require('jsreport');
const jsreport = require('jsreport-core')();
jsreport.use(require('jsreport-phantom-pdf')());
jsreport.use(require('jsreport-jsrender')());
jsreport.use(require('jsreport-xlsx')());
jsreport.use(require('jsreport-html-to-xlsx')());

// const moment = require('moment');

function exportReceiptFile(headerPath, bodyPath, dataObject, title, description, type, res) {
  if (type === 'pdf') {
    const htmlHeaderContent = fs.readFileSync(path.resolve(__dirname, '../../../' + headerPath), 'utf8');
    const htmlBodyContent = fs.readFileSync(path.resolve(__dirname, '../../../' + bodyPath), 'utf8');
    const total = dataObject.price + dataObject.VAT;
    jsreport.init().then(() => jsreport.render({
      template: {
        content: htmlBodyContent, // path.join("/path/sample.html")
        engine: 'jsrender',
        recipe: 'phantom-pdf',
        allowCode: true,
        phantom: {
          format: 'A4',
          margin: { top: '20px', left: '20px', right: '20px', bottom: '20px' },
          headerHeight: '300px',
          header: htmlHeaderContent
        },
        helpers: 'function totalProductPrice(price, quantity) { return Number(price * quantity).toFixed(2)};function toNumber(amount) { return Number(amount).toFixed(2)};function toTime(date) { var d = new Date(date);return d.toLocaleString(\'en-SA\', { timeZone: \'UTC\' })};',
      },
      data: {
        data: { dataObject, title, description, total },
        // count: 0,
        // title: 'تقرير المعاملات النقدية',
        // description: 'من: 10-11-2018 إلى: 16-03-2020'
      }
    }).then((resp) => {
      // write report buffer to a file
      // const fd = fs.openSync('report.pdf', 'w');
      fs.writeFileSync('report.pdf', resp.content);
      // res.download('report.pdf');
      res.send(resp.content);
      // fs.closeSync(fd);
      // fs.writeFile('report.pdf', resp.content);
      // const fileToSend = fs.readFileSync('report.pdf');
      // // res.send('report.pdf');
    })).catch((e) => {
      console.log(e);
    });
  }
}

function exportFile(headerPath, bodyPath, dataObject, title, description, type, res) {
  
  try {
    // const htmlHeaderContent = fs.readFileSync('report_template/transaction/pdf-transaction-report-header-arabic.html', 'utf8');
    // const htmlBodyContent = fs.readFileSync('report_template/transaction/pdf-transaction-report-body-arabic.html', 'utf8');
    if (type === 'pdf') {
      const htmlHeaderContent = fs.readFileSync(path.resolve(__dirname, '../../../' + headerPath), 'utf8');
      const htmlBodyContent = fs.readFileSync(path.resolve(__dirname, '../../../' + bodyPath), 'utf8');
      jsreport.init().then(() => {

        jsreport.render({
          template: {
            content: htmlBodyContent, // path.join("/path/sample.html")
            engine: 'jsrender',
            recipe: 'phantom-pdf',
            allowCode: true,
            phantom: {
              format: 'A4',
              margin: { top: '20px', left: '20px', right: '20px', bottom: '20px' },
              headerHeight: '300px',
              header: htmlHeaderContent
            },
            helpers: 'function toNumber(amount) { return Number(amount).toFixed(2)};function toTime(date) { var d = new Date(date);return d.toLocaleString(\'en-SA\', { timeZone: \'UTC\' })};',
          },
          data: {
            data: { ...dataObject, title },
            // count: 0,
            // title: 'تقرير المعاملات النقدية',
            // description: 'من: 10-11-2018 إلى: 16-03-2020'
            title,
            description
          }
        }).then((resp) => {
          // write report buffer to a file
          fs.writeFileSync(title+'.pdf', resp.content);
          res.set("Content-Disposition", "attachment;filename="+title+".pdf");
          res.setHeader('Content-Type', 'application/pdf');
          // res.download(title+'.pdf');
          
          res.send(resp.content);
          // const fileToSend = fs.readFileSync('report.pdf');
          // // res.send('report.pdf');
        });
      })
      
    } else {
      const htmlBodyContent = fs.readFileSync(path.resolve(__dirname, '../../../' + bodyPath), 'utf8');

      jsreport.init().then(() => jsreport.render({
        template: {
          content: htmlBodyContent, // path.join("/path/sample.html")
          engine: 'jsrender',
          recipe: 'html-to-xlsx',
          helpers: 'function toNumber(amount) { return Number(amount).toFixed(2)};function toTime(date) { var d = new Date(date);return d.toLocaleString(\'en-SA\', { timeZone: \'UTC\' })};',
        },
        data: {
          data: { ...dataObject, title },
          // count: 0,
          // title: 'تقرير المعاملات النقدية',
          // description: 'من: 10-11-2018 إلى: 16-03-2020'
          title,
          description
        }
      }).then((resp) => {
        // write report buffer to a file
        fs.writeFileSync('report.xls', resp.content);
        res.send(resp.content);
        // const fileToSend = fs.readFileSync('report.xls');
        // // res.send('report.pdf');
      })).catch((e) => {
        console.log(e);
      });
    }
  } catch (err) {
    console.log(err);
  }


}

function printInvoice(headerPath, bodyPath, dataObject, title, description, res) {
  const htmlBodyContent = fs.readFileSync(path.resolve(__dirname, '../../../' + bodyPath), 'utf8');
  jsreport.init().then(() => {
    jsreport.render({
      template: {
        content: htmlBodyContent, // path.join("/path/sample.html")
        engine: 'jsrender',
        recipe: 'phantom-pdf',
        helpers: 'function toNumber(amount) { return Number(amount).toFixed(2)};function toTime(date) { var d = new Date(date);return d.toLocaleString(\'en-SA\', { timeZone: \'UTC\' })};',
      },
      data: {
        data: dataObject
      }
    }).then((resp) => {
      // write report buffer to a file
      fs.writeFileSync('report.pdf', resp.content);
      res.send(resp.content);
      // const fileToSend = fs.readFileSync('report.pdf');
      // res.download('report.pdf');
      // // res.send('report.pdf');
    });
  }).catch((e) => {
    console.log(e);
  });
}

//
// function list(req, res) {
//   FileExport.find()
//     .then((files) => {
//       res.json(Response.success(files));
//     });
// }
// function create(req, res) {
//   const file = FileExport({
//     type: req.body.type,
//     template: {
//       arabic: {
//         title: req.body.arabicTitle,
//         body: req.body.arabicFile
//       },
//       english: {
//         title: req.body.englishTitle,
//         body: req.body.englishFile
//       },
//     },
//   });
//   file.save()
//     .then(savedFile => res.json(Response.success(savedFile)))
//     .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
// }
// function update(req, res) {
//   const file = req.file;
//   file.type = req.body.type;
//   file.template.arabic.title = req.body.arabicTitle;
//   file.template.arabic.body = req.body.arabicFile;
//   file.template.english.title = req.body.englishTitle;
//   file.template.english.body = req.body.englishFile;
//   file.save()
//     .then(savedFile => res.json(Response.success(savedFile)))
//     .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
// }
// function remove(req, res) {
//   const file = req.file;
//   file.remove()
//     .then(deletedFile => res.json(Response.success(deletedFile)))
//     .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
// }
// function get(req, res) {
//   const file = req.file;
//   res.json(Response.success(file));
// }
// function load(req, res, next, id) {
//   FileExport.findById(id)
//     .then((file) => {
//       if (file) {
//         req.file = file;
//         return next();
//       }
//       return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
//     })
//     .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
// }
// /**
//  * Helper Function
//  * Get supplier using the user.
//  * @property {string} userId - The id of the supplier user.
//  * @returns {Supplier}
//  */
// function getSupplierFromUser(userId, user, callback) {
//   Supplier.findOne()
//     .where('staff').in([userId])
//     .exec((err, supplier) => callback(err, supplier, user));
// }


export default {
  // exportFileXls,
  exportFile,
  printInvoice,
  exportReceiptFile
  // list,
  // create,
  // update,
  // get,
  // remove,
  // load
};
