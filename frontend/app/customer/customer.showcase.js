import Showcaser from 'showcaser';
import angular from 'angular';

let showcaseOptions = {};

function categoryShowcase() {
    showcaseOptions = {
        backgroundColor: {
            r: 0,
            g: 132,
            b: 10,
            a: 0.75
        },
        shape: 'rectangle'
    };
    Showcaser.showcase('category');
    const message = 'select the category you want to order from its products ';
    const element = document.getElementById('cat1');
    Showcaser.showcase(message, element, showcaseOptions);
}

function cartShowcase() {
    showcaseOptions = {
        backgroundColor: {
            r: 0,
            g: 132,
            b: 10,
            a: 0.75
        },
        shape: 'rectangle'
    };
    Showcaser.showcase('cart');
    const message = ' check products added to cart from here ';
    const element = angular.element(document.getElementById('cart-btn'));
    Showcaser.showcase(message, element, showcaseOptions);
}

function profileShowcase() {
    showcaseOptions = {
        backgroundColor: {
            r: 0,
            g: 132,
            b: 10,
            a: 0.75
        },
        shape: 'rectangle'
    };
    Showcaser.showcase('profile');
    const message = ' add cover photo from here ';
    const element = document.querySelector('#cart5');
    Showcaser.showcase(message, element, showcaseOptions);
}

module.exports = {
    categoryShowcase,
    cartShowcase,
    profileShowcase
};

