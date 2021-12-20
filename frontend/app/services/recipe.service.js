export default class RecipeService {
    constructor(AppConstants, JwtService, RetryRequest) {
        this._AppConstants = AppConstants;
        this.current = null;
        this._JwtService = JwtService;
        this.retryRequest = RetryRequest;
        this._request = {};
        this._request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`,
        };
    }

    createRecipe(recipe) {
        const request = {
            url: `${this._AppConstants.api}/inventory/recipes/items`,
            method: 'POST',
            data: recipe,
        };
        request.headers = {
            'Content-Type': 'application/json',
             Authorization: `Bearer ${this._JwtService.get()}`
        };

        return this.retryRequest(request);
    }

    //
    // getRecipes(searchCriteria) {
    //     const request = {};
    //     request.url = `${this._AppConstants.api}/Recipes?`;
    //     request.method = 'GET';
    //     request.headers = {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${this._JwtService.get()}`,
    //     };
    //     if (searchCriteria) {
    //         if (searchCriteria.skip || searchCriteria.skip === 0) {
    //             request.url = request.url.concat(`skip=${searchCriteria.skip}&`);
    //         }
    //         if (searchCriteria.limit) {
    //             request.url = request.url.concat(`limit=${searchCriteria.limit}&`);
    //         }
    //         if (searchCriteria.recipeName) {
    //             request.url = request.url.concat(
    //       `recipeName=${searchCriteria.recipeName}&`
    //     );
    //         }
    //         if (searchCriteria.status && searchCriteria.status.length > 0) {
    //             let status = '[';
    //             for (let i = 0; i < searchCriteria.status.length; i += 1) {
    //                 if (i < searchCriteria.status.length - 1) {
    //                     status = status.concat(`"${searchCriteria.status[i]}",`);
    //                 } else {
    //                     status = status.concat(`"${searchCriteria.status[i]}"`);
    //                 }
    //             }
    //             status = status.concat(']');
    //             request.url = request.url.concat(`status=${status}`);
    //         }
    //         if (searchCriteria.payingSoon) {
    //             request.url = `${request.url}&payingSoon=${searchCriteria.payingSoon}`;
    //         }
    //         if (searchCriteria.missedPayment) {
    //             request.url = `${request.url}&missedPayment=${searchCriteria.missedPayment}`;
    //         }
    //     }
    //     return this.retryRequest(request);
    // }
    //
    // getBranches() {
    //     const request = {};
    //     request.url = `${this._AppConstants.api}/branches`;
    //     request.method = 'GET';
    //     request.headers = this._request.headers;
    //     return this.retryRequest(request);
    // }
    //
    // getRecipe(recipeId) {
    //     const request = {
    //         url: `${this._AppConstants.api}/recipes/${recipeId}`,
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${this._JwtService.get()}`,
    //         },
    //     };
    //     return this.retryRequest(request);
    // }
    //
    // getProfileInfo() {
    //     const request = {
    //         url: `${this._AppConstants.api}/recipes/profile`,
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${this._JwtService.get()}`,
    //         },
    //     };
    //     return this.retryRequest(request);
    // }
    //
    // updateRecipes(recipe) {
    //     const request = {};
    //     request.url = `${this._AppConstants.api}/recipes/${recipe._id}`;
    //     request.method = 'PUT';
    //     request.headers = this._request.headers;
    //     request.data = recipe;
    //     return this.retryRequest(request);
    // }
    //
    // adminUpdateRecipe(recipe) {
    //     const request = {};
    //     request.url = `${this._AppConstants.api}/recipes/recipe/${recipe._id}`;
    //     request.method = 'PUT';
    //     request.headers = {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${this._JwtService.get()}`,
    //     };
    //     request.data = recipe;
    //     return this.retryRequest(request);
    // }
    //
    // blockRecipe(recipeId) {
    //     const request = {
    //         url: `${this._AppConstants.api}/recipes/block/${recipeId}`,
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${this._JwtService.get()}`,
    //         },
    //     };
    //     return this.retryRequest(request);
    // }
    //
    // unblockRecipe(recipeId) {
    //     const request = {
    //         url: `${this._AppConstants.api}/recipes/unblock/${recipeId}`,
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${this._JwtService.get()}`,
    //         },
    //     };
    //     return this.retryRequest(request);
    // }
    //
    // deleteRecipe(recipeId) {
    //     const request = {
    //         url: `${this._AppConstants.api}/recipes/${recipeId}`,
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${this._JwtService.get()}`,
    //         },
    //     };
    //     return this.retryRequest(request);
    // }
    //
    // updateRecipeRelation(recipeId, details) {
    //     const request = {};
    //     request.url = `${this._AppConstants.api}/recipes-/admin/${recipeId}`;
    //     request.method = 'PUT';
    //     request.headers = this._request.headers;
    //     request.data = details;
    //     return this.retryRequest(request);
    // }
    //
    // deleteRecipe(recipeId, recipe) {
    //     const request = {};
    //     request.url = `${this._AppConstants.api}/recipes/${recipeId}`;
    //     request.method = 'DELETE';
    //     request.headers = {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${this._JwtService.get()}`,
    //     };
    //     request.data = recipe;
    //     return this.retryRequest(request);
    // }


}
RecipeService.$inject = ['AppConstants', 'JwtService', 'RetryRequest'];
