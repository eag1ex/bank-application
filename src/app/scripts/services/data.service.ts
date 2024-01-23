module app.data {
  'use strict';

  export class DataService {
    private GLOBALS: any = {};
    private user_exists: any;

    /**
     * api calls are initiated from here, we return cached defered promise after token registration,
     * and every subsequent return of an existing user will return the cached devered object from welcome page
     * accross to application page, all on save is not cashed until user return again.
     * We make call to DB on every save and update the GLOBAL OBJECT
     */

    /* @ngInject */
    constructor(private $http,
      private $q, private API, private $rootScope) {
    }


    getCached() {
      let deferred = this.$q.defer();
      if (this.GLOBALS.form !== undefined) {
        console.info('getCached(), sending existing user data across');
        deferred.resolve(this.GLOBALS);
      }else {
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
      if (this.GLOBALS.token === undefined || !this.GLOBALS.token || this.GLOBALS.terms) {
        this.clearAllCache(); failed = true;
        console.info('YOU ARE NOT VIALID', 'decline');
      }
      return failed;
    }

    /**
     * updating GLOBALS and returning response
     * sending data and and url var token
     */

    registerUser(tok = '') {
      console.log('window/URL',window)
      var token = (tok) ? tok : this.GLOBALS.token;

      if (!token || token === undefined) {
        return this.fail({ error: true, message: 'token not available, or undefined!' });
      }
      //    
      return this.$http({
        url: this.API.URL+'/register/' + token,
        // url: 'api/register/' + token,
        method: "POST",
        data: {},
        headers: {
          'Function-Code':'DFKJ884576*_35465fdjfuyrt+_*45@%_=_*56%@!~^',
           'Content-Type': 'application/json'
           }
      })
        .then((response) => {
          // just to update the token id display on dashboard
          this.$rootScope.$emit("onDataChange", true);

          // so we dont have to make another request on the application page, when coming from welcome page
          // only if user already exists
          this.user_exists = response.data.userExists;
          let new_user = response.data.newUser;
          let success = response.data.success;

          /**
           * server validation returns invalid token response
           */
          if (response.data.invalidToken !== undefined) {
            if (response.data.invalidToken) {
              return { invalidToken: true };
            }
          }

          // user token found in database
          if (this.user_exists === true) {
            console.info('user found in DB');
            this.GLOBALS = response.data.data;
            return response.data;
          }

          // registering new user
          if (new_user && success && this.user_exists !== true) {
            console.info('new user registered');
            this.GLOBALS = response.data.data;
            return response.data;
          } else {
            this.GLOBALS = undefined;
            return this.fail(response, 'new and existing user undefined');
          }

        }, (response) => {
          this.GLOBALS = undefined;
          return this.fail(response, 'server error');
        });
    }

    /**
     * updating existing data for every on step save request,
     * and returning 'contactBranchNumber' and 'accountNumber' on the final/ ng-submit
     */

    onSave(data) {

      return this.$http({
        url: this.API.URL+'/update',
        //url: 'api/update',
        method: "POST",
        data: data,
        headers: { 
          'Function-Code':'DFKJ884576*_35465fdjfuyrt+_*45@%_=_*56%@!~^',
          'Content-Type': 'application/json'
         }
      })
        .then((response) => {
          let success = response.data.success;
          let failure = response.data.failure;
          if (success) {

            let d = response.data.data;
            // to be available on complete page
            this.GLOBALS.accountNumber = d.form.accountNumber;
            this.GLOBALS.contactBranchNumber = d.form.contactBranchNumber;

            if (d.form.final.valid === true) {
              this.GLOBALS = d;
            }

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
