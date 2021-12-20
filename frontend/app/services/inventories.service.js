export default class InventoryService {

    constructor(AppConstants, JwtService, RetryRequest) {
        this._AppConstants = AppConstants;
        this.current = null;
        this._JwtService = JwtService;
        this.retryRequest = RetryRequest;
        this._request = {};
        this._request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
    }

    getInventories(searchCriteria) {
        const request = {};
        request.url = `${this._AppConstants.api}/inventory/recipes/items?`;
        request.method = 'GET';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };

        if (searchCriteria) {
            if (searchCriteria.skip || searchCriteria.skip === 0) {
                request.url = request.url.concat(`skip=${searchCriteria.skip}&`);
            }
            if (searchCriteria.limit) {
                request.url = request.url.concat(`limit=${searchCriteria.limit}&`);
            }
            if (searchCriteria.inventoryName) {
                request.url = request.url.concat(`inventoryName=${searchCriteria.inventoryName}&`);
            }
        }
        return this.retryRequest(request);
    }

    deleteInventoryItem(itemId) {
        const request = {};
        request.url = `${this._AppConstants.api}/inventory/recipes/items/${itemId}`;
        request.method = 'DELETE';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };

        return this.retryRequest(request);
    }

    createIngredient(ingredient) {
        const request = {
            url: `${this._AppConstants.api}/inventory/ingredient/create`,
            method: 'POST',
            data: ingredient,
        };
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };

        return this.retryRequest(request);
    }

    deleteIngredient(itemId, recipeId) {
        const request = {};
        if (itemId && recipeId) {
            request.url = `${this._AppConstants.api}/inventory/ingredient/${itemId}/${recipeId}`;
        } else {
            request.url = `${this._AppConstants.api}/inventory/ingredient/${itemId}`;
        }
        request.method = 'DELETE';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };

        return this.retryRequest(request);
    }

    getIngredients(searchCriteria) {
        const request = {};
        request.url = `${this._AppConstants.api}/inventory/ingredient/list?`;
        request.method = 'GET';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };

        if (searchCriteria) {
            if (searchCriteria.skip || searchCriteria.skip === 0) {
                request.url = request.url.concat(`skip=${searchCriteria.skip}&`);
            }
            if (searchCriteria.limit) {
                request.url = request.url.concat(`limit=${searchCriteria.limit}&`);
            }
            if (searchCriteria.ingredientName) {
                request.url = request.url.concat(`ingredientName=${searchCriteria.ingredientName}&`);
            }
        }
        return this.retryRequest(request);
    }


    updateIngredient(ingredient) {
        const request = {
            url: `${this._AppConstants.api}/inventory/ingredient/update`,
            method: 'PUT',
            data: ingredient,
        };
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };

        return this.retryRequest(request);
    }

    getIngredientsForSelect(data) {
        const request = {
            url: `${this._AppConstants.api}/inventory/ingredient/list`,
            method: 'post',
            data
        };
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };

        return this.retryRequest(request);
    }

    saveIngredientsForSelect(data) {
        const request = {
            url: `${this._AppConstants.api}/inventory/ingredient/update`,
            method: 'post',
            data
        };
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };

        return this.retryRequest(request);
    }

    updateIngredientSingle(ingredient) {
        const request = {
            url: `${this._AppConstants.api}/inventory/ingredient/update/single`,
            method: 'PUT',
            data: ingredient,
        };
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };

        return this.retryRequest(request);
    }

    getAllSupplierSKU() {
        const request = {};
        request.url = `${this._AppConstants.api}/inventory/products/loadSku`;
        request.method = 'GET';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };

        return this.retryRequest(request);
    }

}
