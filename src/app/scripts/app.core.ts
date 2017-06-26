module app {
  'use strict';
  angular.module('app.core', []);

  angular
    .module('app.core')
    .config(configureStates)
    .run(appRun)
    .constant('_', window._)
    .constant('API', {'EMAIL':"http://localhost:3100/send",  'DATA':null})

  appRun['$inject'] = ['$rootScope','$timeout','httpbackedMockService'];
  function appRun($rootScope,$timeout,httpbackedMockService) {
       //////// run fake server
    httpbackedMockService.run();

      //lodash globaly
        $rootScope._ = window._;
        $rootScope.angularLoader = 0;
        $rootScope.$on("$stateChangeSuccess", function(){       
          console.log('angular Loaded');
        });     
  }

  configureStates['$inject'] = ['$stateProvider', '$locationProvider', '$urlRouterProvider','$qProvider'];
  /* @ngInject */
  function configureStates($stateProvider, $locationProvider, $urlRouterProvider,$qProvider) {

    $qProvider.errorOnUnhandledRejections(false);
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    var states: any[] = getStates();
    states.forEach(function (state) {
      console.log('state> ',state.state)
      $stateProvider.state(state.state, state.config);
    });
  }
  function getStates(): any[] {

    return [
      {
        state: 'main',
        config: {
          url: '/',
          template: '<main></main>',
          title: 'main',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> Dashboard'
          },
        }
      }
    ];
  }
}

