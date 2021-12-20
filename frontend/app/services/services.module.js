/* eslint-disable no-param-reassign */
import angular from 'angular';
import UserService from './user.service';
import JwtService from './jwt.service';
import SupplierService from './supplier.service';
import InventoryService from './inventories.service';
import RecipeService from './recipe.service';
import CustomerService from './customer.service';
import AdminService from './admin.service';
import RoleService from './role.service';
import CartService from './cart.service';
import CategoryService from './category.service';
import ProductService from './product.service';
import OrderService from './order.service';
import PaymentService from './payment.service';
import TransactionsService from './transactions.service';
import ForgetPasswordService from './forgot-password.service';
import ContactService from './contact.service';
import SystemService from './system.service';
import BranchService from './branch.service';

const production = 'https://supplieson.com';
const staging = 'http://dev.supplieson.com'; // 'http://dev.supplieson.com';
const testEnv = 'http://167.71.169.109';
const development = 'http://localhost:3000';
const dante = "http://192.168.107.183:3000";

const host = dante;
// const host = production;

const servicesModule = angular.module('app.servicesModule', []);
console.log('host', host);
servicesModule.constant('AppConstants', {
    api: `${host}/api`,
    googleMapsUrl:
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAVyrPpRVpBYwmDTYzZk0v0hp7B3KuhKpc?libraries=places',
    JwtKey: 'JwtKey',
    UPLOAD_URL: `${host}/api/upload/image`,
});
servicesModule.service('UserService', UserService);
servicesModule.service('JwtService', JwtService);
servicesModule.service('SupplierService', SupplierService);
servicesModule.service('InventoryService', InventoryService);
servicesModule.service('RecipeService', RecipeService);
servicesModule.service('CustomerService', CustomerService);
servicesModule.service('AdminService', AdminService);
servicesModule.service('RoleService', RoleService);
servicesModule.service('CartService', CartService);
servicesModule.service('CategoryService', CategoryService);
servicesModule.service('ProductService', ProductService);
servicesModule.service('OrderService', OrderService);
servicesModule.service('PaymentService', PaymentService);
servicesModule.service('TransactionsService', TransactionsService);
servicesModule.service('ForgetPasswordService', ForgetPasswordService);
servicesModule.service('ContactService', ContactService);
servicesModule.service('SystemService', SystemService);
servicesModule.service('BranchService', BranchService);
servicesModule.factory('RetryRequest', [
    '$http',
    '$q',
    '$rootScope',
    '$window',
    function ($http, $q, $rootScope, $window) {
        $rootScope.online = navigator.onLine;
        $window.addEventListener(
            'offline',
            () => {
                $rootScope.$apply(() => {
                    $rootScope.online = false;
                });
            },
            false
        );
        $window.addEventListener(
            'online',
            () => {
                $rootScope.$apply(() => {
                    $rootScope.online = true;
                });
            },
            false
        );
        return function (req) {
            const MAX_REQUESTS = 3;
            let counter = 1;
            const results = $q.defer();
            const request = () => {
                $http(req)
                    .then(
                        (response) => {
                            results.resolve(response);
                        },
                        (err) => {
                            /*  if (err.data === 'Unauthorized') {
                                            $('body')
                                                .pgNotification({
                                                    style: 'bar',
                                                    message: 'Sorry,You are not Authorized to access this',
                                                    position: 'top',
                                                    timeout: 5000,
                                                    type: 'danger'
                                                })
                                                .show();
                                        }*/
                            results.reject(err);
                        }
                    )
                    .catch(() => {
                        if ($rootScope.online) {
                            if (counter < MAX_REQUESTS) {
                                request();
                                counter += 1;
                            } else {
                                results.reject({
                                    code: 500,
                                    message: 'Could not load after multiple tries',
                                });
                            }
                        } else {
                            results.reject({code: 501, message: 'No Internet Connection'});
                        }
                    });
            };
            request();
            return results.promise;
        };
    },
]);

export default servicesModule;
