module app.fileupload {
    'use strict';
    export class Fileupload {

        /* @ngInject */
        constructor(private $http: any) {
        }

        upload(file) {
            var fd = new FormData();
            fd.append('file', file);
            this.$http.post('api/upload', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).success( (response)=> {
                console.log('file uploaded succesfully',response)
                return response;
            }).error( (err)=> {
                let msg = 'file did not uplead'
                return this.fail(err, msg);
            });
        }
        private fail(error, msg = '') {
            if (!msg) msg = 'server error';
            return { error: error, message: msg }
        }
    }

    angular
        .module('app.fileupload', []);
    angular
        .module('app.fileupload')
        .service('fileupload', Fileupload)
}