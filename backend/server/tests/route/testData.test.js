import request from 'supertest-as-promised';
import app from '../../../index';

const debug = require('debug')('app:product.test');

// function get(){}
function post(api, token, data, done) {
  request(app)
    .post(api)
    .set('Authorization', `Bearer ${token}`)
    .send(data)
    .end((err, res) => {
      if (err) {
        debug(err);
      } else {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.includes('Success');
      }
      done();
    });
} // 'Authorization', `Bearer ${token1}`, '/api/products'
// function put(){}
// function list(){}

module.exports = {
  // get,
  post,
  // put,
  // list,
  productsData: [
    {
      unit: '',
      categories: '',
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
    },
    {
      unit: '',
      categories: '',
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
    },
    {
      unit: '',
      categories: '',
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
    },
    {
      unit: '',
      categories: '',
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
    },
    {
      unit: '',
      categories: '',
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
    },
    {
      unit: '',
      categories: '',
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
    },
    {
      unit: '',
      categories: '',
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
    },
    {
      unit: '',
      categories: '',
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
    },
    {
      unit: '',
      categories: '',
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
    },
    {
      unit: '',
      categories: '',
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
    }
  ]
};
