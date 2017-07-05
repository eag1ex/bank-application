module app.data {
  'use strict';

  export class DataService {
    /* @ngInject */

    private GLOBALS: any = {};

    private user_exists: any;
    private GLOBALS.cache: any;
    constructor(private $http,
      private $q, private API, private $rootScope) {

    }

    public GLOB() {
      let config = {
        cached: this.GLOBALS.cache
      };
      this.GLOBALS.cached = config.cached || undefined;

      return this.GLOBALS;
    }

    getAll() {
      return this.$http.get(this.API.URL + "/all")
        .then((response) => {
          return response;
        })
        .catch(this.fail);
    }

    getCached() {
      let deferred = this.$q.defer();
      if (this.GLOBALS.form !== undefined) {

        console.log('sending existing user data to application page');
        deferred.resolve(this.GLOBALS);
      }
      else {
        let msg = { error: true, message: "cached data not found" };
        deferred.reject(this.fail(msg));
      }
      return deferred.promise;
    }

    resetExisting() {
      this.user_exists = '';
    }

    clearAllCache() {
      this.GLOBALS = {};
    }

    checkDataRetention() {
      let failed = false;
      if (this.GLOBALS.token == undefined || !this.GLOBALS.token || this.GLOBALS.terms) {
        this.clearAllCache(); failed = true;
        console.log('YOU ARE NOT VIALID', 'decline');
      }
      return failed;
    }

    registerUser(tok = '') {

      var token = (tok) ? tok : this.GLOBALS.token;

      if (!token || token == undefined) {
        console.log('token not available!')
        return this.fail({ error: true, message: 'token not available, or undefined!' });
      }


      /**
       * we are doing retreiving data for storag  e as well!
       */
      return this.$http({
        url: 'api/register/' + token,
        method: "POST",
        data: {},
        headers: { 'Content-Type': 'application/json' }
      })
        .then((response) => {

          this.$rootScope.$emit("onDataChange", true);

          console.log('response', response)
          // so we dont have to make another request on the application page, when coming from welcome page
          // only if user already exists
          this.user_exists = response.data.userExists;
          let new_user = response.data.newUser;
          let success = response.data.success;

          if (response.data.invalidToken !== undefined) {
            if (response.data.invalidToken) {
              return { invalidToken: true };
            }
          }

          if (this.user_exists === true) {
            console.log('user exists 11')
            this.GLOBALS = response.data.data;
            console.log('this.GLOBALS user exists 11', this.GLOBALS)
            return response.data;
          }
          if (new_user && success && this.user_exists !== true) {
            console.log('registerd new user11')
            this.GLOBALS = response.data.data;
            console.log('this.GLOBALS registerd new user11', this.GLOBALS)
            return response.data;
          }


          else {
            this.GLOBALS = undefined;
            return this.fail(response, 'new and existing user undefind');
          }

        }, (response) => {
          console.log('the else response')
          this.GLOBALS = undefined;
          return this.fail(response, 'server error');
        });
    }


    onSave(data) {

      return this.$http({
        url: 'api/update',
        method: "POST",
        data: data,
        headers: { 'Content-Type': 'application/json' }
      })
        .then((response) => {
          console.log('data success12', response)
          let success = response.data.success;
          let failure = response.data.failure;
          if (success) {

            let d = response.data.data;
            // to be available on complete page
            this.GLOBALS.accountNumber = d.form.accountNumber;
            this.GLOBALS.contactBranchNumber = d.form.contactBranchNumber;
            
            return response.data.data;
          }
          if (failure) {
            return this.fail(response, 'failed to save data');
          } else {
            let msg = 'no succes or failure received';
            return this.fail(data, msg);
          }

        }, (response) => {
          return this.fail(response, 'server error');
        });
    }

    updateUser(data) {
      return this.$http({
        url: this.API.URL + '/' + data.id,
        method: "POST",
        data: data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then((response) => {
          return response;
        }, (response) => { // optional
          return this.fail(response)
        });

    }

    private success(response: any) {
      return { response: response, success: true };
    }


    private fail(error, msg = '') {
      if (!msg) msg = 'server error';
      return { error: error, message: msg }
    }
  }

  angular
    .module('app.dataservice', []);
  angular
    .module('app.dataservice')
    /* @ngInject */
    .service('dataservice', DataService);
}
