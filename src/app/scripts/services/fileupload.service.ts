module app.fileupload {
    'use strict';
    export class Fileupload {

        /* @ngInject */
        constructor(private $http: any) {
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
                url: 'api/upload',
                method: "POST",
                transformRequest: angular.identity,
                data: fd,
                headers: { 'Content-Type': undefined, enctype: 'multipart/form-data' },
            }).then((response) => {
                console.info('File uploaded= ', response.data)
                return response.data.response;
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