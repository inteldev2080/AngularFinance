import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';
// import data from './testData.test';
import Category from '../../models/category.model';
import Supplier from '../../models/supplier.model';
import Customer from '../../models/customer.model';
import Product from '../../models/product.model';
import Unit from '../../models/unit.model';


const debug = require('debug')('app:product.test');

chai.config.includeStack = true;

describe('## Products', () => {
  describe('# POST /api/products - Create Product Shrimps.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Seafood' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();

              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'جمبري',
                  englishName: 'Shrimps',
                  arabicDescription: 'جمبري طازج',
                  englishDescription: 'Fresh Shrimps',
                  sku: '12344',
                  store: '3E',
                  shelf: '8',
                  price: '15',
                  images: ['1950cee569d8fcd0ac6e0d7967a2750c', '1950cee569d8fcd0ac6e0d7967a2750c', '1950cee569d8fcd0ac6e0d7967a2750c'],
                  coverPhoto: '1950cee569d8fcd0ac6e0d7967a2750c',
                  status: 'Active'
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
  describe('# POST /api/products - Create Product Fish.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Seafood' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();

              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'سمك',
                  englishName: 'Fish',
                  arabicDescription: 'سمك طازج',
                  englishDescription: 'Fresh Fish',
                  sku: '12344',
                  store: '3E',
                  shelf: '8',
                  price: '15',
                  images: ['1950cee569d8fcd0ac6e0d7967a2750c', '1950cee569d8fcd0ac6e0d7967a2750c', '1950cee569d8fcd0ac6e0d7967a2750c'],
                  coverPhoto: '1950cee569d8fcd0ac6e0d7967a2750c',
                  status: 'Active'
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

  describe('# POST /api/products - Create Product Apple.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Fresh Fruits & Veg.' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();

              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'تفاح',
                  englishName: 'Apple',
                  arabicDescription: 'فاكهة التفاح',
                  englishDescription: 'Apple fruit',
                  sku: '12344',
                  store: '3E',
                  shelf: '8',
                  price: '15',
                  images: ['1950cee569d8fcd0ac6e0d7967a2750c', '1950cee569d8fcd0ac6e0d7967a2750c', '1950cee569d8fcd0ac6e0d7967a2750c'],
                  coverPhoto: '1950cee569d8fcd0ac6e0d7967a2750c',
                  status: 'Active'
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
  describe('# POST /api/products - Create Product Orange.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Fresh Fruits & Veg.' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();

              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'برتقال',
                  englishName: 'Orange',
                  arabicDescription: 'فاكهة البرتقال',
                  englishDescription: 'Orange fruit',
                  sku: '12344',
                  store: '3E',
                  shelf: '8',
                  price: '15',
                  images: ['1950cee569d8fcd0ac6e0d7967a2750c', '1950cee569d8fcd0ac6e0d7967a2750c', '1950cee569d8fcd0ac6e0d7967a2750c'],
                  coverPhoto: '1950cee569d8fcd0ac6e0d7967a2750c',
                  status: 'Active'
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
  describe('# POST /api/products - Create Product Fine Tissue.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Tissue' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id;
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'مناديل',
                  englishName: 'Tissue',
                  arabicDescription: 'مناديل فاين',
                  englishDescription: 'Fine Tissue',
                  sku: '12344',
                  store: '3E',
                  shelf: '8',
                  price: '15',
                  images: ['1950cee569d8fcd0ac6e0d7967a2750c', '1950cee569d8fcd0ac6e0d7967a2750c', '1950cee569d8fcd0ac6e0d7967a2750c'],
                  coverPhoto: '1950cee569d8fcd0ac6e0d7967a2750c',
                  status: 'Active'
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

  describe('# GET /api/products - [Supplier Token] Get all Products.', () => {
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
    it('should get list of products', (done) => {
      request(app)
        .get('/api/products?skip=0&limit=10')
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
  describe('# GET /api/products - [Customer Token] Get all products of specific Supplier.', () => {
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
    it('should get list of products for customer', (done) => {
      Supplier.find({ representativeName: 'zieny\'s supplies' })
        .then((supplier) => {
          const supplierId = supplier.map(c => c._id);

          request(app)
            .get(`/api/products/supplier/${supplierId}?skip=0&limit=10`)
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

  describe('# GET  /api/products/:productId - Get specific product- [Customer Auth].', () => {
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
    it('should get product', (done) => {
      Product.find({ englishName: 'Shrimps' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .get(`/api/products/${productId}?skip=0&limit=10`)
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

  // TODO: Check where problem comes from
  // describe('# PUT /api/products/:productId - Update specific product.', () => {
  //   let token = null;
  //   before((done) => {
  //     request(app)
  //       .post('/api/auth/login')
  //       .send({
  //         username: 'ahmed@indielabs.sa',
  //         password: 'asd12345'
  //       })
  //       .expect(httpStatus.OK)
  //       .end((err, res) => {
  //         token = res.body.token;
  //         done();
  //       });
  //   });
  //   it('should update the product', (done) => {
  //     Product.find({ englishName: 'Shrimps' })
  //       .then((product) => {
  //         const productId = product.map(c => c._id);
  //         Category.find({ englishName: 'Fresh Fruits & Veg.' })
  //           .then((cat) => {
  //             const categoryId = cat.map(c => c._id.toString());
  //             console.log('categoryId', categoryId);
  //             Unit.findOne({ englishName: 'Tonne' })
  //               .then((unit) => {
  //                 const unitId = unit._id.toString();
  //                 console.log('unitId', unitId);
  //                 request(app)
  //                   .put(`/api/products/${productId}`)
  //                   .set('Authorization', `Bearer ${token}`)
  //                   .send({
  //                     unit: unitId,
  //                     categories: categoryId,
  //                     arabicName: 'جمبرى',
  //                     englishName: 'Shrimps',
  //                     arabicDescription: 'جمبرى',
  //                     englishDescription: 'shrimps',
  //                     sku: '12344',
  //                     store: '3E',
  //                     shelf: '8',
  //                     price: '15',
  //                     images: ['1950cee569d8fcd0ac6e0d7967a2750c', '1950cee569d8fcd0ac6e0d7967a2750c', '1950cee569d8fcd0ac6e0d7967a2750c'],
  //                     status: 'Active'
  //                   })
  //                   .end((err, res) => {
  //                     if (err) {
  //                       debug(err);
  //                     } else {
  //                       expect(res.status).to.equal(200);
  //                       expect(res.body.status).to.includes('Success');
  //                     }
  //                     done();
  //                   });
  //               });
  //           });
  //       });
  //   });
  // });

  describe('# DELETE /api/products/:productId - Delete specific product.', () => {
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
    it('should delete product', (done) => {
      Product.find({ englishName: 'Tissue' })
        .then((product) => {
          const productId = product.map(c => c._id);
          request(app)
            .delete(`/api/products/${productId[0]}`)
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

  describe('# GET /api/categories/products/:categoryId - [Supplier Token] Get list of products for category.', () => {
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
    it('should get list of products for category [Supplier]', (done) => {
      Category.find({ englishName: 'Grocery' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          request(app)
            .get(`/api/categories/products/${categoryId}?skip=0&limit=10`)
            .set('Authorization', `Bearer ${token}`)

            .end((err, res) => {
              if (err) {
                debug(err);
              } else {
                expect(res.status).to.equal(200);
                // expect(res.body.data).to.have.length.above(0);
                expect(res.body.status).to.includes('Success');
              }
              done();
            });
        });
    });
  });
  describe('# GET /api/categories/products/:categoryId - [Customer Token] Get list of products for category.', () => {
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
    it('should get list of products for category [Customer]', (done) => {
      Category.find({ englishName: 'Materials Supplies' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          request(app)
            .get(`/api/categories/products/${categoryId}?skip=0&limit=10`)
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

describe('## Special Prices', () => {
  describe('# POST /api/customers/specialPrices - Create a special Prices for a customer.', () => {
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
    it('should be created a special prices for a product for a specific customer  ', (done) => {
      Product.find({ englishName: 'Fish' })
        .then((product) => {
          const productId = product.map(c => c._id);
          Customer.find({ representativeName: 'supplieson customer' })
            .then((customer) => {
              const customerId = customer.map(c => c._id);
              request(app)
                .post('/api/customers/specialPrices')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  productId: productId.toString(),
                  customerId: customerId.toString(),
                  price: '10',

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
  describe('# POST /api/customers/specialPrices - Create a special Prices for a customer.', () => {
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
    it('should be created a special prices for a product for a specific customer  ', (done) => {
      Product.find({ englishName: 'Shrimps' })
        .then((product) => {
          const productId = product.map(c => c._id);
          Customer.find({ representativeName: 'supplieson customer' })
            .then((customer) => {
              const customerId = customer.map(c => c._id);
              request(app)
                .post('/api/customers/specialPrices')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  productId: productId.toString(),
                  customerId: customerId.toString(),
                  price: '10',

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
  describe('# POST /api/customers/specialPrices - Create a special Prices for a customer.', () => {
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
    it('should be created a special prices for a product for a specific customer  ', (done) => {
      Product.find({ englishName: 'Apple' })
        .then((product) => {
          const productId = product.map(c => c._id);
          Customer.find({ representativeName: 'supplieson customer' })
            .then((customer) => {
              const customerId = customer.map(c => c._id);
              request(app)
                .post('/api/customers/specialPrices')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  productId: productId.toString(),
                  customerId: customerId.toString(),
                  price: '10',

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
  describe('# POST /api/customers/specialPrices - Create a special Prices for a customer.', () => {
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
    it('should be created a special prices for a product for a specific customer  ', (done) => {
      Product.find({ englishName: 'Orange' })
        .then((product) => {
          const productId = product.map(c => c._id);
          Customer.find({ representativeName: 'supplieson customer' })
            .then((customer) => {
              const customerId = customer.map(c => c._id);
              request(app)
                .post('/api/customers/specialPrices')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  productId: productId.toString(),
                  customerId: customerId.toString(),
                  price: '10',

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

  describe('# GET /api/customers/specialPrices - Get a list of the created special Prices for a customer.', () => {
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
    it('should get list of the special prices that created before ', (done) => {
      request(app)
                .get('/api/customers/specialPrices')
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

  describe('# PUT /api/customers/specialPrices - Update a special Prices for a customer\'s product.', () => {
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
    it('should be updated a special prices for a product for a specific customer  ', (done) => {
      Product.find({ englishName: 'Fish' })
        .then((product) => {
          const productId = product.map(c => c._id);
          Customer.find({ representativeName: 'supplieson customer' })
            .then((customer) => {
              const customerId = customer.map(c => c._id);
              request(app)
                .put(`/api/customers/specialPrices/${productId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  customerId: customerId.toString(),
                  price: '5'
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

describe('## Products Data Initialization', () => {
  describe('# POST /api/products - Create Product Mo-Product#1.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'الوطنية دجاج كامل',
                  englishName: 'Mo-Product#1',
                  arabicDescription: 'منتج تابع لمحمد ',
                  englishDescription: 'Mo-Product#1',
                  sku: '12301',
                  store: '3M1',
                  shelf: '1',
                  price: '15',
                  images: ['11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44'],
                  coverPhoto: '11579e9f2652b5273b97a5f7fb2b8e44',
                  status: 'Active'

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

  describe('# POST /api/products - Create Product Hish-Product#1.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'جمبرى طازج',
                englishName: 'Hish-Product#1',
                arabicDescription: 'جمبرى طازج',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44'],
                coverPhoto: '11579e9f2652b5273b97a5f7fb2b8e44',
                status: 'Active'
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
  describe('# POST /api/products - Create Product Mo-Product#2.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'جمبرى حجم كبير',
                  englishName: 'Mo-Product#2',
                  arabicDescription: 'جمبرى حجم كبير ',
                  englishDescription: 'Mo-Product#2',
                  sku: '12301',
                  store: '3M1',
                  shelf: '1',
                  price: '15',
                  images: ['11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44'],
                  coverPhoto: '11579e9f2652b5273b97a5f7fb2b8e44',
                  status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#2.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'هادكو دجاج طازج',
                englishName: 'Hish-Product#2',
                arabicDescription: 'هادكو دجاج طازج',
                englishDescription: 'Hish-Product#2',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44'],
                coverPhoto: '11579e9f2652b5273b97a5f7fb2b8e44',
                status: 'Active'
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
  describe('# POST /api/products - Create Product Mo-Product#3.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'دجاج للشواء',
                  englishName: 'Mo-Product#3',
                  arabicDescription: 'دجاج للشواء ',
                  englishDescription: 'Mo-Product#3',
                  sku: '12301',
                  store: '3M1',
                  shelf: '1',
                  price: '15',
                  images: ['11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44'],
                  coverPhoto: '11579e9f2652b5273b97a5f7fb2b8e44',
                  status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#3.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'روبيان مزرعة',
                englishName: 'Hish-Product#3',
                arabicDescription: 'روبيان مزرعة',
                englishDescription: 'Hish-Product#3',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44'],
                coverPhoto: '11579e9f2652b5273b97a5f7fb2b8e44',
                status: 'Active'
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
  describe('# POST /api/products - Create Product Mo-Product#4.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'بطاطس حجم صغير',
                  englishName: 'Mo-Product#4',
                  arabicDescription: 'بطاطس حجم صغير ',
                  englishDescription: 'Mo-Product#4',
                  sku: '12301',
                  store: '3M1',
                  shelf: '1',
                  price: '15',
                  images: ['11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44'],
                  coverPhoto: '11579e9f2652b5273b97a5f7fb2b8e44',
                  status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#4.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'بطاطس حجم كبير',
                englishName: 'Hish-Product#4',
                arabicDescription: 'بطاطس حجم كبير',
                englishDescription: 'Hish-Product#4',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44'],
                coverPhoto: '11579e9f2652b5273b97a5f7fb2b8e44',
                status: 'Active'
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
  describe('# POST /api/products - Create Product Mo-Product#5.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'هامور مسحب طازج',
                  englishName: 'Mo-Product#5',
                  arabicDescription: 'هامور مسحب طازج ',
                  englishDescription: 'Mo-Product#5',
                  sku: '12301',
                  store: '3M1',
                  shelf: '1',
                  price: '15',
                  images: ['11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44'],
                  coverPhoto: '11579e9f2652b5273b97a5f7fb2b8e44',
                  status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#5.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'سمك ناجل',
                englishName: 'Hish-Product#5',
                arabicDescription: 'سمك ناجل',
                englishDescription: 'Hish-Product#5',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44'],
                coverPhoto: '11579e9f2652b5273b97a5f7fb2b8e44',
                status: 'Active'
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
  describe('# POST /api/products - Create Product Mo-Product#6.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'طماطم محلى',
                  arabicName: 'ملفوف أخضر',
                  englishName: 'Mo-Product#6',
                  arabicDescription: 'ملفوف أخضر ',
                  englishDescription: 'Mo-Product#6',
                  sku: '12301',
                  store: '3M1',
                  shelf: '1',
                  price: '15',
                  images: ['11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44'],
                  coverPhoto: '11579e9f2652b5273b97a5f7fb2b8e44',
                  status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#6.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'فاصوليا خضراء',
                englishName: 'Hish-Product#6',
                arabicDescription: 'فاصوليا خضراء',
                englishDescription: 'Hish-Product#6',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44', '11579e9f2652b5273b97a5f7fb2b8e44'],
                coverPhoto: '11579e9f2652b5273b97a5f7fb2b8e44',
                status: 'Active'
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
  describe('# POST /api/products - Create Product Mo-Product#7.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'ثوم',
                  englishName: 'Mo-Product#7',
                  arabicDescription: 'ثوم ',
                  englishDescription: 'Mo-Product#7',
                  sku: '12301',
                  store: '3M1',
                  shelf: '1',
                  price: '15',
                  images: ['d35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814'],
                  coverPhoto: 'd35ec614545dc545b0c1e435cebc7814',
                  status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#7.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'خيار قصير',
                englishName: 'Hish-Product#7',
                arabicDescription: 'خيار قصير',
                englishDescription: 'Hish-Product#7',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['d35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814'],
                coverPhoto: 'd35ec614545dc545b0c1e435cebc7814',
                status: 'Active'
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
  describe('# POST /api/products - Create Product Mo-Product#9.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'طماطم محلى',
                  englishName: 'Mo-Product#9',
                  arabicDescription: 'طماطم محلى ',
                  englishDescription: 'Mo-Product#1',
                  sku: '12301',
                  store: '3M1',
                  shelf: '1',
                  price: '15',
                  images: ['d35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814'],
                  coverPhoto: 'd35ec614545dc545b0c1e435cebc7814',
                  status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#8.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'فراولة',
                englishName: 'Hish-Product#8',
                arabicDescription: 'فراولة',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['d35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814'],
                coverPhoto: 'd35ec614545dc545b0c1e435cebc7814',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#8.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Tonne' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'بصل أبيض كبير الحجم',
                  englishName: 'Mo-Product#8',
                  arabicDescription: 'بصل أبيض كبير الحجم ',
                  englishDescription: 'Mo-Product#1',
                  sku: '12301',
                  store: '3M1',
                  shelf: '1',
                  price: '15',
                  images: ['d35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814'],
                  coverPhoto: 'd35ec614545dc545b0c1e435cebc7814',
                  status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#9.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'جزر مستورد',
                englishName: 'Hish-Product#9',
                arabicDescription: 'جزر مستورد',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['d35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814'],
                coverPhoto: 'd35ec614545dc545b0c1e435cebc7814',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#10.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'خس رومى',
                englishName: 'Mo-Product#10',
                arabicDescription: 'خس رومى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['d35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814'],
                coverPhoto: 'd35ec614545dc545b0c1e435cebc7814',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#10.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مانجة',
                englishName: 'Hish-Product#10',
                arabicDescription: 'مانجة',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['d35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814'],
                coverPhoto: 'd35ec614545dc545b0c1e435cebc7814',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#11.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زنجبيل',
                englishName: 'Mo-Product#11',
                arabicDescription: 'زنجبيل ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['d35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814'],
                coverPhoto: 'd35ec614545dc545b0c1e435cebc7814',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#11.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'لحم بقرى',
                englishName: 'Hish-Product#11',
                arabicDescription: 'لحم بقرى',
                englishDescription: 'Hish-Product#11',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['d35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814', 'd35ec614545dc545b0c1e435cebc7814'],
                coverPhoto: 'd35ec614545dc545b0c1e435cebc7814',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#12.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'عنب ابيض بدون بذور',
                englishName: 'Mo-Product#12',
                arabicDescription: 'عنب ابيض بدون بذور ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34'],
                coverPhoto: '8680d02f33642da175c8d2be256c6e34',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#12.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'لحم بقرى مستورد',
                englishName: 'Hish-Product#12',
                arabicDescription: 'لحم بقرى مستورد',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34'],
                coverPhoto: '8680d02f33642da175c8d2be256c6e34',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#13.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Tonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'تفاح أحمر إيطالى',
                englishName: 'Mo-Product#13',
                arabicDescription: 'تفاح أحمر إيطالى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34'],
                coverPhoto: '8680d02f33642da175c8d2be256c6e34',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#13.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'شمام محلى',
                englishName: 'Hish-Product#13',
                arabicDescription: 'شمام محلى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34'],
                coverPhoto: '8680d02f33642da175c8d2be256c6e34',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#14.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'شمام محلى',
                englishName: 'Mo-Product#14',
                arabicDescription: 'شمام محلى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34'],
                coverPhoto: '8680d02f33642da175c8d2be256c6e34',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#14.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'ليمون',
                englishName: 'Hish-Product#14',
                arabicDescription: 'ليمون',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34'],
                coverPhoto: '8680d02f33642da175c8d2be256c6e34',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#15.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مندرين مغربى',
                englishName: 'Mo-Product#15',
                arabicDescription: 'مندرين مغربى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34'],
                coverPhoto: '8680d02f33642da175c8d2be256c6e34',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#15.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'بن عربى',
                englishName: 'Hish-Product#15',
                arabicDescription: 'بن عربى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34'],
                coverPhoto: '8680d02f33642da175c8d2be256c6e34',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#16.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'تفاح جالا إيطالى',
                englishName: 'Mo-Product#16',
                arabicDescription: 'تفاح جالا إيطالى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34'],
                coverPhoto: '8680d02f33642da175c8d2be256c6e34',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#16.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'بن برازيلى',
                englishName: 'Hish-Product#16',
                arabicDescription: 'بن برازيلى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34'],
                coverPhoto: '8680d02f33642da175c8d2be256c6e34',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#17.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'موز',
                englishName: 'Mo-Product#17',
                arabicDescription: 'موز ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34'],
                coverPhoto: '8680d02f33642da175c8d2be256c6e34',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#17.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'الاسياح دجاج طازج صغير',
                englishName: 'Hish-Product#17',
                arabicDescription: 'الاسياح دجاج طازج صغير',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34', '8680d02f33642da175c8d2be256c6e34'],
                coverPhoto: '8680d02f33642da175c8d2be256c6e34',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#18.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'الوظنية دجاج كامل',
                englishName: 'Mo-Product#18',
                arabicDescription: 'الوظنية دجاج كامل ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#18.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'دجاج الفقيه',
                englishName: 'Hish-Product#18',
                arabicDescription: 'دجاج الفقيه',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#19.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'دجاج مبرد فقيه',
                englishName: 'Mo-Product#19',
                arabicDescription: 'دجاج مبرد فقيه ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#19.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'أرجل دجاج الوطنية',
                englishName: 'Hish-Product#19',
                arabicDescription: 'أرجل دجاج الوطنية',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#20.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'دجاج الوطنية أجنحة',
                englishName: 'Mo-Product#20',
                arabicDescription: 'دجاج الوطنية أجنحة ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#20.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'سمك كنعد كبير',
                englishName: 'Hish-Product#20',
                arabicDescription: 'سمك كنعد كبير',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#21.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'برتقال',
                englishName: 'Mo-Product#21',
                arabicDescription: 'برتقال ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#21.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'طماطم',
                englishName: 'Hish-Product#21',
                arabicDescription: 'طماطم',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#22.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'برتقال مزارع الفلاح',
                englishName: 'Mo-Product#22',
                arabicDescription: 'برتقال مزارع الفلاح ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#22.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'برتقال',
                englishName: 'Hish-Product#22',
                arabicDescription: 'برتقال',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#23.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'جمبرى مزرعة',
                englishName: 'Mo-Product#23',
                arabicDescription: 'جمبرى مزرعة ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#23.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'يوسفى',
                englishName: 'Hish-Product#23',
                arabicDescription: 'يوسفى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#24.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'جمبرى بحرى',
                englishName: 'Mo-Product#24',
                arabicDescription: 'جمبرى بحرى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#24.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'فلفل',
                englishName: 'Hish-Product#24',
                arabicDescription: 'فلفل',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#25.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'فيليه بياض',
                englishName: 'Mo-Product#25',
                arabicDescription: 'فيليه بياض ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product25.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'فلفل أحمر',
                englishName: 'Hish-Product#25',
                arabicDescription: 'فلفل أحمر',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165', '9e295afbd074c5aa35a62f00b9da9165'],
                coverPhoto: '9e295afbd074c5aa35a62f00b9da9165',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#26.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'كنعد',
                englishName: 'Mo-Product#26',
                arabicDescription: 'كنعد ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#26.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'فلفل اخضر',
                englishName: 'Hish-Product#26',
                arabicDescription: 'فلفل اخضر',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#27.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'كابوريا مشكل',
                englishName: 'Mo-Product#27',
                arabicDescription: 'كابوريا مشكل ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#27.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'فلفل أصفر',
                englishName: 'Hish-Product#27',
                arabicDescription: 'فلفل أصفر',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#28.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'باغة',
                englishName: 'Mo-Product#28',
                arabicDescription: 'باغة ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#28.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'فلفل ألوان متعددة',
                englishName: 'Hish-Product#28',
                arabicDescription: 'فلفل ألوان متعددة',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#29.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مانجة',
                englishName: 'Mo-Product#29',
                arabicDescription: 'مانجة ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#29.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'كوسة حجم كبير',
                englishName: 'Hish-Product#29',
                arabicDescription: 'كوسة حجم كبير',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#30.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'كوسة',
                englishName: 'Mo-Product#30',
                arabicDescription: 'كوسة ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#30.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'ملوخية خضراء',
                englishName: 'Hish-Product#30',
                arabicDescription: 'ملوخية خضراء',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#31.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'خوخ محلى',
                englishName: 'Mo-Product#31',
                arabicDescription: 'خوخ محلى',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#31.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'بصل أحمر',
                englishName: 'Hish-Product#31',
                arabicDescription: 'بصل أحمر',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#32.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'خوخ',
                englishName: 'Mo-Product#32',
                arabicDescription: 'خوخ ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#32.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'KiloTonne' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'قرع',
                englishName: 'Hish-Product#32',
                arabicDescription: 'قرع',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#33.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'يوسفى',
                englishName: 'Mo-Product#33',
                arabicDescription: 'يوسفى طبيعى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#33.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'شمام محلى',
                englishName: 'Hish-Product#33',
                arabicDescription: 'شمام محلى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#34', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'تفاح فوجى',
                englishName: 'Mo-Product#34',
                arabicDescription: 'تفاح فوجى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#34.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'بطيخ طويل',
                englishName: 'Hish-Product#34',
                arabicDescription: 'بطيخ طويل',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#35.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'يوسفى باكستانى',
                englishName: 'Mo-Product#35',
                arabicDescription: 'يوسفى باكستانى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#35.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'أبو فروة',
                englishName: 'Hish-Product#35',
                arabicDescription: 'أبو فروة',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#36.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'برتفال للعصير',
                englishName: 'Mo-Product#36',
                arabicDescription: 'برتفال للعصير ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#36.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'فراولة مصرى',
                englishName: 'Hish-Product#36',
                arabicDescription: 'فراولة مصرى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#37.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'كمثرى صينى',
                englishName: 'Mo-Product#37',
                arabicDescription: 'كمثرى صينى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#37.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'أناناس',
                englishName: 'Hish-Product#37',
                arabicDescription: 'أناناس',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#38.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'كمثرى أسبانى',
                englishName: 'Mo-Product#38',
                arabicDescription: 'كمثرى أسبانى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#38.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'عنب أسود',
                englishName: 'Hish-Product#38',
                arabicDescription: 'عنب أسود',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#39.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'فلفل حار',
                englishName: 'Mo-Product#39',
                arabicDescription: 'فلفل حار ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20', '47d02727017b21e5cd973c7aabc31a20'],
                coverPhoto: '47d02727017b21e5cd973c7aabc31a20',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#39.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مانجو أفريقى',
                englishName: 'Hish-Product#39',
                arabicDescription: 'مانجو أفريقى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#40.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'بطيخ مدور',
                englishName: 'Mo-Product#40',
                arabicDescription: 'بطيخ مدور ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#40.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'باذنجان',
                englishName: 'Hish-Product#40',
                arabicDescription: 'باذنجان',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#41.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'فلفل أحمر',
                englishName: 'Mo-Product#41',
                arabicDescription: 'فلفل أحمر ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#41.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'كابوتشا بنفسجى',
                englishName: 'Hish-Product#41',
                arabicDescription: 'كابوتشا بنفسجى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#42.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'بصل جامبو أبيض',
                englishName: 'Mo-Product#41',
                arabicDescription: 'بصل جامبو أبيض ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#42.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'كابوتشا خضراء',
                englishName: 'Hish-Product#42',
                arabicDescription: 'كابوتشا خضراء',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#43.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'كرز صندوق صغير',
                englishName: 'Mo-Product#43',
                arabicDescription: 'كرز صندوق صغير ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#43.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مشمش صندوق صغير',
                englishName: 'Hish-Product#43',
                arabicDescription: 'مشمش صندوق صغير',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#44.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'خيار جرين هاوس',
                englishName: 'Mo-Product#44',
                arabicDescription: 'خيار جرين هاوس ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#44.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مانجو باكستانى',
                englishName: 'Hish-Product#44',
                arabicDescription: 'مانجو باكستانى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#45.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'أفوكادو',
                englishName: 'Mo-Product#45',
                arabicDescription: 'أفوكادو ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#45.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'ملفوف أحمر',
                englishName: 'Hish-Product#45',
                arabicDescription: 'ملفوف أحمر',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#46.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'رمان يمنى',
                englishName: 'Mo-Product#46',
                arabicDescription: 'رمان يمنى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#46.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'جوافة للكيلو',
                englishName: 'Hish-Product#46',
                arabicDescription: 'جوافة للكيلو',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#47.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'جوافة',
                englishName: 'Mo-Product#47',
                arabicDescription: 'جوافة ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#47.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مندرين أفريقى',
                englishName: 'Hish-Product#47',
                arabicDescription: 'مندرين أفريقى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#48.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'ليمون بدون بذور',
                englishName: 'Mo-Product#48',
                arabicDescription: 'ليمون بدون بذور ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#48.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'بخارى',
                englishName: 'Hish-Product#48',
                arabicDescription: 'بخارى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#49.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مانجو مصرى',
                englishName: 'Mo-Product#49',
                arabicDescription: 'مانجو مصرى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87', '1ec5cce2a1827cdf0a61ac118e23ec87'],
                coverPhoto: '1ec5cce2a1827cdf0a61ac118e23ec87',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#49.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'ذرة',
                englishName: 'Hish-Product#49',
                arabicDescription: 'ذرة',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#50.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'جزر صينى',
                englishName: 'Mo-Product#50',
                arabicDescription: 'جزر صينى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#50.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'تفاح جولد صينى',
                englishName: 'Hish-Product#50',
                arabicDescription: 'تفاح جولد صينى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#51.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'ليمون صندوق صغير',
                englishName: 'Mo-Product#51',
                arabicDescription: 'ليمون صندوق صغير ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#51.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'ليمون لمنتج العصائر',
                englishName: 'Hish-Product#51',
                arabicDescription: 'ليمون لمنتج العصائر',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#52.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'تفاح جولد ايطالى',
                englishName: 'Mo-Product#52',
                arabicDescription: 'تفاح جولد ايطالى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#52.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'تفاح أخضر إيطالى',
                englishName: 'Hish-Product#52',
                arabicDescription: 'تفاح أخضر إيطالى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#53.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'جوز الهند',
                englishName: 'Mo-Product#53',
                arabicDescription: 'جوز الهند ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#53.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'برتقال ابو صرة',
                englishName: 'Hish-Product#1',
                arabicDescription: 'برتقال ابو صرة',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#54.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'نكتارين',
                englishName: 'Mo-Product#54',
                arabicDescription: 'نكتارين ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#54.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'جرجير',
                englishName: 'Hish-Product#54',
                arabicDescription: 'جرجير',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#55.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'لوز أخضر لبنانى',
                englishName: 'Mo-Product#55',
                arabicDescription: 'لوز أخضر لبنانى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#55.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'كزبرة',
                englishName: 'Hish-Product#55',
                arabicDescription: 'كزبرة',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#56.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مانجو يمنى',
                englishName: 'Mo-Product#56',
                arabicDescription: 'مانجو يمنى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#56.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'عشب طبيعى',
                englishName: 'Hish-Product#56',
                arabicDescription: 'عشب طبيعى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#57.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مانجو سماكا',
                englishName: 'Mo-Product#57',
                arabicDescription: 'مانجو سماكا ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#57.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'عشب صناعى',
                englishName: 'Hish-Product#57',
                arabicDescription: 'عشب صناعى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#58.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'رمان هندى',
                englishName: 'Mo-Product#58',
                arabicDescription: 'رمان هندى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#58.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'خوخ كعب غزال أردنى ',
                englishName: 'Hish-Product#58',
                arabicDescription: 'خوخ كعب غزال أردنى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#59.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'عنب أبيض',
                englishName: 'Mo-Product#59',
                arabicDescription: 'عنب أبيض ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#59.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مندرين مستورد',
                englishName: 'Hish-Product#59',
                arabicDescription: 'مندرين مستورد',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0', 'cff0b4960b41e053e457d45c754247b0'],
                coverPhoto: 'cff0b4960b41e053e457d45c754247b0',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#60.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'بطاطس محلى',
                englishName: 'Mo-Product#60',
                arabicDescription: 'بطاطس محلى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#60.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون أسود مصرى',
                englishName: 'Hish-Product#60',
                arabicDescription: 'زيتون أسود مصرى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#61.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مرتديلا بقرى أمريكانا',
                englishName: 'Mo-Product#61',
                arabicDescription: 'مرتديلا بقرى أمريكانا ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#61.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'لبنة تركية السنبلة',
                englishName: 'Hish-Product#61',
                arabicDescription: 'لبنة تركية السنبلة',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#62.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مرتديلا دجاج حلوانى',
                englishName: 'Mo-Product#62',
                arabicDescription: 'مرتديلا دجاج حلوانى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#62.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون لبنانى',
                englishName: 'Hish-Product#62',
                arabicDescription: 'زيتون لبنانى',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#63.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مرتديلا بقرى نبيل',
                englishName: 'Mo-Product#63',
                arabicDescription: 'مرتديلا بقرى نبيل ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#63.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون أخضر',
                englishName: 'Hish-Product#63',
                arabicDescription: 'زيتون أخضر',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#64.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'شاى أحمر',
                englishName: 'Mo-Product#64',
                arabicDescription: 'شاى أحمر ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#64.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'جبنة فايتا',
                englishName: 'Hish-Product#64',
                arabicDescription: 'جبنة فايتا',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#65.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'شاى أخضر',
                englishName: 'Mo-Product#65',
                arabicDescription: 'شاى أخضر ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#65.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'جبنة قريش منزوعة',
                englishName: 'Hish-Product#65',
                arabicDescription: 'جبنة قريش منزوعة',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#66.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'شاى أخضر',
                englishName: 'Mo-Product#66',
                arabicDescription: 'شاى أخضر ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#66.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'حلاوة طحينية بالفسدق',
                englishName: 'Hish-Product#66',
                arabicDescription: 'حلاوة طحينية بالفسدق',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#67.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'نعناع',
                englishName: 'Mo-Product#67',
                arabicDescription: 'نعناع أراضى زراعية ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#67.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'حلاوة طجينية سادة',
                englishName: 'Hish-Product#67',
                arabicDescription: 'حلاوة طجينية سادة',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#68.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون أخضر شرائح',
                englishName: 'Mo-Product#68',
                arabicDescription: 'زيتون أخضر شرائح ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#68.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون أسود شرائح',
                englishName: 'Hish-Product#68',
                arabicDescription: 'زيتون أسود شرائح',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#69.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون أسود كوبوليفا ',
                englishName: 'Mo-Product#69',
                arabicDescription: 'زيتون أسود كوبوليفا ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725', '9f9c13d8fc929ba3fd8e6463be001725'],
                coverPhoto: '9f9c13d8fc929ba3fd8e6463be001725',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#69.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون أخضر كوبوليفا ',
                englishName: 'Hish-Product#69',
                arabicDescription: 'زيتون أخضر كوبوليفا',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#70.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون لبنانى',
                englishName: 'Mo-Product#70',
                arabicDescription: 'زيتون لبنانى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#70.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون أخضر ماموث',
                englishName: 'Hish-Product#70',
                arabicDescription: 'زيتون أخضر ماموث',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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
  describe('# POST /api/products - Create Product Mo-Product#71.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون كالاماتا',
                englishName: 'Mo-Product#71',
                arabicDescription: 'زيتون كالاماتا حجم طبيعى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#71.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون كالاماتا حجم كبير',
                englishName: 'Hish-Product#71',
                arabicDescription: 'زيتون كالاماتا حجم كبير',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#72.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'قمح مستورد',
                englishName: 'Mo-Product#72',
                arabicDescription: 'قمح مستورد',
                englishDescription: 'Mo-Product#2',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#72.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'قمح محلى',
                englishName: 'Hish-Product#72',
                arabicDescription: 'قمح محلى',
                englishDescription: 'Hish-Product#2',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#73.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'ذرة أصفر',
                englishName: 'Mo-Product#73',
                arabicDescription: 'ذرة أصفر ',
                englishDescription: 'Mo-Product#3',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#73.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'ذرة أبيض',
                englishName: 'Hish-Product#73',
                arabicDescription: 'ذرة أبيض',
                englishDescription: 'Hish-Product#3',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#74.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون أخضر الطيبات',
                englishName: 'Mo-Product#74',
                arabicDescription: 'زيتون أخضر الطيبات ',
                englishDescription: 'Mo-Product#4',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#74.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون أخضر كوبوليفا',
                englishName: 'Hish-Product#74',
                arabicDescription: 'زيتون أخضر كوبوليفا',
                englishDescription: 'Hish-Product#4',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#75.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون أخضر كوبوليفا شرائح',
                englishName: 'Mo-Product#75',
                arabicDescription: 'زيتون أخضر كوبوليفا شرائح ',
                englishDescription: 'Mo-Product#5',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#75.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'سكر أبيض ناعم',
                englishName: 'Hish-Product#75',
                arabicDescription: 'سكر أبيض ناعم',
                englishDescription: 'Hish-Product#5',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#76.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مرجان',
                englishName: 'Mo-Product#76',
                arabicDescription: 'مرجان ',
                englishDescription: 'Mo-Product#6',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#76.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'نغرور',
                englishName: 'Hish-Product#76',
                arabicDescription: 'نغرور',
                englishDescription: 'Hish-Product#6',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#77.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'قاروس',
                englishName: 'Mo-Product#77',
                arabicDescription: 'قاروس ',
                englishDescription: 'Mo-Product#7',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#77.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'تين شوكى',
                englishName: 'Hish-Product#77',
                arabicDescription: 'تين شوكى',
                englishDescription: 'Hish-Product#7',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#78.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'فيليه سمك',
                englishName: 'Mo-Product#78',
                arabicDescription: 'فيليه سمك ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#78.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مكرونة باستا',
                englishName: 'Hish-Product#78',
                arabicDescription: 'مكرونة باستا',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#79.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'بن عربى',
                englishName: 'Mo-Product#79',
                arabicDescription: 'بن عربى ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#79.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'مكرونة عادية',
                englishName: 'Hish-Product#79',
                arabicDescription: 'مكرونة سهلة الاستخدام',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#80.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'قشطة طازجة الطيب',
                englishName: 'Mo-Product#80',
                arabicDescription: 'قشطة طازجة الطيب ',
                englishDescription: 'Mo-Product#1',
                sku: '12301',
                store: '3M1',
                shelf: '1',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#80.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
          .select({ _id: 1 })
          .then((cat) => {
            const categoryId = cat.map(c => c._id);
            Unit.findOne({ englishName: 'Kilogram' })
              .then((unit) => {
                const unitId = unit._id.toString();
                request(app)
              .post('/api/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                unit: unitId,
                categories: categoryId,
                arabicName: 'زيتون يونانى حجم كبير',
                englishName: 'Hish-Product#80',
                arabicDescription: 'زيتون يونانى حجم كبير',
                englishDescription: 'Hish-Product#1',
                sku: '12401',
                store: '3H1',
                shelf: '2',
                price: '15',
                images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#81.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Kilogram' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'مرتديلا بقرى حلوانى',
                  englishName: 'Mo-Product#81',
                  arabicDescription: 'مرتديلا بقرى حلوانى ',
                  englishDescription: 'Mo-Product#1',
                  sku: '12301',
                  store: '3M1',
                  shelf: '1',
                  price: '15',
                  images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                  coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                  status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#81.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Kilogram' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'فراولة مصرى',
                  englishName: 'Hish-Product#81',
                  arabicDescription: 'فراولة مصرى',
                  englishDescription: 'Hish-Product#1',
                  sku: '12401',
                  store: '3H1',
                  shelf: '2',
                  price: '15',
                  images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                  coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                  status: 'Active'
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

  describe('# POST /api/products - Create Product Mo-Product#82.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Kilogram' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'جبن أبيض ملح خفيف',
                  englishName: 'Mo-Product#82',
                  arabicDescription: 'جبن أبيض ملح خفيف ',
                  englishDescription: 'Mo-Product#1',
                  sku: '12301',
                  store: '3M1',
                  shelf: '1',
                  price: '15',
                  images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                  coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                  status: 'Active'
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

  describe('# POST /api/products - Create Product Hish-Product#82.', () => {
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
    it('should be created new product', (done) => {
      Category.find({ englishName: 'Misc Sub-Section 2' })
        .select({ _id: 1 })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          Unit.findOne({ englishName: 'Kilogram' })
            .then((unit) => {
              const unitId = unit._id.toString();
              request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  unit: unitId,
                  categories: categoryId,
                  arabicName: 'بيض أبيض صفوة',
                  englishName: 'Hish-Product#82',
                  arabicDescription: 'بيض أبيض صفوة',
                  englishDescription: 'Hish-Product#1',
                  sku: '12401',
                  store: '3H1',
                  shelf: '2',
                  price: '15',
                  images: ['5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3', '5fffd9a0c6533bfcdb4f1d6410ba1de3'],
                  coverPhoto: '5fffd9a0c6533bfcdb4f1d6410ba1de3',
                  status: 'Active'
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
