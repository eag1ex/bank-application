module app.data {
  'use strict';


  export class DataService {
    /* @ngInject */
    private user_exists:any;
    private user_exists_data:any;
    constructor(private $http,
      private $q, private API) {

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

    resetData(){
      this.user_exists='';
    }

    registerUser(token) {

      if(this.user_exists){
        console.log('sending existing user data to application page');
         var deferred = this.$q.defer();
         deferred.resolve(this.user_exists_data);
         return deferred.promise;
      };
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
              this.user_exists_data =  response.data;
              return {userExists:true};
          }
          if(new_user && success && this.user_exists!==true){
             return response.data;
          }
          else{
            return throw {error:`new_user: ${new_user} user_exists: ${this.user_exists}`}
          }
          
        }, (response)=> { 
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
