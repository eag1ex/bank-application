module app.data {
  'use strict';

  export class DataService {
    /* @ngInject */

    private GLOBALS:any={};

    private user_exists:any;
    private user_data_cached:any;
    constructor(private $http,
      private $q, private API) {

    }

    public GLOB(){
      let cached = this.user_data_cached;
      return {
        terms:  (this.GLOBALS.terms) ? this.GLOBALS.terms:undefined,
        token: (cached) ? cached.data.token:undefined,
        cached:this.user_data_cached || undefined,
        G:this.GLOBALS};
    }

    getAll() {
      return this.$http.get(this.API.URL+"/all")
        .then((response) => {
          return response;
        })
        .catch(this.fail);
    }

    getById(id) {
      return this.$http.get(this.API.URL+"/"+id)
        .then((response) => {
          return response.data.data;
        })
        .catch(this.fail);
    }

    resetExisting(){
      this.user_exists='';
    }

    clearAllCache(){
      this.user_data_cached=undefined;
      this.GLOBALS = {};
    }

    checkDataRetention(){
      let failed = false;
      if (this.user_data_cached && (this.GLOBALS.token==undefined || !this.GLOBALS.token) ){
         this.clearAllCache(); failed = true;
         console.log('token not valid, but have cached data', 'decline');
      }
      if(this.user_data_cached && (this.GLOBALS.terms==undefined || !this.GLOBALS.terms)){
         this.clearAllCache(); failed = true;
          console.log('terms not valid, but have cached data', 'decline');
      }

      return failed;
    }

    registerUser(tok='') {
      
      var token = (tok) ? tok: this.GLOB().token;

      if(this.user_data_cached){
        console.log('sending existing user data to application page');
         var deferred = this.$q.defer();
         deferred.resolve(this.user_data_cached);
         return deferred.promise;
      };
      
      if (!token || token==undefined){
        console.log('token not available!')
        return;
      } 

      /**
       * we are doing retreiving data for storage as well!
       */
     return this.$http({
        url: this.API.URL+'/register/'+token,
        method: "POST",
        data: {},
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then((response)=> {
          console.log('response',response)
          // so we dont have to make another request on the application page, when coming from welcome page
          // only if user already exists
          this.user_exists = response.data.userExists;
          let new_user = response.data.newUser;
          let success = response.data.success;

          if(this.user_exists===true){
              this.user_data_cached =  response.data;
              return response.data;
          }
          if(new_user && success && this.user_exists!==true){
             this.user_data_cached =  response.data;
             return response.data;
          }
          else{
            this.user_data_cached = undefined;
            return throw {error:`new_user: ${new_user} user_exists: ${this.user_exists}`}
          }
          
        }, (response)=> { 
           this.user_data_cached = undefined; 
           return this.fail(response)
        });
    }


    postUser(data) {

      return this.$http({
        url: this.API.URL+'/'+data.id,
        method: "POST",
        data: data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then((response)=> {
          return response;
        }, (response)=> { // optional
           return this.fail(response)
        });

    }

    updateUser(data) {
       return this.$http({
        url: this.API.URL+'/'+data.id,
        method: "POST",
        data: data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then((response)=> {
          return response;
        }, (response)=> { // optional
           return this.fail(response)
        });

    }

    private success(response: any) {
      return response.data
    }


    private fail(error) {
      var deferred = this.$q.defer();
      var msg = error;
      var reason = 'query for people failed.';
      return deferred.reject(error);
    }
  }

  angular
    .module('app.dataservice', []);
  angular
    .module('app.dataservice')
    /* @ngInject */
    .service('dataservice', DataService);
}
