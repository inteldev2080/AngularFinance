import SupplierRecipesListCtrl from "../recipes-items-list/recipesList.controller";

export default class SupplierRecipesItemDetailCtrl {
    constructor(
        RecipesItemService,
        $stateParams,
        $translate,
        $rootScope,
        PermPermissionStore
    ) {
        this._RecipesItemService = RecipesItemService;
        // this._TransactionsService = TransactionsService;
        this.$stateParams = $stateParams;
        this._$rootScope = $rootScope;
        this.$translate = $translate;
        this.PermPermissionStore = PermPermissionStore;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        const permissions = this.PermPermissionStore.getStore() || {};
        // this.periods = [
        //     { interval: 'Month', frequency: 1 },
        //     { interval: 'Month', frequency: 2 },
        //     { interval: 'Month', frequency: 3 },
        //     { interval: 'Month', frequency: 4 },
        //     { interval: 'Month', frequency: 5 },
        //     { interval: 'Month', frequency: 6 },
        //     { interval: 'Month', frequency: 7 },
        //     { interval: 'Month', frequency: 8 },
        //     { interval: 'Month', frequency: 9 },
        //     { interval: 'Month', frequency: 10 },
        //     { interval: 'Month', frequency: 11 },
        //     { interval: 'Month', frequency: 12 }
        // ];

        // this.selectPeriod = { interval: 'Month', frequency: 1 };

        this.getRecipe(this.$stateParams.recipeId);
        this.recipeId = this.$stateParams.recipeId;
        this.billingHistoryQuery = {
            recipeId: this.$stateParams.recipeId,
            skip: 0,
            limit: 10,
            currentPage: 1,
            totalPages: 1,
        };
        // this.recipePaymentClaimsQuery = {
        //   recipeId: this.$stateParams.recipeId,
        //   status: ["pending", "rejected"],
        //   skip: 0,
        //   limit: 10,
        //   currentPage: 1,
        //   totalPages: 1,
        //   isAdminFees: true,
        // };
        // this.getBillingHistory(this.billingHistoryQuery);
        // if (permissions.managePayments) {
        //   this.getRecipePaymentClaims(this.recipePaymentClaimsQuery);
        // }
        // this._$rootScope.$on("acceptPayment", (evt, data) => {
        //   this.getBillingHistory(this.billingHistoryQuery);
        //   this.getSupplierPaymentClaims(this.supplierPaymentClaimsQuery);
        // });
        // this._$rootScope.$on("rejectPayment", (evt, data) => {
        //   this.getBillingHistory(this.billingHistoryQuery);
        //   this.getSupplierPaymentClaims(this.supplierPaymentClaimsQuery);
        // });
    }

    getRecipe(id) {
        const _onSuccess = (res) => {
            this.recipe = res.data.data;
            this.representativeName = this.recipe.representativeName;
            this.userName = `${this.recipe.user.firstName}`;
            this.phoneNumberUpdated = this.recipe.user.mobileNumber;
            this.emailUpdated = this.recipe.user.email;
            switch (this.recipe.status) {
                case 'Suspended':
                    this.statusOptions = ['Approve', 'Delete'];
                    break;
                case 'Active':
                    this.statusOptions = ['Block', 'Delete'];
                    break;
                case 'Blocked':
                    this.statusOptions = ['Unblock', 'Delete'];
                    break;
                default:
                    this.statusOptions = ['Approve'];
            }
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = (err) => {
            this.supplierIsLoaded = true;
        };
        this._SupplierService
            .getSupplier(id)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    //   getBillingHistory(query) {
    //     const _onSuccess = (res) => {
    //       if (res.status === 200) {
    //         this.billingHistroy = res.data.data.billingHistory.transactions;
    //         this.balanceDetails = res.data.data.balanceDetails;
    //         this.selectPeriod.frequency = this.balanceDetails.payment.frequency;
    //         this.selectPeriod.interval = this.balanceDetails.payment.interval;
    //         this.billingHistoryQuery.totalPages = Math.ceil(
    //           res.data.data.billingHistory.count / this.billingHistoryQuery.limit
    //         );
    //         this._$rootScope.$apply();
    //       }
    //     };
    //     const _onError = (err) => {
    //       this.errors = err.data;
    //     };
    //     const _onFinal = (err) => {
    //       this.billingHistoryIsLoaded = true;
    //     };
    //     this._SupplierService
    //       .getBillingHistory(query)
    //       .then(_onSuccess, _onError)
    //       .finally(_onFinal);
    //   }
    //   setBillingHistoryPage(pageNumber) {
    //     this.billingHistoryQuery.currentPage = pageNumber;
    //     this.billingHistoryQuery.skip =
    //       (pageNumber - 1) * this.billingHistoryQuery.limit;
    //     this.getBillingHistory(this.billingHistoryQuery);
    //   }
    //   getSupplierPaymentClaims(query) {
    //     const _onSuccess = (res) => {
    //       if (res.status === 200) {
    //         this.paymentsClaims = res.data.data.payments;
    //         this.supplierPaymentClaimsQuery.totalPages = Math.ceil(
    //           res.data.data.count / this.supplierPaymentClaimsQuery.limit
    //         );
    //       }
    //     };
    //     const _onError = (err) => {
    //       this.errors = err.data;
    //     };
    //     const _onFinal = (err) => {
    //       this.paymentsClaimsIsLoaded = true;
    //     };
    //     this._SupplierService
    //       .getSupplierPaymentClaims(query)
    //       .then(_onSuccess, _onError)
    //       .finally(_onFinal);
    //   }
    //   setPaymentClaimsPage(pageNumber) {
    //     this.supplierPaymentClaimsQuery.currentPage = pageNumber;
    //     this.supplierPaymentClaimsQuery.skip =
    //       (pageNumber - 1) * this.supplierPaymentClaimsQuery.limit;
    //     this.getSupplierPaymentClaims(this.supplierPaymentClaimsQuery);
    //   }
    //   getInvoiceSum(transactions) {
    //     let sum = 0;
    //     angular.forEach(transactions, (transaction) => {
    //       sum += parseFloat(transaction.amount);
    //     });
    //     sum += sum * transactions[0].PVAT;
    //     return sum;
    //   }
    //   openRecordPayment() {
    //     this.disableRecordPaymentForm = false;
    //     this.paymentItem = null;
    //     $("#payment").modal("show");
    //   }
    //   openShowDetails(paymentId, payment) {
    //     this.disableRecordPaymentForm = true;
    //     this.paymentItem = payment;
    //     this._$rootScope.$broadcast(
    //       "onPaymentChanged",
    //       payment,
    //       this.disableRecordPaymentForm
    //     );
    //     $("#payment").modal("show");
    //   }
    //   openBillingShowDetails(paymentId, billItem) {
    //     this.billItem = billItem;
    //     $("#view-payment").modal("show");
    //   }

    blockRecipe(id) {
        const _onSuccess = (res) => {
            // this.supplier = res.data.data;
            this.recipe.status = 'Blocked';
            this.statusOptions = ['Unblock'];
            //   this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._RecipeService.blockRecipe(id).then(_onSuccess, _onError);
    }

    unblockRecipe(id) {
        const _onSuccess = (res) => {
            // this.supplier = res.data.data;
            this.recipe.status = 'Active';
            this.statusOptions = ['Block'];
            //   this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._RecipeService.unblockRecipe(id).then(_onSuccess, _onError);
    }

    approveRecipe(id) {
        const _onSuccess = (res) => {
            // this.supplier = res.data.data;
            this.recipe.status = 'Active';
            this.statusOptions = ['Block'];
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._RecipeService.approveRecipe(id).then(_onSuccess, _onError);
    }

    deleteRecipe(id) {
        const _onSuccess = (res) => {
            // this.supplier = res.data.data;
            this.recipe.status = 'Deleted';
            this.statusOptions = ['Approve'];
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._RecipeService.deleteRecipe(id).then(_onSuccess, _onError);
    }

    changeRecipeInfo() {
        this.recipe.representativeName = this.representativeName;
        if (this.userName) {
            this.recipe.user.firstName = this.userName.split(' ')[0] || '';
            this.recipe.user.lastName = this.userName.split(' ')[1]
                ? this.userName.split(' ')[1]
                : '';
        }

        if (this.phoneNumberUpdated) {
            this.recipe.user.mobileNumber = this.phoneNumberUpdated;
        }

        if (this.emailUpdated) {
            this.recipe.user.email = this.emailUpdated;
        }
        const _onSuccess = (res) => {
            // this.supplier = res.data.data;
            this.notify('supplier.recipes.recipe.recipe_updated', 'success', 3000);

            this.getRecipe(this.recipeId);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
            // this.getSupplier(this.supplierId);
            if (err.data.errorCode === 29) {
                this.notify('supplier.recipes.recipe.recipe_email_exists', 'danger', 8000);
            } else if (err.data.errorCode === 30) {
                this.notify(
                    'supplier.recipes.recipe.recipe_mobilePhone_exists',
                    'danger',
                    8000
                );
            }
        };
        this._RecipeService
            .adminUpdateRecipe(this.recipe)
            .then(_onSuccess, _onError);
    }

    changeRecipeStatus(recipeId, toStatus) {
        if (toStatus === 'Approve') {
            this.approveRecipe(recipeId);
        } else if (toStatus === 'Block') {
            this.blockRecipe(recipeId);
        } else if (toStatus === 'Unblock') {
            this.unblockRecipe(recipeId);
        } else if (toStatus === 'Delete') {
            this.deleteRecipe(recipeId);
        }
    }


    notify(message, type, timeout) {
        this.$translate(message).then((translation) => {
            $('body')
                .pgNotification({
                    style: 'bar',
                    message: translation,
                    position: 'top',
                    timeout,
                    type,
                })
                .show();
        });
    }

    changeStatus(status) {
        this.recipe.status = status;
        this.updateBalanceDetails();
    }

    customOp(item) {
        return (
            this.$translate.instant('supplier.recipes.payment.every') +
            this.$translate.instant(`supplier.recipes.payment.${item.interval}`, {
                value: item.frequency,
            })
        );
    }

    openPhoto(url) {
        window.open(url, '_blank', 'Download');
    }
}
SupplierRecipesItemDetailCtrl.$inject = [
    'RecipeService',
    'TransactionsService',
    '$stateParams',
    '$translate',
    '$rootScope',
    'PermPermissionStore',
];
