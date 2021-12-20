// import request from 'supertest-as-promised';
// import chai, { expect } from 'chai';
// import app from '../../../index';
// import Contact from '../../models/contact.model';
//
//
// // const faker = require('faker');
//
// chai.config.includeStack = true;
//
//
// describe('## Contacts', () => {
//   describe('# POST /api/systemUnits - Create Contacts.', () => {
//     it('should create a contact', (done) => {
//       Reply.find({ reply: 'Great Work!' })
//         .then((reply) => {
//           const replyId = reply.map(c => c._id);
//           request(app)
//             .post('/api/contacts')
//             .send({
//               status: 'Open',
//               category: 'Cat',
//               user: {
//                 name: 'Ahmed',
//                 email: 'Ahmed@gmail.com',
//                 phone: '123456789'
//               },
//               message: {
//                 title: 'Done!',
//                 body: 'Great Job!'
//               },
//               is_seen: true,
//               replies: replyId.toString()
//             })
//             .then((res) => {
//               expect(res.status).to.equal(200);
//               done();
//             })
//             .catch(done);
//         });
//     });
//   });
//   describe('# GET /api/contacts - Get the contacts.', () => {
//     it('should get contacts', (done) => {
//       request(app)
//           .get('/api/contacts')
//           .then((res) => {
//             expect(res.status).to.equal(200);
//             done();
//           })
//           .catch(done);
//     });
//   });
//   describe('# PUT /api/contacts/contactId: - Update contact.', () => {
//     it('should update the mentioned contact', (done) => {
//       Reply.find({ reply: 'Great Work!' })
//           .then((reply) => {
//             const replyId = reply.map(c => c._id);
//
//             Contact.find({ status: 'Open' })
//               .then((contact) => {
//                 const contactId = contact.map(c => c._id);
//                 request(app)
//                   .put(`/api/contacts/${contactId}`)
//                   .send({
//                     status: 'Open',
//                     category: 'Cat',
//                     user: {
//                       name: 'Ahmed',
//                       email: 'Ahmed@gmail.com',
//                       phone: '123456789'
//                     },
//                     message: {
//                       title: 'Great Job, Done!',
//                       body: 'World'
//                     },
//                     is_seen: true,
//                     replies: replyId.toString()
//                   })
//                   .then((res) => {
//                     expect(res.status).to.equal(200);
//                     done();
//                   })
//                   .catch(done);
//               });
//           });
//     });
//   });
//   describe('# Get /api/contacts/contactId: - Get contact.', () => {
//     it('should get the mentioned contact', (done) => {
//       Contact.find({ status: 'Open' })
//             .then((contact) => {
//               const contactId = contact.map(c => c._id);
//               request(app)
//                 .get(`/api/contacts/${contactId}`)
//                 .then((res) => {
//                   expect(res.status).to.equal(200);
//                   done();
//                 })
//                 .catch(done);
//             });
//     });
//   });
//       // describe('# DEL /api/contacts/contactId: - Delete contact.', () => {
//
//       //   it('should delete the mentioned contact', (done) => {
//       //   Contact.find({ status: 'Open' })
//       //     .then((contact) => {
//       //       const contactId = contact.map(c => c._id);
//       //         request(app)
//       //           .delete(`/api/contacts/${contactId}`)
//       //           .then((res) => {
//       //             expect(res.status).to.equal(200);
//       //             done();
//       //           })
//       //           .catch(done);
//       //       });
//       //   });
//       // });
//
//   // describe('# PUT /contacts/contactId/reply - Update contact\'s Reply.', () => {
//
//   //   it('should update the mentioned contact\'s reply', (done) => {
//   //     Contact.find({ status: 'Open' })
//   //           .then((contact) => {
//   //             const contactId = contact.map(c => c._id);
//   //             request(app)
//   //               .put(`/api/contacts/${contactId}/reply`)
//   //               .send({
//   //                 replies: 'Great Work!'
//   //               })
//   //               .then((res) => {
//   //                 expect(res.status).to.equal(200);
//   //                 done();
//   //               })
//   //               .catch(done);
//   //           });
//   //   });
//   // });
// });
