var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        appRun.$inject = ["$rootScope", "$timeout", "dataservice", "$state", "stateChecking", "$location"];
        configure.$inject = ["$stateProvider", "$locationProvider", "$urlRouterProvider", "$qProvider", "$httpProvider"];
        angular.module('app.core', []);
        angular
            .module('app.core')
            .config(configure)
            .run(appRun)
            .constant('_', window._)
            .constant('Rx', window.Rx || undefined)
            .constant('API', { 'URL': "https:" + API_MAIN, 'DATA': null });
        /* @ngInject */
        function appRun($rootScope, $timeout, dataservice, $state, stateChecking, $location) {
            // checking data valid, or clear all cache!
            dataservice.checkDataRetention();
            $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
                // controll page validation and rediraction
                stateChecking.run(e, toState, $state, $location);
            });
            //lodash globaly
            $rootScope._ = window._;
            $rootScope.angularLoader = 0;
            $rootScope.$on("$stateChangeSuccess", function () {
                console.info('Angular Loaded');
            });
        }
        /* @ngInject */
        function configure($stateProvider, $locationProvider, $urlRouterProvider, $qProvider, $httpProvider) {
            $qProvider.errorOnUnhandledRejections(false);
            $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
            $httpProvider.defaults.headers.post['Content-Type'] = 'multipart/form-data; charset=utf-8';
            $httpProvider.defaults.headers['Function-Code'] = 'DFKJ884576*_35465fdjfuyrt+_*45@%_=_*56%@!~^';
            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise('/app');
            var states = getStates();
            states.forEach(function (state) {
                console.log('state> ', state.state);
                $stateProvider.state(state.state, state.config);
            });
        }
        function getStates() {
            return [
                {
                    state: 'welcome',
                    config: {
                        url: '/app',
                        template: '<welcome></welcome>',
                        title: 'Welcome',
                        settings: {
                            nav: 1
                        },
                    }
                },
                {
                    state: 'terms',
                    config: {
                        url: '/app/tc',
                        template: '<terms></terms>',
                        title: 'Terms and Conditions',
                        settings: {
                            nav: 1
                        },
                    }
                },
                {
                    state: 'application',
                    config: {
                        url: '/app/application',
                        template: '<application></application>',
                        title: 'Application',
                        settings: {
                            nav: 1
                        },
                    },
                },
                {
                    state: 'complete',
                    config: {
                        url: '/app/application/:decission',
                        template: '<complete></complete>',
                        title: 'Complete',
                        settings: {
                            nav: 1
                        },
                    }
                }
            ];
        }
    })(core = app.core || (app.core = {}));
})(app || (app = {}));

//# sourceMappingURL=app.core.js.map
