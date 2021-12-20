import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';
import RecurringOrder from '../../models/recurringOrder.model';

const debug = require('debug')('app:recurringOrder.test');

chai.config.includeStack = true;

describe('## Recurring Orders', () => {
  describe('# GET /api/recurringOrders', () => {
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
    it('should get list of recurringOrders', (done) => {
      request(app)
        .get('/api/recurringOrders?skip=0&limit=10')
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

  describe('# GET /api/recurringOrders/:recurringOrderId', () => {
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
    it('should get recurring order', (done) => {
      RecurringOrder.findOne({ orderIntervalType: 'Week' })
        .then((recurringOrder) => {
          const recurringOrderId = recurringOrder._id;
          request(app)
            .get(`/api/recurringOrders/${recurringOrderId}`)
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

  describe('# PUT /api/recurringOrders/:recurringOrderId', () => {
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
    it('should be updated the order', (done) => {
      RecurringOrder.findOne({ orderIntervalType: 'Week' })
        .then((recurringOrder) => {
          const recurringOrderId = recurringOrder._id.toString();

          request(app)
            .put(`/api/recurringOrders/${recurringOrderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              orderIntervalType: 'Month',
              orderFrequency: 3,
              startDate: '2017-03-12'
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

  describe('# PUT /api/recurringOrders/:recurringOrderId/cancel', () => {
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
      RecurringOrder.findOne({ orderIntervalType: 'Month' })
        .then((recurringOrder) => {
          const recurringOrderId = recurringOrder._id.toString();
          request(app)
                .put(`/api/recurringOrders/${recurringOrderId}/cancel`)
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
