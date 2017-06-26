module app.data {
  'use strict';

  /* @ngInject */
  export class DataService {
    static $inject: Array<string> = ['$http', '$q'];
    constructor(private $http,
      private $q) {
    }


    get() {
      return this.$http.get('/api')
        .then((response) => {
          return response.data;
        })
        .catch(this.fail);
    }

    private success(response: any) {
      return response.data
    }


    private fail(error) {
      var msg = error;
      var reason = 'query for people failed.';
      return this.$q.reject(error);
    }
  }

  angular
    .module('app.data.dataservice', []);
  angular
    .module('app.data.dataservice')
    /* @ngInject */
    .service('dataservice', DataService);
}
