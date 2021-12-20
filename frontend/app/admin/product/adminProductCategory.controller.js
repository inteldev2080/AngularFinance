/* eslint-disable object-shorthand */

import angular from 'angular';

export default class AdminProductCategoryCtrl {
    constructor(CategoryService, $translate) {
        this._CategoryService = CategoryService;
        this._$translate = $translate;
        this.firstLoad = true;
        this.isEnglish = true;
        this.categoriesLoaded = false;
    }

    $onInit() {
        this.firstLoad = true;
        this.categoriesLoaded = false;
        $.Pages.init(); // eslint-disable-line
        this.searchCriteria = { skip: 0, limit: 100 };
        this.getCategories(this.searchCriteria);
    }

    getCategories(searchCriteria) {
        this.categoriesLoaded = false;
        const _onSuccess = (res) => {
            this.categories = res.data.data.categories;
            if (this.firstLoad) {
                this.category = this.categories[0];
                this.parentCategoryId = this.categories[0] ? this.categories[0]._id : null;
            }
            if (this.isMainCategory) {
                this.category = this.categories[0];
                this.parentCategoryId = this.categories[0] ? this.categories[0]._id : null;
            }
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = (err) => {
            this.categoriesLoaded = true;
        };
        this._CategoryService.getCategories(searchCriteria)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    getCategory(categoryId) {
        const _onSuccess = (res) => {
            this.category = res.data.data;
            this.formData = angular.copy(this.category);
               /* {
                status: this.category.status,
                arabicName: this.category.arabicName,
                englishName: this.category.englishName
            };*/
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._CategoryService.getCategory(categoryId).then(_onSuccess, _onError);
    }

    createCategory(category) {
        this.firstLoad = false;
        this.disableAddSubCategory = true;
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.notify('admin.categories.message.categoryAddSuccess', 'success', 1000);
                this.getCategories(this.searchCriteria);
                if (this.mode === 'Save') {
                    this.parentCategoryId = res.data.data._id;
                }
                this.getCategory(this.parentCategoryId);
            } else {
                this.notify('admin.categories.message.failure', 'danger', 5000);
            }
        };
        const _onError = (err) => {
            this.errors = err.data.data;
            this.notify('admin.categories.message.failure', 'danger', 5000);
        };
        this._CategoryService.createCategory(category)
            .then(_onSuccess, _onError)
            .catch((e) => {
                this.notify('admin.categories.message.failure', 'danger', 5000);
            })
            .finally(() => {
                this.formData = {};
                this.disableAddSubCategory = false;
            });
    }

    updateCategory(id, category) {
        this.firstLoad = false;
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.notify('admin.categories.message.categoryUpdateSuccess', 'success', 1000);

                this.getCategories(this.searchCriteria);
                this.getCategory(this.parentCategoryId);
            } else {
                this.notify('admin.categories.message.failure', 'danger', 5000);
            }
        };
        const _onError = (err) => {
            this.notify('admin.categories.message.failure', 'danger', 5000);
            this.errors = err.data.data;
        };
        this._CategoryService.updateCategory(id, category).then(_onSuccess, _onError)
            .catch((e) => {
                this.notify('admin.categories.message.failure', 'danger', 5000);
            })
            .finally(() => {
                this.categoriesLoaded = true;
            });
    }

    deleteCategory(id) {
        this.firstLoad = false;
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.getCategories(this.searchCriteria);
                this.notify('admin.categories.message.categoryDeleteSuccess', 'success', 1000);
            } else {
                this.notify('admin.categories.message.failure', 'danger', 5000);
            }
        };
        const _onError = (err) => {
            if (err.data.errorCode === 17) {
                this.notify('admin.categories.message.haveChildCategory', 'warning', 5000);
            } else if (err.data.errorCode === 18) {
                this.notify('admin.categories.message.haveProducts', 'warning', 5000);
            } else {
                this.notify('admin.categories.message.failure', 'danger', 5000);
            }

            this.errors = err.data.data;
        };
        this._CategoryService.deleteCategory(id).then(_onSuccess, _onError).finally(() => {
            $('#deleteModal').modal('hide');
            this.getCategory(this.parentCategoryId);
        });
    }

    openCreateCategoryPopup() {
        this.title = this._$translate.instant('admin.categories.createNewCategory');
        this.action = this._$translate.instant('admin.categories.save');
        this.mode = 'Save';
        this.formData = {};
        $('#categoryModal').modal('show');
    }

    openEditCategoryPopup(category) {
        $.Pages.init();
        this.title = this._$translate.instant('admin.categories.editCategory');
        this.action = this._$translate.instant('admin.categories.update');
        this.categoryId = category._id;
        this.parentCategoryId = category._id;
        this.formData = angular.copy(category);
        this.mainCat = true;
  //  this.getCategory(id);
        this.mode = 'Update';
        $('#categoryModal').modal('show');
    }

    openAddSubCategoryPopup() {
        if (this.disableAddSubCategory) {
            this.notify('admin.categories.message.disableAddSubCategory', 'error', 1000);
            return;
        }
        this.title = this._$translate.instant('admin.categories.createNewSubCategory');
        this.action = this._$translate.instant('admin.categories.save');
        this.formData = {};
        this.mode = 'Add Subcategory';
        $('#categoryModal').modal('show');
    }

    setParentCategoryId(id) {
        this.parentCategoryId = id;
        this.getCategory(id);
    }

    hideCategory(category) {
        if (category.status === 'Hidden') {
            category.status = 'Active';
        } else {
            category.status = 'Hidden';
        }
        this.updateCategory(category._id, {
            status: category.status,
            arabicName: category.arabicName,
            englishName: category.englishName });
    }

    onSubmit(categoryForm) {
        if (categoryForm.$invalid) return;
        if (this.mode === 'Save') {
            this.createCategory(this.formData);
        } else if (this.mode === 'Update') {
            this.updateCategory(this.categoryId, this.formData);
        } else if (this.mode === 'Add Subcategory') {
            this.formData.parentCategory = this.parentCategoryId;
            this.createCategory(this.formData);
        } else if (this.mode === 'Rename') {
            this.updateCategory(this.categoryId, this.formData);
        }
        $('#categoryModal').modal('hide');
        this.resetForm(categoryForm);
    }
    resetForm(form) {
        this.fromData = {};
        // userForm.$setValidity();
        form.$setPristine();
        form.$setUntouched();
    }
    closeCategoryModalPopup(form) {
        this.getCategories(this.searchCriteria);
        this.resetForm(form);
        const ctrl = this;
        $('#categoryModal').on('hide.bs.modal', () => {
            ctrl.getCategories(ctrl.searchCriteria);
            ctrl.resetForm(form);
        });
    }
    renameSupCategory(category) {
        this.categoryId = category._id;
        this.formData = angular.copy(category);
        this.action = this._$translate.instant('admin.categories.rename');
        this.mode = 'Rename';
        $('#categoryModal').modal('show');
    }

    confirmDelete() {
        this.deleteCategory(this.categoryId);
    }

    openConfirmMessage(id, type) {
        if (type === 'mainCategory') {
            $('#categoryModal')
                .modal('hide');
            this.isMainCategory = true;
        } else {
            this.isMainCategory = false;
        }
        this.categoryId = id;
        $('#deleteModal').modal('show');
    }

    notify(message, type, timeout) {
        this._$translate(message).then((translation) => {
            $('body')
                .pgNotification({
                    style: 'bar',
                    message: translation,
                    position: 'top',
                    timeout,
                    type
                })
                .show();
        });
    }


}
AdminProductCategoryCtrl.$inject = ['CategoryService', '$translate'];
