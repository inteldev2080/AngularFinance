import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';
import Category from '../../models/category.model';

const debug = require('debug')('app:category.test');

chai.config.includeStack = true;

describe('## Categories', () => {
  describe('# POST /api/categories - Create categories and subcategories.', () => {
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
    it('should return created category Fresh Food', (done) => {
      request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          arabicName: 'مأكولات طازجة',
          englishName: 'Fresh Food',
          status: 'Active'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          }
          done();
        });
    });
    it('should return created category Grocery', (done) => {
      request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          arabicName: 'مواد غذائية',
          englishName: 'Grocery',
          status: 'Active'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          }
          done();
        });
    });
    it('should return created category Materials Supplies', (done) => {
      request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          arabicName: 'مستلزمات مطاعم',
          englishName: 'Materials Supplies',
          status: 'Active'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          }
          done();
        });
    });
    it('should return created category Games', (done) => {
      request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          arabicName: 'ألعاب',
          englishName: 'Games',
          status: 'Active'
        })
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          }
          done();
        });
    });
    it('should return created subcategory Fresh Meats', (done) => {
      Category.findOne({ englishName: 'Fresh Food' })
        .then((cat) => {
          request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
              parentCategory: cat._id,
              arabicName: 'لحوم طازجة',
              englishName: 'Fresh Meats',
              status: 'Active'
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
    it('should return created subcategory Seafood', (done) => {
      Category.findOne({ englishName: 'Fresh Food' })
        .then((cat) => {
          request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
              parentCategory: cat._id,
              arabicName: 'مأكولات بحرية',
              englishName: 'Seafood',
              status: 'Active'
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
    it('should return created subcategory Fresh Fruits & Veg.', (done) => {
      Category.findOne({ englishName: 'Fresh Food' })
        .then((cat) => {
          request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
              parentCategory: cat._id,
              arabicName: 'خضراوات وفواكه طازجة',
              englishName: 'Fresh Fruits & Veg.',
              status: 'Active'
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
    it('should return created subcategory Frozen Food', (done) => {
      Category.findOne({ englishName: 'Grocery' })
        .then((cat) => {
          request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
              parentCategory: cat._id,
              arabicName: 'أطعمة مجمدة',
              englishName: 'Frozen Food',
              status: 'Active'
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
    it('should return created subcategory Oils', (done) => {
      Category.findOne({ englishName: 'Grocery' })
        .then((cat) => {
          request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
              parentCategory: cat._id,
              arabicName: 'زيوت للطبخ',
              englishName: 'Oils',
              status: 'Active'
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
    it('should return created subcategory Soup', (done) => {
      Category.findOne({ englishName: 'Grocery' })
        .then((cat) => {
          request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
              parentCategory: cat._id,
              arabicName: 'شوربة',
              englishName: 'Soup',
              status: 'Active'
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
    it('should return created subcategory Plastic Materials', (done) => {
      Category.findOne({ englishName: 'Materials Supplies' })
        .then((cat) => {
          request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
              parentCategory: cat._id,
              arabicName: 'مواد بلاستيكية',
              englishName: 'Plastic Materials',
              status: 'Active'
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
    it('should return created subcategory Cleaning Supplies', (done) => {
      Category.findOne({ englishName: 'Materials Supplies' })
        .then((cat) => {
          request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
              parentCategory: cat._id,
              arabicName: 'لوازم تنظيف متنوعة',
              englishName: 'Cleaning Supplies',
              status: 'Active'
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
    it('should return created subcategory Tissue', (done) => {
      Category.findOne({ englishName: 'Materials Supplies' })
        .then((cat) => {
          request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
              parentCategory: cat._id,
              arabicName: 'مناديل',
              englishName: 'Tissue',
              status: 'Active'
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

  describe('# GET /api/categories (Supplier) - Get All Categories.', () => {
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
    it('should get list of categories', (done) => {
      request(app)
        .get('/api/categories?skip=0&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(httpStatus.OK)
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          }
          done();
        });
    });
  });
  describe('# GET /api/categories/:categoryId (Supplier) - Get specific category.', () => {
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
    it('should get specific category by Id', (done) => {
      Category.find({ englishName: 'Grocery' })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          request(app)
            .get(`/api/categories/${categoryId}`)
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
  describe('# GET /api/categories (Customer) - Get All Categories.', () => {
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
    it('should get list of categories', (done) => {
      request(app)
        .get('/api/categories?skip=0&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(httpStatus.OK)
        .end((err, res) => {
          if (err) { debug(err); } else {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.includes('Success');
          }
          done();
        });
    });
  });
  describe('# GET /api/categories/:categoryId (Customer) - Get specific category.', () => {
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
    it('should get specific category by Id', (done) => {
      Category.find({ englishName: 'Grocery' })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          request(app)
            .get(`/api/categories/${categoryId}`)
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

  describe('# PUT /api/categories/:categoryId - Update category (Games).', () => {
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
    it('should update category', (done) => {
      Category.find({ englishName: 'Games' })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          request(app)
            .put(`/api/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              arabicName: 'ألعاب رقمية',
              englishName: 'Video Games',
              status: 'Active'
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

  describe('# DELETE /api/categories/:categoryId - Delete category (Games).', () => {
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
    it('should delete category', (done) => {
      Category.find({ englishName: 'Video Games' })
        .then((cat) => {
          const categoryId = cat.map(c => c._id);
          request(app)
            .delete(`/api/categories/${categoryId}`)
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

  describe('## Categories Data Initialization', () => {
    describe('# POST /api/categories - Create categories and subcategories.', () => {
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

      it('should return created category Mo-Category#1', (done) => {
        request(app)
          .post('/api/categories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            arabicName: 'قسم للمنوعات',
            englishName: 'Misc Section',
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
      it('should return created category Hish-Category#1', (done) => {
        request(app)
          .post('/api/categories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            arabicName: 'قسم منوعات 2',
            englishName: 'Misc Section 2',
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

      it('should return created subcategory Mo-Sub-Category#1', (done) => {
        Category.findOne({ englishName: 'Misc Section' })
          .then((cat) => {
            request(app)
              .post('/api/categories')
              .set('Authorization', `Bearer ${token}`)
              .send({
                parentCategory: cat._id,
                arabicName: 'قسم منوعات داخلى ',
                englishName: 'Misc Sub-Section',
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
      it('should return created subcategory Hish-Sub-Category#1', (done) => {
        Category.findOne({ englishName: 'Misc Section 2' })
          .then((cat) => {
            request(app)
              .post('/api/categories')
              .set('Authorization', `Bearer ${token}`)
              .send({
                parentCategory: cat._id,
                arabicName: 'قسم منوعات داخلى 2',
                englishName: 'Misc Sub-Section 2',
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
