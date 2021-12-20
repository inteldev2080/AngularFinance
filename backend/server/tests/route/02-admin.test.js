import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';
import User from '../../models/user.model';
import Role from '../../models/role.model';
import Customer from '../../models/customer.model';
import Supplier from '../../models/supplier.model';


// const faker = require('faker');
const debug = require('debug')('app:admin.test');

chai.config.includeStack = true;

describe('## Admins ', () => {
  describe('# GET /api/admins - Get all admins.', () => {
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
    it('should get list of admins', (done) => {
      request(app)
        .get('/api/admins?skip=0&limit=10')
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
  describe('# GET /api/admins/:adminId - Get a certain admin.', () => {
    let token = null;
    let adminEmail = null;
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
          adminEmail = res.body.email;
          done();
        });
    });
    it('should get admin', (done) => {
      User.find({ email: adminEmail })
        .then((admin) => {
          const adminId = admin.map(c => c._id);
          request(app)
            .get(`/api/admins/${adminId}?skip=0&limit=10&status=["invited"]`)
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
  describe('# GET /api/admins/current - Get current admin', () => {
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
    it('should get current admin', (done) => {
      request(app)
        .get('/api/admins/profile')
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

  describe('# POST /api/admins - Create user admin.', () => {
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
    it('should be created new admin', (done) => {
      Role.find({ userType: 'Admin' })
        .then((role) => {
          const roleId = role.map(c => c._id);
          request(app)
            .post('/api/admins')
            .set('Authorization', `Bearer ${token}`)
            .send({
              email: 'attalla@indielabs.sa',
              firstName: 'Attalla',
              lastName: 'Admin',
              mobileNumber: '966511111111',
              password: 'asd12345',
              language: 'en',
              role: roleId.toString()
            })
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
  describe('# POST /api/admins - Create user admin.', () => {
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
    it('should be created new admin', (done) => {
      Role.find({ userType: 'Admin' })
        .then((role) => {
          const roleId = role.map(c => c._id);
          request(app)
            .post('/api/admins')
            .set('Authorization', `Bearer ${token}`)
            .send({
              email: 'ahmedm.attalla@gmail.com',
              firstName: 'Attalla Testing',
              lastName: 'Admin',
              mobileNumber: '966522222222',
              password: 'asd12345',
              language: 'ar',
              role: roleId.toString()
            })
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
  describe('# POST /api/admins - Create user admin.', () => {
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
    it('should be created new admin', (done) => {
      Role.find({ userType: 'Admin' })
        .then((role) => {
          const roleId = role.map(c => c._id);
          request(app)
            .post('/api/admins')
            .set('Authorization', `Bearer ${token}`)
            .send({
              email: 'testingdata.ahmedm.attalla@gmail.com',
              firstName: 'Attalla Testing',
              lastName: 'data',
              mobileNumber: '966523232323',
              password: 'asd12345',
              language: 'ar',
              role: roleId.toString()
            })
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

  describe('# PUT /api/admins - Update admin.', () => {
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
    it('should update admin', (done) => {
      User.find({ email: 'attalla@indielabs.sa' })
        .then((admin) => {
          const adminId = admin.map(c => c._id);
          Role.find({ userType: 'Admin' })
            .then((role) => {
              const roleId = role.map(c => c._id);
              request(app)
                .put(`/api/admins/${adminId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  email: 'attalla@indielabs.sa',
                  firstName: 'SuperAdmin',
                  lastName: 'Admin',
                  mobileNumber: '966511111111',
                  password: 'asd12345',
                  status: 'Active',
                  language: 'ar',
                  role: roleId.toString()
                })
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
  describe('# PUT /api/admins - Update logged in admin.', () => {
    let token = null;
    before((done) => {
      request(app)
        .post('/api/auth/login')
        .send({
          username: 'attalla@indielabs.sa',
          password: 'asd12345'
        })
        .expect(httpStatus.OK)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });
    it('should update logged in admin', (done) => {
      request(app)
        .put('/api/admins')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'attalla@indielabs.sa',
          firstName: 'SuperAdmin',
          lastName: 'admin',
          mobileNumber: '966511111111',
          language: 'ar',
          password: 'asd12345',
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          }
          done();
        });
    });
  });


  describe('# GET /api/admins/reports/orders - [customerId and status Query]', () => {
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
    it('should get a report of admin orders and revenue - [customerId and status Query]', (done) => {
      Customer.find({ representativeEmail: 'mohammed@gmail.com' })
        .then((customer) => {
          const customerId = customer.map(c => c._id);

          request(app)
            .get(`/api/admins/reports/orders?startDate=2017-12-02&endDate=2018-12-20&&customerId=${customerId}&skip=0&limit=10&status=["accepted"]`)
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
  describe('# GET /admins/reports/orders - [status Query]', () => {
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
    it('should get a report of admin orders and revenue', (done) => {
      request(app)
        .get('/api/admins/reports/orders?startDate=2017-12-02&endDate=2017-12-20&skip=0&limit=10&status=["accepted"]')
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
  describe('# GET /admins/reports/orders - [customerId Query]', () => {
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
    it('should get a report of admin orders and revenue', (done) => {
      Customer.find({ representativeEmail: 'mohammed@gmail.com' })
        .then((customer) => {
          const customerId = customer.map(c => c._id);

          request(app)
            .get(`/api/admins/reports/orders?startDate=2017-12-02&endDate=2017-12-20&customerId=${customerId}&skip=0&limit=10`)
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
  describe('# GET /api/suppliers/reports/orders - [None Query]', () => {
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
    it('should get a report of admin orders and revenue', (done) => {
      request(app)
        .get('/api/admins/reports/orders?startDate=2017-12-02&endDate=2017-12-20&skip=0&limit=10')
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

  describe('# GET /api/admins/reports/orders - [supplierId and status Query]', () => {
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
    it('should get a report of admin orders and revenue - [customerId and status Query]', (done) => {
      Supplier.find({ representativeName: 'Mohamed Supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);

          request(app)
            .get(`/api/admins/reports/orders?startDate=2017-12-02&endDate=2018-12-20&&supplierId=${supplierId}&skip=0&limit=10&status=["accepted"]`)
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
  describe('# GET /admins/reports/orders - [status Query]', () => {
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
    it('should get a report of admin orders and revenue', (done) => {
      request(app)
        .get('/api/admins/reports/orders?startDate=2017-12-02&endDate=2017-12-20&skip=0&limit=10&status=["accepted"]')
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
  describe('# GET /admins/reports/orders - [supplierId Query]', () => {
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
    it('should get a report of admin orders and revenue', (done) => {
      Supplier.find({ representativeName: 'Mohamed Supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);

          request(app)
            .get(`/api/admins/reports/orders?startDate=2017-12-02&endDate=2017-12-20&supplierId=${supplierId}&skip=0&limit=10`)
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
  describe('# GET /api/suppliers/reports/orders - [None Query]', () => {
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
    it('should get a report of admin orders and revenue', (done) => {
      request(app)
        .get('/api/admins/reports/orders?startDate=2017-12-02&endDate=2017-12-20&skip=0&limit=10')
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
