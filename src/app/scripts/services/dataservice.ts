module app.data {
  'use strict';


  export class DataService {
    /* @ngInject */
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
