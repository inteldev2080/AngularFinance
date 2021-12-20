import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';

chai.config.includeStack = true;

describe('## Misc', () => {
  describe('# GET /api/health-check', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/api/health-check')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });
  describe('# GET /api/404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  // describe('## Replies', () => {
  //   describe('# POST /api/replies - Create Reply.', () => {
  //     it('should create a reply for an Admin Account', (done) => {
  //       User.find({ email: 'khaleel@indielabs.sa' })
  //         .then((user) => {
  //           const userId = user.map(c => c._id);
  //           request(app)
  //             .post('/api/replies')
  //             .send({
  //               user: userId.toString(),
  //               reply: 'Great Work!'
  //             })
  //             .then((res) => {
  //               expect(res.status).to.equal(200);
  //               done();
  //             })
  //             .catch(done);
  //         });
  //     });
  //   });
  //   describe('# GET /api/replies - Get the replies.', () => {
  //     it('should get replies', (done) => {
  //       request(app)
  //         .get('/api/replies')
  //         .then((res) => {
  //           expect(res.status).to.equal(200);
  //           done();
  //         })
  //         .catch(done);
  //     });
  //   });
  // });
});
