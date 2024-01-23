var app;
(function (app) {
    'use strict';
    angular.module('app', [
        // dependant
        'ui.router',
        'ngAnimate',
        //services
        'app.formModel',
        'app.dataservice',
        'app.core.stateChecking',
        'app.fileupload',
        //structure
        'app.core',
        'app.layout',
        // states/components
        'app.welcome',
        'app.terms',
        'app.application',
        'app.complete',
        //directives
        'app.fileModel',
        'app.validateNumber',
        'app.uivalidation'
    ]);
})(app || (app = {}));

//# sourceMappingURL=app.js.map
