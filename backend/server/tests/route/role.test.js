import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';
import Permission from '../../models/permission.model';
import Role from '../../models/role.model';
import User from '../../models/user.model';

const debug = require('debug')('app:role.test');

chai.config.includeStack = true;

// Successful
describe('## Roles', () => {
  describe('# GET /api/roles - Get Admin Roles.', () => {
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
    it('should get list of roles', (done) => {
      request(app)
        .get('/api/roles?skip=0&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
  });
  describe('# GET /api/roles - Get Supplier Roles.', () => {
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
    it('should get list of roles', (done) => {
      request(app)
        .get('/api/roles?skip=0&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
  });
  describe('# GET /api/roles/permissions - Get Supplier Role Permission.', () => {
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
    it('should get list of permissions', (done) => {
      request(app)
        .get('/api/roles/permissions?skip=0&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
  });
  describe('# GET /api/roles/permissions - Get Admin Role Permission.', () => {
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
    it('should get list of permissions', (done) => {
      request(app)
        .get('/api/roles/permissions?skip=0&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
  });

  describe('# POST /api/roles - Supplier Create Role Driver.', () => {
    let token = null;
    before((done) => {
      request(app)
          .post('/api/auth/login')
          .send({
            username: 'mohammed.a@indielabs.sa',
            password: 'asd12345'
          })
          .expect(httpStatus.OK)
          .end((err, res) => {
            token = res.body.token;
            done();
          });
    });
    it('should create role', (done) => {
      Permission.find({ englishName: 'Orders' })
        .then((permission) => {
          const permissionId = permission.map(c => c._id);
          request(app)
            .post('/api/roles')
            .set('Authorization', `Bearer ${token}`)
            .send({
              permissions: permissionId,
              arabicName: 'سائق مزود',
              englishName: 'SupplierDriver'
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
  describe('# POST /api/roles - Supplier Create Role DriverReplaced.', () => {
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
    it('should create role', (done) => {
      Permission.find({ englishName: 'Orders' })
        .then((permission) => {
          const permissionId = permission.map(c => c._id);
          request(app)
            .post('/api/roles')
            .set('Authorization', `Bearer ${token}`)
            .send({
              permissions: permissionId,
              arabicName: 'سائق مزود بديل',
              englishName: 'DriverSupplierReplaced'
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

  describe('# POST /api/roles - Admin Create Role Driver.', () => {
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
    it('should create role', (done) => {
      Permission.find({ englishName: 'Orders' })
        .then((permission) => {
          const permissionId = permission.map(c => c._id);
          request(app)
            .post('/api/roles')
            .set('Authorization', `Bearer ${token}`)
            .send({
              permissions: permissionId,
              arabicName: 'سائق مسئول',
              englishName: 'AdminDriver'
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
  describe('# POST /api/roles - Admin Create Role DriverReplaced.', () => {
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
    it('should create role', (done) => {
      Permission.find({ englishName: 'Orders' })
        .then((permission) => {
          const permissionId = permission.map(c => c._id);
          request(app)
            .post('/api/roles')
            .set('Authorization', `Bearer ${token}`)
            .send({
              permissions: permissionId,
              arabicName: 'سائق مسئول بديل',
              englishName: 'AdminDriverReplaced'
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


  describe('# PUT /api/roles/:roleId - Supplier Update Role Driver.', () => {
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
    it('should update the role', (done) => {
      Permission.find({ englishName: 'Orders' })
        .then((permission) => {
          const permissionId = permission.map(c => c._id);
          User.find({ email: 'm.rashad@indielabs.sa' })
            .then((user) => {
              const roleId = user.map(c => c.role);
              request(app)
                .put(`/api/roles/${roleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  permissions: permissionId,
                  arabicName: 'سائق مزود',
                  englishName: 'SupplierDriver'
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
  describe('# PUT /api/roles/:roleId - Admin Update Role Admin Driver.', () => {
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
    it('should update the role', (done) => {
      Permission.find({ englishName: 'Orders' })
        .then((permission) => {
          const permissionId = permission.map(c => c._id);
          Role.find({ englishName: 'AdminDriver' })
            .then((role) => {
              const roleId = role.map(c => c._id);
              request(app)
                .put(`/api/roles/${roleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  permissions: permissionId,
                  arabicName: 'سائق مسئول',
                  englishName: 'AdminDriver'
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

  describe('# DELETE /api/roles/:roleId - Supplier Delete Role Driver.', () => {
    let token = null;
    before((done) => {
      request(app)
        .post('/api/auth/login')
        .send({
          username: 'mohammed.a@indielabs.sa',
          password: 'asd12345'
        })
        .expect(httpStatus.OK)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });
    it('should delete role', (done) => {
      Role.findOne({ englishName: 'SupplierDriver' })
        .then((role) => {
          const roleId = role._id;
          Role.find({ englishName: 'DriverSupplierReplaced' })
            .then((roleReplaced) => {
              const roleReplacedId = roleReplaced.map(c => c._id);
              request(app)
                .delete(`/api/roles/${roleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  alternativeRoleId: roleReplacedId.toString()
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
  describe('# DELETE /api/roles/:roleId - Admin Delete Role Driver.', () => {
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
    it('should delete role', (done) => {
      Role.find({ englishName: 'AdminDriver' })
        .then((role) => {
          const roleId = role.map(c => c._id);
          Role.find({ englishName: 'AdminDriverReplaced' })
            .then((roleReplaced) => {
              const roleReplacedId = roleReplaced.map(c => c._id);
              request(app)
                .delete(`/api/roles/${roleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  alternativeRoleId: roleReplacedId.toString()
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

