import angular from 'angular';
import websiteConfig from './website.route';
import FeedbackCtrl from './website.feedback.controller';
import WebsiteCtrl from './website.controller';
import SlidesCtrl from './website.slides.controller';
import PageCtrl from './website.page.controller';

const websiteModule = angular.module('app.websiteModule', []);

websiteModule.config(websiteConfig);
websiteModule.controller('FeedbackCtrl', FeedbackCtrl);
websiteModule.controller('WebsiteCtrl', WebsiteCtrl);
websiteModule.controller('SlidesCtrl', SlidesCtrl);
websiteModule.controller('PageCtrl', PageCtrl);


export default websiteModule;
