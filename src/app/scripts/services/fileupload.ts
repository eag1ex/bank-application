module app.fileupload {
    'use strict';
    export class Fileupload {

        /* @ngInject */
        constructor(private $http: any) {
        }
  
        upload(file,token) {
            if (!file || !token) return
            console.log('uploading file', file);
            var fd = new FormData();
            fd.append('file', file);
             
            return this.$http({
                url: 'api/upload/'+token,
                method: "POST",
                //withCredentials: false,
                transformRequest: angular.identity,
                data: fd,
                headers: { 'Content-Type': undefined, enctype: 'multipart/form-data' },
            }).then((response) => {
                    console.log('file uploaded succesfully', response)
                    return response;
                }, (err) => { // optional
                    let msg = 'file did not uplead'
                    return this.fail(err, msg);
                });
        }
        private fail(error, msg = '') {
            if (!msg) msg = 'server error';
            return { error: error, message: msg };
        }
    }

    angular
        .module('app.fileupload', []);
    angular
        .module('app.fileupload')
        .service('fileupload', Fileupload)
}