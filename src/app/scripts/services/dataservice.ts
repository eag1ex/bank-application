module app.data {
  'use strict';

  export class DataService {
    /* @ngInject */

    private GLOBALS: any = {};

    private user_exists: any;
    private user_data_cached: any;
    constructor(private $http,
      private $q, private API) {

    }

    public GLOB() {
      let cached = this.user_data_cached;
      // check for terms     
      let terms = null;
      let approved = null;

      if (cached) {
        let form = Object.keys(cached.data).filter((key) => {
          if (key === 'form') return true;
        })

        if (form.length > 0) {
          terms = (cached.data.form.tc !== false) ? cached.data.form.tc : this.GLOBALS.terms;
          approved = (cached.data.form.approved !== false || cached.data.form.approved===undefined) ? cached.data.form.approved : this.GLOBALS.approved;
        }
        else{
          terms = this.GLOBALS.terms;
          approved = this.GLOBALS.approved;
        } 
      }
      this.GLOBALS.approved = approved;
      this.GLOBALS.cached = cached || undefined;
      this.GLOBALS.terms = terms;
      this.GLOBALS.token = (cached !== undefined) ? cached.data.token : undefined;
      console.log('glob data is ', this.GLOBALS)
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
      if (this.user_data_cached) {
        console.log('sending existing user data to application page');
        deferred.resolve(this.user_data_cached.data);
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
      this.user_data_cached = undefined;
      this.GLOBALS = {};
    }

    checkDataRetention() {
      let failed = false;
      if (this.user_data_cached && (this.GLOBALS.token == undefined || !this.GLOBALS.token)) {
        this.clearAllCache(); failed = true;
        console.log('token not valid, but have cached data', 'decline');
      }
      if (this.user_data_cached && (this.GLOBALS.terms == undefined || !this.GLOBALS.terms)) {
        this.clearAllCache(); failed = true;
        console.log('terms not valid, but have cached data', 'decline');
      }

      return failed;
    }

    registerUser(tok = '') {

      var token = (tok) ? tok : this.GLOB().token;

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
            this.user_data_cached = response.data;
            return response.data;
          }
          if (new_user && success && this.user_exists !== true) {
            this.user_data_cached = response.data;
            return response.data;
          }
          else {
            this.user_data_cached = undefined;
            return this.fail(response, 'new and existing user undefind');
          }

        }, (response) => {
          console.log('the else response')
          this.user_data_cached = undefined;
          return this.fail(response, 'server error');
        });
    }


    onSave(data) {

      return this.$http({
        url: 'api/update/',
        method: "POST",
        data: data,
        headers: { 'Content-Type': 'application/json' }
      })
        .then((response) => {
          return response.data;
        }, (response) => {
          // console.log('on save resonse',response.data);

          let success = response.data.success;
          let failure = response.data.failure;
          if (response) {
            return this.success(response);
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
