import angular from 'angular';
import authConfig from './auth.route';
import AuthCtrl from './auth.controller';
import '../services/services.module';
import RegisterSupplierCtrl from './register/supplier/registerSupplier.controller';
import RegisterCustomerCtrl from './register/customer/registerCustomer.controller';
import ForgotPasswordCtrl from './forgotPassword/forgot-password.controller';
import ResetPasswordCtrl from './resetPassword/reset-password.controller';
import LoginCtrl from './login/login.controller';


// Create the auth module where our functionality can attach to
const authModule = angular.module('app.authModule', ['oc.lazyLoad', 'willcrisis.angular-select2']);

// Include our UI-Router config settings
authModule.config(authConfig)
    .controller('AuthCtrl', AuthCtrl)
    .controller('RegisterSupplierCtrl', RegisterSupplierCtrl)
    .controller('RegisterCustomerCtrl', RegisterCustomerCtrl)
    .controller('ForgotPasswordCtrl', ForgotPasswordCtrl)
    .controller('ResetPasswordCtrl', ResetPasswordCtrl)
    .controller('LoginCtrl', LoginCtrl);
export default authModule;
