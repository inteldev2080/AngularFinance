// TODO : use this references in requires array
import angular from 'angular'; // eslint-disable-line
import 'angular-messages';
import 'ui-select';
import 'angular-sanitize';
import angularCookie from 'angular-cookie'; // eslint-disable-line
import angularUiRouter from 'angular-ui-router'; // eslint-disable-line
import angularResource from 'angular-resource'; // eslint-disable-line
import angularFilter from 'angular-filter'; // eslint-disable-line
// import angularUiTinymce from 'angular-ui-tinymce'; // eslint-disable-line
import oclazyload from 'oclazyload'; // eslint-disable-line
import 'angular-breadcrumb'; // eslint-disable-line
import 'checklist-model';
import 'angular-google-places-autocomplete';
import 'ng-notifications-bar';
import 'ngmap';
import 'ng-map-autocomplete';
import modal from 'angular-ui-bootstrap/src/modal/index-nocss';
import 'angular-animate';
import 'angular-file-upload';
import 'ng-file-upload';
import 'angular-ui-bootstrap';
import 'angular-base64';
import 'moment';
import 'moment/locale/ar';
import 'angular-moment';
import 'angular-swx-session-storage/release/swx-session-storage.min';

import { permission, uiPermission } from 'angular-permission';
import runConfig from './app.run';
import appConfig from './app.route';
import './auth/auth.module';
import './admin/admin.module';
import './customer/customer.module';
import './supplier/supplier.module';
import './website/website.module';
import './services/services.module';
import './components/component.module';
import './components/translate.module';

import lazyLoadConfig from './config.lazyload';

// Create and bootstrap application
const requires = [
    'ui.router',
    'angular.filter',
    modal,
    'app.servicesModule',
    'app.authModule',
    'app.adminModule',
    'app.customerModule',
    'app.supplierModule',
    'app.websiteModule',
    'app.componentsModule',
    'app.translateModule',
    'oc.lazyLoad',
    'ngMap',
    'ngMapAutocomplete',
    'google.places',
    'checklist-model',
    'ngNotificationsBar',
    'ngMessages',
    'ncy-angular-breadcrumb',
    'angularFileUpload',
    'ngFileUpload',
    'ngSanitize',
    'ui.select',
    'ui.bootstrap',
    'base64',
    permission,
    uiPermission,
    'angularMoment',
    'swxSessionStorage',
    'ngAnimate'
];

const app = angular.module('app', requires);

app.run(runConfig);
app.config(appConfig);
app.config(lazyLoadConfig);

export default app;
