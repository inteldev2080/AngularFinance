import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';
import Supplier from '../../models/supplier.model';
import Customer from '../../models/customer.model';

const debug = require('debug')('app:transaction.test');

chai.config.includeStack = true;

describe('Transactions', () => {
  describe('# POST /api/transactions/declare - [Supplier/Admin] declare transaction.', () => {
    let token = null;
    before((done) => {
      request(app)
        .post('/api/auth/login')
        .send({
          username: 'ahmed@indielabs.sa',
          password: 'asd12345'
        })
        .expect(httpStatus.OK)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });
    it('should declare new transaction 1- [Cash]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 3000,
          paymentMethod: 'Cash',
          recipientName: 'Admin',
          date: '2018-01-01'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 3000,
          paymentMethod: 'Bank',
          transactionId: '123456798',
          accountNumber: '987654321',
          accountName: 'Mohamed',
          date: '2018-01-01'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 3000,
          paymentMethod: 'Cheque',
          recipientName: 'Admin',
          chequeNumber: '123456789',
          date: '2018-01-01'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });

    it('should declare new transaction 2- [Cash]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 4000,
          paymentMethod: 'Cash',
          recipientName: 'Admin',
          date: '2018-01-02'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 4000,
          paymentMethod: 'Bank',
          transactionId: '123456797',
          accountNumber: '987654321',
          accountName: 'Mohamed',
          date: '2018-01-02'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 4000,
          paymentMethod: 'Cheque',
          recipientName: 'Admin',
          chequeNumber: '123456788',
          date: '2018-01-02'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });

    it('should declare new transaction 3- [Cash]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 5000,
          paymentMethod: 'Cash',
          recipientName: 'Admin',
          date: '2018-01-03'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 5000,
          paymentMethod: 'Bank',
          transactionId: '123456796',
          accountNumber: '987654321',
          accountName: 'Mohamed',
          date: '2018-01-01'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 5000,
          paymentMethod: 'Cheque',
          recipientName: 'Admin',
          chequeNumber: '123456787',
          date: '2018-01-01'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });

    it('should declare new transaction 4- [Cash]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 6000,
          paymentMethod: 'Cash',
          recipientName: 'Admin',
          date: '2018-01-04'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 6000,
          paymentMethod: 'Bank',
          transactionId: '123456796',
          accountNumber: '987654321',
          accountName: 'Mohamed',
          date: '2018-01-04'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 6000,
          paymentMethod: 'Cheque',
          recipientName: 'Admin',
          chequeNumber: '123456785',
          date: '2018-01-04'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });

    it('should declare new transaction 5- [Cash]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 7000,
          paymentMethod: 'Cash',
          recipientName: 'Admin',
          date: '2018-01-07'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 7000,
          paymentMethod: 'Bank',
          transactionId: '123456794',
          accountNumber: '987654321',
          accountName: 'Mohamed',
          date: '2018-01-07'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 7000,
          paymentMethod: 'Cheque',
          recipientName: 'Admin',
          chequeNumber: '123456787',
          date: '2018-01-07'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });

    it('should declare new transaction 6- [Cash]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 8000,
          paymentMethod: 'Cash',
          recipientName: 'Admin',
          date: '2018-01-08'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 8000,
          paymentMethod: 'Bank',
          transactionId: '123456793',
          accountNumber: '987654321',
          accountName: 'Mohamed',
          date: '2018-01-08'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 8000,
          paymentMethod: 'Cheque',
          recipientName: 'Admin',
          chequeNumber: '123456782',
          date: '2018-01-08'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });

    it('should declare new transaction 7- [Cash]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 9000,
          paymentMethod: 'Cash',
          recipientName: 'Admin',
          date: '2018-01-09'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 9000,
          paymentMethod: 'Bank',
          transactionId: '123456791',
          accountNumber: '987654321',
          accountName: 'Mohamed',
          date: '2018-01-09'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 9000,
          paymentMethod: 'Cheque',
          recipientName: 'Admin',
          chequeNumber: '123456781',
          date: '2018-01-01'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });

    it('should declare new transaction 8- [Cash]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 10000,
          paymentMethod: 'Cash',
          recipientName: 'Admin',
          date: '2018-01-10'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 10000,
          paymentMethod: 'Bank',
          transactionId: '123456790',
          accountNumber: '987654321',
          accountName: 'Mohamed',
          date: '2018-01-10'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      request(app)
        .post('/api/transactions/declare')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 10000,
          paymentMethod: 'Cheque',
          recipientName: 'Admin',
          chequeNumber: '123456780',
          date: '2018-01-10'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
  });
  describe('# POST /api/transactions/declare - [Customer/Supplier] declare transaction.', () => {
    let token = null;
    before((done) => {
      request(app)
        .post('/api/auth/login')
        .send({
          username: 'contact@supplieson.com',
          password: 'asd12345'
        })
        .expect(httpStatus.OK)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });
    it('should declare new transaction 1- [Cash]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 3000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cash',
              recipientName: supplier.representativeName,
              date: '2018-01-01'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 3000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Bank',
              transactionId: '123456798',
              accountNumber: '987654321',
              accountName: 'Rashad',
              date: '2018-01-01'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 3000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cheque',
              recipientName: supplier.representativeName,
              chequeNumber: '123456789',
              date: '2018-01-01'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });

    it('should declare new transaction 2- [Cash]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 4000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cash',
              recipientName: supplier.representativeName,
              date: '2018-01-02'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 4000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Bank',
              transactionId: '123456789',
              accountNumber: '987654321',
              accountName: 'Rashad',
              date: '2018-01-02'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 4000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cheque',
              recipientName: supplier.representativeName,
              chequeNumber: '123456788',
              date: '2018-01-02'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });

    it('should declare new transaction 3- [Cash]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 5000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cash',
              recipientName: supplier.representativeName,
              date: '2018-01-03'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 5000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Bank',
              transactionId: '123456787',
              accountNumber: '987654321',
              accountName: 'Rashad',
              date: '2018-01-03'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 5000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cheque',
              recipientName: supplier.representativeName,
              chequeNumber: '123456778',
              date: '2018-01-03'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });

    it('should declare new transaction 4- [Cash]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 6000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cash',
              recipientName: supplier.representativeName,
              date: '2018-01-05'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 6000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Bank',
              transactionId: '123456776',
              accountNumber: '987654321',
              accountName: 'Rashad',
              date: '2018-01-05'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 6000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cheque',
              recipientName: supplier.representativeName,
              chequeNumber: '123456766',
              date: '2018-01-05'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });

    it('should declare new transaction 5- [Cash]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 7000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cash',
              recipientName: supplier.representativeName,
              date: '2018-01-07'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 7000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Bank',
              transactionId: '123456755',
              accountNumber: '987654321',
              accountName: 'Rashad',
              date: '2018-01-08'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 8000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cheque',
              recipientName: supplier.representativeName,
              chequeNumber: '123456744',
              date: '2018-01-08'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });

    it('should declare new transaction 6- [Cash]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 8000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cash',
              recipientName: supplier.representativeName,
              date: '2018-01-09'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 8000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Bank',
              transactionId: '123456733',
              accountNumber: '987654321',
              accountName: 'Rashad',
              date: '2018-01-09'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 8000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cheque',
              recipientName: supplier.representativeName,
              chequeNumber: '123456722',
              date: '2018-01-09'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });

    it('should declare new transaction 7- [Cash]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 9000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cash',
              recipientName: supplier.representativeName,
              date: '2018-01-10'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Bank]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 9000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Bank',
              transactionId: '123456711',
              accountNumber: '987654321',
              accountName: 'Rashad',
              date: '2018-01-10'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should declare new transaction [Cheque]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/declare')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 9000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cheque',
              recipientName: supplier.representativeName,
              chequeNumber: '123456700',
              date: '2018-01-10'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
  });


  describe('# POST /api/transactions/add -  [Supplier/Customer] Add Payment.', () => {
    let token = null;
    before((done) => {
      request(app)
        .post('/api/auth/login')
        .send({
          username: 'ahmed@indielabs.sa',
          password: 'asd12345'
        })
        .expect(httpStatus.OK)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });
    it('should add new transaction [Bank]', (done) => {
      Customer.findOne({ representativeName: 'khaleel haboub' })
        .then((customer) => {
          const customerID = customer._id;
          request(app)
            .post('/api/transactions/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 3000,
              customerId: customerID.toString(),
              paymentMethod: 'Bank',
              transactionId: '123456798',
              accountNumber: '987654321',
              accountName: customer.representativeName
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should add new transaction [Cash]', (done) => {
      Customer.find({ representativeName: 'khaleel haboub' })
        .then((customer) => {
          const customerID = customer.map(c => c._id);
          request(app)
            .post('/api/transactions/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 3000,
              customerId: customerID.toString(),
              paymentMethod: 'Cash',
              recipientName: 'Mohamed'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should add new transaction [Cheque]', (done) => {
      Customer.find({ representativeName: 'khaleel haboub' })
        .then((customer) => {
          const customerID = customer.map(c => c._id);
          request(app)
            .post('/api/transactions/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 3000,
              customerId: customerID.toString(),
              paymentMethod: 'Cheque',
              chequeNumber: '123456789',
              recipientName: 'Mohamed'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
  });
  describe('# POST /api/transactions/add - [Admin/Supplier] Add Payment.', () => {
    let token = null;
    before((done) => {
      request(app)
        .post('/api/auth/login')
        .send({
          username: 'khaleel@indielabs.sa',
          password: 'asd12345'
        })
        .expect(httpStatus.OK)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });
    it('should add new transaction [Cash]', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier.map(c => c._id);
          request(app)
            .post('/api/transactions/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 3000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cash',
              recipientName: 'Admin'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should add new transaction [Bank]', (done) => {
      Supplier.findOne({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier._id;
          request(app)
            .post('/api/transactions/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 3000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Bank',
              transactionId: '123456798',
              accountNumber: '987654321',
              accountName: supplier.englishName
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
    it('should add new transaction [Cheque]', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierID = supplier.map(c => c._id);
          request(app)
            .post('/api/transactions/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
              amount: 3000,
              supplierId: supplierID.toString(),
              paymentMethod: 'Cheque',
              chequeNumber: '123456789',
              recipientName: 'Admin'
            })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
  });
});
