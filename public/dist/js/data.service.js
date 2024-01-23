var app;
(function (app) {
    var data;
    (function (data_1) {
        'use strict';
        var DataService = /** @class */ (function () {
            /**
             * api calls are initiated from here, we return cached defered promise after token registration,
             * and every subsequent return of an existing user will return the cached devered object from welcome page
             * accross to application page, all on save is not cashed until user return again.
             * We make call to DB on every save and update the GLOBAL OBJECT
             */
            /* @ngInject */
            DataService.$inject = ["$http", "$q", "API", "$rootScope"];
            function DataService($http, $q, API, $rootScope) {
                this.$http = $http;
                this.$q = $q;
                this.API = API;
                this.$rootScope = $rootScope;
                this.GLOBALS = {};
            }
            DataService.prototype.getCached = function () {
                var deferred = this.$q.defer();
                if (this.GLOBALS.form !== undefined) {
                    console.info('getCached(), sending existing user data across');
                    deferred.resolve(this.GLOBALS);
                }
                else {
                    var msg = { error: true, message: "cached data not found" };
                    deferred.reject(this.fail(msg));
                }
                return deferred.promise;
            };
            DataService.prototype.resetExisting = function () {
                this.user_exists = '';
            };
            DataService.prototype.clearAllCache = function () {
                this.GLOBALS = {};
            };
            DataService.prototype.checkDataRetention = function () {
                var failed = false;
                if (this.GLOBALS.token === undefined || !this.GLOBALS.token || this.GLOBALS.terms) {
                    this.clearAllCache();
                    failed = true;
                    console.info('YOU ARE NOT VIALID', 'decline');
                }
                return failed;
            };
            /**
             * updating GLOBALS and returning response
             * sending data and and url var token
             */
            DataService.prototype.registerUser = function (tok) {
                var _this = this;
                if (tok === void 0) { tok = ''; }
                console.log('window/URL', window);
                var token = (tok) ? tok : this.GLOBALS.token;
                if (!token || token === undefined) {
                    return this.fail({ error: true, message: 'token not available, or undefined!' });
                }
                //    
                return this.$http({
                    url: this.API.URL + '/register/' + token,
                    // url: 'api/register/' + token,
                    method: "POST",
                    data: {},
                    headers: {
                        'Function-Code': 'DFKJ884576*_35465fdjfuyrt+_*45@%_=_*56%@!~^',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                    // just to update the token id display on dashboard
                    _this.$rootScope.$emit("onDataChange", true);
                    // so we dont have to make another request on the application page, when coming from welcome page
                    // only if user already exists
                    _this.user_exists = response.data.userExists;
                    var new_user = response.data.newUser;
                    var success = response.data.success;
                    /**
                     * server validation returns invalid token response
                     */
                    if (response.data.invalidToken !== undefined) {
                        if (response.data.invalidToken) {
                            return { invalidToken: true };
                        }
                    }
                    // user token found in database
                    if (_this.user_exists === true) {
                        console.info('user found in DB');
                        _this.GLOBALS = response.data.data;
                        return response.data;
                    }
                    // registering new user
                    if (new_user && success && _this.user_exists !== true) {
                        console.info('new user registered');
                        _this.GLOBALS = response.data.data;
                        return response.data;
                    }
                    else {
                        _this.GLOBALS = undefined;
                        return _this.fail(response, 'new and existing user undefined');
                    }
                }, function (response) {
                    _this.GLOBALS = undefined;
                    return _this.fail(response, 'server error');
                });
            };
            /**
             * updating existing data for every on step save request,
             * and returning 'contactBranchNumber' and 'accountNumber' on the final/ ng-submit
             */
            DataService.prototype.onSave = function (data) {
                var _this = this;
                return this.$http({
                    url: this.API.URL + '/update',
                    //url: 'api/update',
                    method: "POST",
                    data: data,
                    headers: {
                        'Function-Code': 'DFKJ884576*_35465fdjfuyrt+_*45@%_=_*56%@!~^',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                    var success = response.data.success;
                    var failure = response.data.failure;
                    if (success) {
                        var d = response.data.data;
                        // to be available on complete page
                        _this.GLOBALS.accountNumber = d.form.accountNumber;
                        _this.GLOBALS.contactBranchNumber = d.form.contactBranchNumber;
                        if (d.form.final.valid === true) {
                            _this.GLOBALS = d;
                        }
                        return response.data.data;
                    }
                    if (failure) {
                        return _this.fail(response, 'failed to save data');
                    }
                    else {
                        var msg = 'no succes or failure received';
                        return _this.fail(data, msg);
                    }
                }, function (response) {
                    return _this.fail(response, 'server error');
                });
            };
            DataService.prototype.success = function (response) {
                return { response: response, success: true };
            };
            DataService.prototype.fail = function (error, msg) {
                if (msg === void 0) { msg = ''; }
                if (!msg)
                    msg = 'server error';
                return { error: error, message: msg };
            };
            return DataService;
        }());
        data_1.DataService = DataService;
        angular
            .module('app.dataservice', []);
        angular
            .module('app.dataservice')
            /* @ngInject */
            .service('dataservice', DataService);
    })(data = app.data || (app.data = {}));
})(app || (app = {}));

//# sourceMappingURL=data.service.js.map
