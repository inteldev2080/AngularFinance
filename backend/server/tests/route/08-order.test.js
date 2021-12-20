import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';
import Order from '../../models/order.model';
import OrderProducts from '../../models/orderProduct.model';
import Supplier from '../../models/supplier.model';
import User from '../../models/user.model';


const debug = require('debug')('app:order.test');

chai.config.includeStack = true;


describe('## Orders', () => {
  describe('# GET [Suppliers Auth]  /api/orders - Get all Orders.', () => {
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
    it('should get list of orders for suppliers', (done) => {
      request(app)
        .get('/api/orders?skipOrderHistory=0&limitOrderHistory=10&skipRecurringOrder=0&limitRecurringOrder=10&skip=0&limit=10')
        .set('Authorization', `Bearer ${token}`)

        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
  });
  describe('# GET [Admin Auth]  /api/orders - Get all Orders.', () => {
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
    it('should get list of orders for [Admin Auth]', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          request(app)
            .get(`/api/orders?supplierId=${supplierId}&skipOrderHistory=0&limitOrderHistory=10&skipRecurringOrder=0&limitRecurringOrder=10&skip=0&limit=10`)
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
  describe('# GET [Customer Auth]  /api/orders - Get all Orders.', () => {
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
    it('should get list of orders for [Customer Auth]', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          request(app)
            .get(`/api/orders?supplierId=${supplierId}&skipOrderHistory=0&limitOrderHistory=10&skipRecurringOrder=0&limitRecurringOrder=10&skip=0&limit=10`)
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


  describe('# GET /api/orders/:orderId - Get specific order.', () => {
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
    it('should get order', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          Order.findOne({ supplier: supplierId })
            .then((order) => {
              const orderId = order._id;
              request(app)
                .get(`/api/orders/${orderId}?skip=0&limit=1`)
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

  describe('# PUT /api/orders/accept/:orderId - Accept Order.', () => {
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
    it('should be accepted the order', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          Order.findOne({ $and: [{ supplier: supplierId }, { status: 'Pending' }] })
            .then((order) => {
              const orderId = order._id;
              OrderProducts.find({ order: orderId })
                .select({ _id: 1 })
                .then((orderProducts) => {
                  const ordeorderproductsId = orderProducts.map(c => c._id.toString());
                  request(app)
                    .put(`/api/orders/accept/${orderId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                      acceptedProducts: ordeorderproductsId
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
  });
  describe('# PUT /api/orders/readyForDelivery/:orderId - readyForDelivery Order.', () => {
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
    it('should be readyForDelivery the order', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          Order.findOne({ $and: [{ supplier: supplierId }, { status: 'Accepted' }] }).then((order) => {
            const orderId = order._id;
            request(app)
              .put(`/api/orders/readyForDelivery/${orderId}`)
              .set('Authorization', `Bearer ${token}`)
              .end((err, res) => {
                if (err) {
                  debug(err);
                } else {
                  expect(res.status).to.equal(200);
                }
                done();
              });
          });
        });
    });
  });
  describe('# PUT /api/orders/OutForDelivery/:orderId - OutForDelivery Order.', () => {
    let token = null;
    let userEmail = null;
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
          userEmail = res.body.email;
          done();
        });
    });
    it('should be OutForDelivery the order', (done) => {
      User.findOne({ email: userEmail })
        .then((user) => {
          Supplier.findOne({ staff: { $in: [user._id] } })
        .then((supStaff) => {
          Supplier.find({ representativeName: 'zieny\'s supplies' })
            .then((supplier) => {
              const supplierId = supplier.map(c => c._id);
              Order.findOne({ $and: [{ supplier: supplierId }, { status: 'ReadyForDelivery' }] })
                .then((order) => {
                  const orderId = order._id;
                  request(app)
                  .put(`/api/orders/outForDelivery/${orderId}`)
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    driverId: supStaff.staff[1].toString()
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
    });
  });
  describe('# PUT /api/orders/Delivered/:orderId - Delivered Order.', () => {
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
    it('should be Delivered the order', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          Order.findOne({ $and: [{ supplier: supplierId }, { status: 'OutForDelivery' }] })
            .then((order) => {
              const orderId = order._id;
              request(app)
              .put(`/api/orders/delivered/${orderId}`)
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


  describe('# PUT /api/orders/accept/:orderId - Accept Order [Apple with price equals 450].', () => {
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
    it('should be accepted the order', (done) => {
      Order.findOne({ price: 450 })
        .then((order) => {
          const orderId = order._id;
          OrderProducts.find({ order: orderId })
            .select({ _id: 1 })
            .then((orderProducts) => {
              const orderProductsId = orderProducts.map(c => c._id.toString());
              request(app)
                .put(`/api/orders/accept/${orderId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  acceptedProducts: orderProductsId
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
  describe('# PUT /api/orders/reject/:orderId - Reject Order [Orange with price equals 750]', () => {
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
    it('should be rejected the order', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          Order.findOne({ $and: [{ supplier: supplierId }, { status: 'Pending' }, { price: 675 }] })
            .then((order) => {
              const orderId = order.map(c => c._id);
              request(app)
                .put(`/api/orders/reject/${orderId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  message: 'Sending a rejected note message!'
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


  describe('# POST /api/orders/review/:orderId - Create Order review.', () => {
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
    it('should create order review', (done) => {
      Order.findOne({ status: 'Delivered' })
        .then((order) => {
          const orderId = order._id;
          request(app)
            .post(`/api/orders/review/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              overall: 4,
              itemCondition: 3,
              delivery: 4,
              notes: 'Delivery arrived later than promised, some potatoes were bad'
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

  describe('# GET /api/orders/reviews - Get all Orders review.', () => {
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


    it('should get the reviews of the supplier', (done) => {
      request(app)
        .get('/api/orders/reviews?skip=0&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
  });

  describe('# PUT /api/orders/cancel/:orderId', () => {
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
    it('should be canceled the order', (done) => {
      Supplier.find({ representativeName: 'al-qahtani\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          Order.findOne({ $and: [{ supplier: supplierId }, { status: 'Pending' }, { canBeCanceled: true }] }).then((order) => {
            const orderId = order._id;
            request(app)
              .put(`/api/orders/cancel/${orderId}`)
              .set('Authorization', `Bearer ${token}`)
              .send({
                message: 'Sending a rejected note message!'
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

  describe('# GET /api/orders/overview - Get order overview.', () => {
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


    it('should get order overview', (done) => {
      request(app)
        .get('/api/orders/overview')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
  });

  describe('# GET /api/orders/history - [supplierId and orderId Query]', () => {
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
    it('should get order history - [customerId and OrderId Query]', (done) => {
      Supplier.find({ representativeName: 'al-qahtani\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          request(app)
                .get(`/api/orders/history?supplierId=${supplierId}&orderId=${appSettings.orderPrefix}120000001&skip=0&limit=10`)
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
  describe('# GET /orders/history - [orderId Query]', () => {
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
    it('should get  order history', (done) => {
      request(app)
            .get('/api/orders/history?orderId=${appSettings.orderPrefix}120000001&skip=0&limit=10')
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
  describe('# GET /orders/history - [supplierId Query]', () => {
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
    it('should get order history', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          request(app)
            .get(`/api/orders/history?supplierId=${supplierId}&skip=0&limit=10`)
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
  describe('# GET /orders/history - [None Query]', () => {
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
    it('should get  order history', (done) => {
      request(app)
        .get('/api/orders/history?skip=0&limit=10')
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
