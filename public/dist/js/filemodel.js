var app;
(function (app) {
    var fileModel;
    (function (fileModel) {
        'use strict';
        angular.module('app.fileModel', []);
        angular.module('app.fileModel')
            /* @ngInject */
            .directive("filemodel", ["$parse", function ($parse) {
            return {
                restrict: "A",
                link: function (scope, element, attrs) {
                    var model = $parse(attrs['filemodel']); // our name
                    var modelSetter = model.assign;
                    element.bind('change', function (e) {
                        var f = e.target.files[0];
                        var file = f ? f : undefined;
                        scope.$apply(function () {
                            //update ui message
                            scope.$emit("uploadedFile", { file: file.name, name: attrs.name });
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }]);
    })(fileModel = app.fileModel || (app.fileModel = {}));
})(app || (app = {}));

//# sourceMappingURL=filemodel.js.map
