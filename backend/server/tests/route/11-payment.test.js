import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';
import PendingPayment from '../../models/pendingPayment.model';
import Customer from '../../models/customer.model';
import Supplier from '../../models/supplier.model';


const debug = require('debug')('app:payment.test');

chai.config.includeStack = true;

describe('Payments', () => {
  describe('# GET /api/payments - Get transactions pending with [Supplier Auth].', () => {
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
    it('should get pending transactions- [Status only]', (done) => {
      request(app)
      .get('/api/payments?skip=0&limit=3&status=["approved"]')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) { debug(err); } else {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.includes('Success');
        } done();
      });
    });
  });
  describe('# GET /api/payments - Get transactions pending with [Admin Auth].', () => {
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
    it('should get pending transactions. - [Status and SupplierId]', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          request(app)
            .get(`/api/payments?supplierId=${supplierId}&skip=0&limit=3&status=["approved"]`)
            .set('Authorization', `Bearer ${token}`)
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
  describe('# GET /api/payments - Get transactions pending with [Supplier Auth and CustomerId].', () => {
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
    it('should get pending transactions. - [Status and CustomerId]', (done) => {
      Customer.find({ representativeName: 'supplieson customer' })
        .then((customer) => {
          const customerId = customer.map(c => c._id);
          request(app)
            .get(`/api/payments?customerId=${customerId}&skip=0&limit=3&status=["approved"]`)
            .set('Authorization', `Bearer ${token}`)
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
  describe('# GET /api/payments - Get transactions pending with [Customer Auth].', () => {
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
    it('should get pending transactions- [Status only]', (done) => {
      request(app)
        .get('/api/payments?skip=0&limit=3&status=["approved"]')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
  });
  describe('# GET /api/payments - Get transactions pending with [Customer Auth and SupplierId].', () => {
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
    it('should get pending transactions. - [Status and SupplierId]', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          request(app)
            .get(`/api/payments?supplierId=${supplierId}&skip=0&limit=3&status=["approved"]`)
            .set('Authorization', `Bearer ${token}`)
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

  describe('# GET /api/payment/paymentId - Get payment[Supplier Auth].', () => {
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
    it('should get payment', (done) => {
      PendingPayment.findOne({ status: 'Pending' })
        .then((pendingPayment) => {
          const pendingPaymentsId = pendingPayment._id;
          request(app)
            .get(`/api/payments/${pendingPaymentsId}`)
            .set('Authorization', `Bearer ${token}`)
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
  describe('# GET /api/payments/paymentId - Get payment [Admin Auth].', () => {
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
    it('should get payment]', (done) => {
      PendingPayment.findOne({ status: 'Pending' })
        .then((pendingPayment) => {
          const PendingPaymentsId = pendingPayment._id;
          request(app)
            .get(`/api/payments/${PendingPaymentsId}`)
            .set('Authorization', `Bearer ${token}`)
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
  // describe('# GET /api/payments/paymentId - Get payment [Customer Auth].', () => {
  //   let token = null;
  //   before((done) => {
  //     request(app)
  //       .post('/api/auth/login')
  //       .send({
  //         username: 'contact@supplieson.com',
  //         password: 'asd12345'
  //       })
  //       .expect(httpStatus.OK)
  //       .end((err, res) => {
  //         token = res.body.token;
  //         done();
  //       });
  //   });
  //   it('should get payment', (done) => {
  //     PendingPayment.findOne({ status: 'Pending' })
  //       .then((pendingPayment) => {
  //         const PendingPaymentsId = pendingPayment._id;
  //         console.log('PendingPaymentsId', PendingPaymentsId);
  //         request(app)
  //           .get(`/api/payments/${PendingPaymentsId}`)
  //           .set('Authorization', `Bearer ${token}`)
  //           .end((err, res) => {
  //             if (err) {
  //               debug(err);
  //             } else {
  //               expect(res.status).to.equal(200);
  //               expect(res.body.status).to.includes('Success');
  //             }
  //             done();
  //           });
  //       });
  //   });
  // });

  describe('# PUT /api/payments/:pendingPaymentId/accept - [Admin/Supplier] Accept transaction.', () => {
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
    it('should be accepted payment/transaction', (done) => {
      PendingPayment.findOne({ customer: null })
        .then((pendingPayment) => {
          // const pendingPaymentId = pendingPayment.map(c => c._id);
          request(app)
            .put(`/api/payments/${pendingPayment._id.toString()}/accept`)
            .set('Authorization', `Bearer ${token}`)
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
  describe('# PUT /api/payments/:pendingPaymentId/reject - [Admin/Supplier] Reject transaction.', () => {
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
    it('should be rejected payment/transaction', (done) => {
      PendingPayment.findOne({ customer: null })
        .then((pendingPayment) => {
          // const pendingPaymentId = pendingPayment.map(c => c._id);
          request(app)
            .put(`/api/payments/${pendingPayment._id}/reject`)
          .set('Authorization', `Bearer ${token}`)
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
  describe('# PUT /api/payments/:pendingPaymentId/accept - [Customer/Supplier] Accept transaction.', () => {
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
    it('should be accepted payment/transaction', (done) => {
      PendingPayment.findOne({ recipientName: 'zieny\'s supplies', status: 'Pending' })
        .then((pendingPayment) => {
          const pendingPaymentId = pendingPayment._id;
          request(app)
            .put(`/api/payments/${pendingPaymentId}/accept`)
            .set('Authorization', `Bearer ${token}`)
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
  describe('# PUT /api/payments/:pendingPaymentId/reject - [Customer/Supplier] Reject transaction.', () => {
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
    it('should be rejected payment/transaction', (done) => {
      PendingPayment.findOne({ recipientName: 'zieny\'s supplies' })
        .then((pendingPayment) => {
          const pendingPaymentId = pendingPayment._id;
          request(app)
          .put(`/api/payments/${pendingPaymentId}/reject`)
          .set('Authorization', `Bearer ${token}`)
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

  describe('# GET /api/suppliers/reports/transactions - [customerId] - [Supplier Auth]', () => {
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
    it('should get a report of supplier orders and revenue - [customerId] - [Supplier Auth]', (done) => {
      Customer.find({ representativeName: 'supplieson customer' })
        .then((customer) => {
          const customerId = customer.map(c => c._id);

          request(app)
            .get(`/api/suppliers/reports/transactions?startDate=2017-01-01&endDate=2018-01-25&customerId=${customerId}&skip=0&limit=10`)
            .set('Authorization', `Bearer ${token}`)
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
  describe('# GET /api/suppliers/reports/transactions - [None Query] - [Supplier Auth]', () => {
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
    it('should get a report of supplier orders and revenue - [None Query] - [Supplier Auth]', (done) => {
      request(app)
        .get('/api/suppliers/reports/transactions?startDate=2017-01-01&endDate=2018-01-25&skip=0&limit=10')
        .set('Authorization', `Bearer ${token}`)
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
  describe('# GET /api/suppliers/reports/transactions - [Type Query= [Debit, Credit]] - [Supplier Auth]', () => {
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
    it('should get a report of supplier orders and revenue - [Type Query= [Debit, Credit]] - [Supplier Auth]', (done) => {
      request(app)
        .get('/api/suppliers/reports/transactions?startDate=2017-01-01&endDate=2018-01-25&skip=0&limit=10&type=Debit')
        .set('Authorization', `Bearer ${token}`)
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


  describe('# GET /api/suppliers/reports/transactions - [customerId] - [Admin Auth]', () => {
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
    it('should get a report of supplier orders and revenue - [customerId] - [Admin Auth]', (done) => {
      Customer.find({ representativeName: 'supplieson customer' })
        .then((customer) => {
          const customerId = customer.map(c => c._id);

          request(app)
            .get(`/api/suppliers/reports/transactions?startDate=2017-01-01&endDate=2018-01-25&customerId=${customerId}&skip=0&limit=10`)
            .set('Authorization', `Bearer ${token}`)
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
  describe('# GET /api/suppliers/reports/transactions - [supplierId] - [Admin Auth]', () => {
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
    it('should get a report of supplier orders and revenue - [customerId] - [Admin Auth]', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);

          request(app)
            .get(`/api/suppliers/reports/transactions?startDate=2017-01-01&endDate=2018-01-25&supplierId=${supplierId}&skip=0&limit=10`)
            .set('Authorization', `Bearer ${token}`)
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
  describe('# GET /api/suppliers/reports/transactions - [supplierId and CustomerId] - [Admin Auth]', () => {
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
    it('should get a report of supplier orders and revenue - [customerId] - [Admin Auth]', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          Customer.find({ representativeName: 'supplieson customer' })
            .then((customer) => {
              const customerId = customer.map(c => c._id);

              request(app)
                .get(`/api/suppliers/reports/transactions?startDate=2017-01-01&endDate=2018-01-25&supplierId=${supplierId}&customerId=${customerId}&skip=0&limit=10`)
                .set('Authorization', `Bearer ${token}`)
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
  describe('# GET /api/suppliers/reports/transactions - [None Query] - [Admin Auth]', () => {
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
    it('should get a report of supplier orders and revenue - [None Query] - [Admin Auth]', (done) => {
      request(app)
        .get('/api/suppliers/reports/transactions?startDate=2017-01-01&endDate=2018-01-25&skip=0&limit=10')
        .set('Authorization', `Bearer ${token}`)
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
  describe('# GET /api/suppliers/reports/transactions - [Type Query= [Debit, Credit]] - [Admin Auth]', () => {
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
    it('should get a report of supplier orders and revenue - [Type Query= [Debit, Credit]] - [Supplier Auth]', (done) => {
      request(app)
        .get('/api/suppliers/reports/transactions?startDate=2017-01-01&endDate=2018-01-25&skip=0&limit=10&type=Credit')
        .set('Authorization', `Bearer ${token}`)
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


describe('BillingHistory', () => {
  describe('# GET /api/suppliers/billingHistory', () => {
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
    it('should get supplier\'s billing history [Supplier Token]', (done) => {
      request(app)
      .get('/api/suppliers/billingHistory?skip=0&limit=2')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) { debug(err); } else {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.includes('Success');
        }
        done();
      });
    });
  });
  describe('# GET /api/suppliers/billingHistory/:supplierId', () => {
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
    it('should get supplier\'s billing history [Admin Token]', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
      .then((supplier) => {
        const supplierId = supplier.map(c => c._id);
        request(app)
          .get(`/api/suppliers/billingHistory/${supplierId}?skip=0&limit=2`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            if (err) { debug(err); } else {
              expect(res.status).to.equal(200);
              expect(res.body.status).to.includes('Success');
            }
            done();
          });
      });
    });
  });
  describe('# GET /api/customers/billingHistory', () => {
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
    it('should get customer\'s billing history [Customer Token]', (done) => {
      request(app)
      .get('/api/customers/billingHistory?skip=0&limit=2')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) { debug(err); } else {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.includes('Success');
        }
        done();
      });
    });
  });
  describe('# GET /api/customers/billingHistory/:customerId', () => {
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
    it('should get customer\'s billing history [Supplier Token]', (done) => {
      Customer.findOne({ representativeName: 'supplieson customer' })
      .then((customer) => {
        const customerId = customer._id;
        request(app)
          .get(`/api/customers/billingHistory/${customerId}?skip=0&limit=2`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            if (err) { debug(err); } else {
              expect(res.status).to.equal(200);
              expect(res.body.status).to.includes('Success');
            }
            done();
          });
      });
    });
  });
});
