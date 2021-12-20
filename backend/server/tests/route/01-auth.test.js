import request from 'supertest-as-promised';
import chai, { expect } from 'chai';
import app from '../../../index';
import Unit from '../../models/unit.model';


// const faker = require('faker');

chai.config.includeStack = true;


describe('## Auth', () => {
  describe('# POST /api/auth/login - User Login.', () => {
    it('should return authorization token', (done) => {
      request(app)
        .post('/api/auth/login')
        .send({
          username: 'khaleel@indielabs.sa',
          password: 'asd12345'
        })
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.text).to.includes('token');
          done();
        })
        .catch(done);
    });
  });

  describe('## systemUnits', () => {
    describe('# POST /api/systemUnits - Create System Units.', () => {
      it('should create a system unit', (done) => {
        request(app)
          .post('/api/systemUnits')
          .send({
            arabicName: 'طن',
            englishName: 'Tonne'
          })
          .then((res) => {
            expect(res.status).to.equal(200);
            done();
          })
          .catch(done);
      });
    });
    describe('# POST /api/systemUnits - Create System Units.', () => {
      it('should create a system unit', (done) => {
        request(app)
          .post('/api/systemUnits')
          .send({
            arabicName: 'كيلو جرام',
            englishName: 'Kilogram'
          })
          .then((res) => {
            expect(res.status).to.equal(200);
            done();
          })
          .catch(done);
      });
    });
    describe('# POST /api/systemUnits - Create System Units.', () => {
      it('should create a system unit', (done) => {
        request(app)
          .post('/api/systemUnits')
          .send({
            arabicName: 'كيلو طن',
            englishName: 'KiloTonne'
          })
          .then((res) => {
            expect(res.status).to.equal(200);
            done();
          })
          .catch(done);
      });
    });

    // describe('# POST /api/systemUnits - Create System Units.', () => {
    //   it('should create a system unit', (done) => {
    //     request(app)
    //       .post('/api/systemUnits')
    //       .send({
    //         arabicName: 'ميجا طن',
    //         englishName: '’MegaTonne'
    //       })
    //       .then((res) => {
    //         expect(res.status).to.equal(200);
    //         done();
    //       })
    //       .catch(done);
    //   });
    // });

    describe('# GET /api/systemUnits - Get the System Units.', () => {
      it('should get a system unit', (done) => {
        request(app)
          .get('/api/systemUnits')
          .then((res) => {
            expect(res.status).to.equal(200);
            done();
          })
          .catch(done);
      });
    });
    describe('# PUT /api/systemUnits/systemunitId: - Update Option.', () => {
      it('should update the mentioned option system unit', (done) => {
        Unit.find({ englishName: 'Tonne' })
          .then((unit) => {
            const unitId = unit.map(c => c._id);
            request(app)
              .put(`/api/systemUnits/${unitId}`)
              .send({
                arabicName: 'طن',
                englishName: 'Tonne'
              })
              .then((res) => {
                expect(res.status).to.equal(200);
                done();
              })
              .catch(done);
          });
      });
    });
    describe('# Get /api/systemUnits/systemunitId: - Get Option.', () => {
      it('should get the mentioned option system unit', (done) => {
        Unit.find({ englishName: 'Ton' })
          .then((unit) => {
            const unitId = unit.map(c => c._id);
            request(app)
              .get(`/api/systemUnits/${unitId}`)
              .then((res) => {
                expect(res.status).to.equal(200);
                done();
              })
              .catch(done);
          });
      });
    });

    // describe('# DEL /api/systemUnits/systemunitId: - Delete Option.', () => {
    //   it('should delete the mentioned option system unit', (done) => {
    //     Unit.find({ englishName: 'Ton' })
    //       .then((unit) => {
    //         const unitId = unit.map(c => c._id);
    //         request(app)
    //           .delete(`/api/systemUnits/${unitId}`)
    //           .then((res) => {
    //             expect(res.status).to.equal(200);
    //             done();
    //           })
    //           .catch(done);
    //       });
    //   });
    // });
  });

  // describe('# POST /api/auth/login - User Login. - Generating random Data with faker Case', () => {

  //   it('should return authorization token', (done) => {
  //     const Username = faker.internet.email();
  //     const Password = faker.internet.password();
  //     request(app)
  //       .post('/api/auth/login')
  //       .send({
  //         username: Username,
  //         password: Password
  //       })
  //       .then((res) => {
  //         if (res.status === 200) {
  //           expect(res.text).to.includes('token');
  //         } else {
  //           console.log('Status: ', res.status);
  //         }
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });
});
