var app;
(function (app) {
    var fileupload;
    (function (fileupload) {
        'use strict';
        var Fileupload = /** @class */ (function () {
            /* @ngInject */
            Fileupload.$inject = ["$http", "API"];
            function Fileupload($http, API) {
                this.$http = $http;
                this.API = API;
                console.log('upload api', API);
            }
            /**
             * upload file directive which send new image to the server
             * files allowed are only images not pdfs
             */
            Fileupload.prototype.upload = function (file) {
                var _this = this;
                if (!file)
                    return;
                var fd = new FormData();
                fd.append('file', file);
                return this.$http({
                    url: this.API.URL + '/upload',
                    //  url: 'api/upload',
                    method: "POST",
                    transformRequest: angular.identity,
                    data: fd,
                    headers: {
                        'Function-Code': 'DFKJ884576*_35465fdjfuyrt+_*45@%_=_*56%@!~^',
                        'Content-Type': undefined, enctype: 'multipart/form-data'
                    },
                }).then(function (response) {
                    if (response.data.error) {
                        console.info('File uploaded= ', response.data);
                        return false;
                    }
                    if (response.data.success) {
                        return response.data.response;
                    }
                }, function (err) {
                    var msg = 'file did not upload';
                    return _this.fail(err, msg);
                });
            };
            Fileupload.prototype.fail = function (error, msg) {
                if (msg === void 0) { msg = ''; }
                if (!msg)
                    msg = 'server error';
                return { error: error, message: msg };
            };
            return Fileupload;
        }());
        fileupload.Fileupload = Fileupload;
        angular
            .module('app.fileupload', []);
        angular
            .module('app.fileupload')
            .service('fileupload', Fileupload);
    })(fileupload = app.fileupload || (app.fileupload = {}));
})(app || (app = {}));

//# sourceMappingURL=fileupload.service.js.map
