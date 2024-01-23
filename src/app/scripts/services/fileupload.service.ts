module app.fileupload {
    'use strict';
    export class Fileupload {

        /* @ngInject */
        constructor(private $http: any,private API) {
            console.log('upload api', API)
        }

        /**
         * upload file directive which send new image to the server
         * files allowed are only images not pdfs
         */

        upload(file) {
            if (!file) return
            var fd = new FormData();
            fd.append('file', file);

            return this.$http({
                url: this.API.URL+'/upload',
              //  url: 'api/upload',
                method: "POST",
                transformRequest: angular.identity,
                data: fd,
                headers: { 
                    'Function-Code':'DFKJ884576*_35465fdjfuyrt+_*45@%_=_*56%@!~^',
                    'Content-Type': undefined, enctype: 'multipart/form-data' 
                },
            }).then((response) => {
                if (response.data.error) {
                    console.info('File uploaded= ', response.data)
                    return false;
                } if (response.data.success) {
                    return response.data.response;
                }

            }, (err) => {
                let msg = 'file did not upload';
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