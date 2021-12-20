import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';
import Product from '../../models/product.model';
import Cart from '../../models/cart.model';
import Customer from '../../models/customer.model';
import Supplier from '../../models/supplier.model';
import User from '../../models/user.model';

const debug = require('debug')('app:cart.test');

chai.config.includeStack = true;

describe('## Carts', () => {
  describe('# POST /api/carts - Add to Cart Apple.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Apple' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 2
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
  describe('# POST /api/carts - Add to Cart Orange.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Orange' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 2
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
  describe('# POST /api/carts - Add to Cart Shrimps.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Shrimps' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 2
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


  describe('# GET /api/carts - Get all carts.', () => {
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
    it('should get list of carts', (done) => {
      request(app)
        .get('/api/carts?skip=0&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          } done();
        });
    });
  });
  describe('# GET /api/cart/:cartId - Get specific cart [CartId].', () => {
    let token = null;
    let userEmail = null;
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
            userEmail = res.body.email;
            done();
          });
    });
    it('should get cart by cartId', (done) => {
      User.findOne({ email: userEmail })
        .then((userData) => {
          Customer.find({ user: userData._id })
            .then((customerData) => {
              Cart.find({ customer: customerData._id })
                .then((cart) => {
                  const cartId = cart.map(c => c._id);
                  request(app)
                    .get(`/api/carts/${cartId}`)
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
  });
  describe('# GET /api/carts/supplier/:supplierId - Get specific cart [SupplierId].', () => {
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
    it('should get cart by supplierId', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);
          request(app)
            .get(`/api/carts/supplier/${supplierId}`)
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


  describe('# PUT /api/carts/product/:productId - Update product quantity in cart.', () => {
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
    it('should update product quantity in cart', (done) => {
      Product.find({ englishName: 'Shrimps' })
        .then((product) => {
          const productID = product.map(c => c._id);
          request(app)
            .put(`/api/carts/product/${productID}`)
            .set('Authorization', `Bearer ${token}`)
            .query({ quantity: 3 })
            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.includes('Success');
              } done();
            });
        });
    });
  });

  describe('# DELETE /api/carts/product/:productId - Delete product from cart.', () => {
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
    it('should remove a product from cart', (done) => {
      Product.find({ englishName: 'Shrimps' })
          .then((product) => {
            const productId = product.map(c => c._id);
            request(app)
                  .delete(`/api/carts/product/${productId}`)
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

  describe('# POST /api/carts - Add to Cart Apple.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Apple' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 2
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
  describe('# POST /api/carts - Add to Cart Orange.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Orange' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 2
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
  describe('# POST /api/carts - Add to Cart Shrimps.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Shrimps' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 2
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


  describe('# POST /api/carts/checkout/:cartId - 1- Checkout cart order.', () => {
    let token = null;
    let userEmail = null;
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
          userEmail = res.body.email;
          done();
        });
    });
    it('should check out the cart ', (done) => {
      User.findOne({ email: userEmail })
        .then((userData) => {
          Customer.findOne({ user: userData._id })
            .then((customerData) => {
              Cart.findOne({ customer: customerData._id })

                .then((cart) => {
                  const cartId = cart._id.toString();
                  request(app)
                    .post(`/api/carts/checkout/${cartId}`)
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
  });

  describe('# POST /api/carts - Add to Cart Apple.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Apple' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 2
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
  describe('# POST /api/carts - Add to Cart Orange.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Orange' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 2
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
  describe('# POST /api/carts - Add to Cart Shrimps.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Shrimps' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 2
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


  describe('# POST /api/carts - Add to Cart Apple.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Apple' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 10
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
  describe('# POST /api/carts - Add to Cart Orange.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Orange' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 10
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
  describe('# POST /api/carts - Add to Cart Shrimps.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Shrimps' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 10
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

  describe('# POST /api/carts/checkout/:cartId - 2- Checkout cart order.', () => {
    let token = null;
    let userEmail = null;
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
          userEmail = res.body.email;
          done();
        });
    });
    it('should check out the cart', (done) => {
      User.findOne({ email: userEmail })
        .then((userData) => {
          Customer.findOne({ user: userData._id })
            .then((customerData) => {
              Cart.findOne({ customer: customerData._id })

                .then((cart) => {
                  const cartId = cart._id.toString();
                  request(app)
                    .post(`/api/carts/checkout/${cartId}`)
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
  });

  describe('# POST /api/carts - Add to Cart Apple.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Apple' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 20
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
  describe('# POST /api/carts - Add to Cart Orange.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Orange' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 20
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
  describe('# POST /api/carts - Add to Cart Shrimps.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Shrimps' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 20
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

  describe('# POST /api/carts/checkout/:cartId - 3- Checkout cart order.', () => {
    let token = null;
    let userEmail = null;
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
          userEmail = res.body.email;
          done();
        });
    });
    it('should check out the cart', (done) => {
      User.findOne({ email: userEmail })
        .then((userData) => {
          Customer.findOne({ user: userData._id })
            .then((customerData) => {
              Cart.findOne({ customer: customerData._id })

                .then((cart) => {
                  const cartId = cart._id.toString();
                  request(app)
                    .post(`/api/carts/checkout/${cartId}`)
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
  });

  describe('# POST /api/carts - Add to Cart Apple.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Apple' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 30
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
  describe('# POST /api/carts - Add to Cart Orange.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Orange' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 30
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
  describe('# POST /api/carts - Add to Cart Shrimps.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Shrimps' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 30
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

  describe('# POST /api/carts/checkout/:cartId - 4- Checkout cart order.', () => {
    let token = null;
    let userEmail = null;
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
          userEmail = res.body.email;
          done();
        });
    });
    it('should check out the cart', (done) => {
      User.findOne({ email: userEmail })
        .then((userData) => {
          Customer.findOne({ user: userData._id })
            .then((customerData) => {
              Cart.findOne({ customer: customerData._id })

                .then((cart) => {
                  const cartId = cart._id.toString();
                  request(app)
                    .post(`/api/carts/checkout/${cartId}`)
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
  });


  describe('# POST /api/carts - Add to Cart Apple.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Apple' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 30
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
  describe('# POST /api/carts - Add to Cart Orange.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Orange' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 30
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
  describe('# POST /api/carts - Add to Cart Shrimps.', () => {
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
    it('should be added product to cart ', (done) => {
      Product.find({ englishName: 'Shrimps' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .send({
              product: productId.toString(),
              quantity: 30
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

  describe('# DELETE /api/cart/:cartId - Delete Cart.', () => {
    let token = null;
    let userEmail = null;
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
          userEmail = res.body.email;
          done();
        });
    });
    it('should reset cart', (done) => {
      User.findOne({ email: userEmail })
        .then((userData) => {
          Customer.findOne({ user: userData._id })
            .then((customerData) => {
              Cart.findOne({ customer: customerData._id })

                .then((cart) => {
                  const cartId = cart._id.toString();
                  request(app)
                    .delete(`/api/carts/${cartId}`)
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
  });


  describe('# POST /api/carts/checkout/:cartId - Checkout cart with recurring.', () => {
    let token = null;
    let userEmail = null;
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
          userEmail = res.body.email;
          done();
        });
    });
    it('should check out the cart recurring ', (done) => {
      User.findOne({ email: userEmail })

        .then((userData) => {
          Customer.findOne({ user: userData._id })

            .then((customerData) => {
              Cart.findOne({ customer: customerData._id })

                .then((cart) => {
                  const cartId = cart._id.toString();
                  request(app)
                    .post(`/api/carts/checkout/${cartId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                      startDate: '1/1/2018',
                      orderIntervalType: 'Week',
                      orderFrequency: 3
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
