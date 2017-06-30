declare var API_MAIN;

module app.core {
  'use strict';
  angular.module('app.core', []);

  angular
    .module('app.core')
    .config(configure)
    .run(appRun)
    .constant('_', window._)
    .constant('API', {'URL':"http:"+API_MAIN,  'DATA':null});

  /* @ngInject */
  function appRun($rootScope,$timeout) {

   // httpbackedMockService.run();

      //lodash globaly
        $rootScope._ = window._;
        $rootScope.angularLoader = 0;
        $rootScope.$on("$stateChangeSuccess", ()=>{     
          console.log('angular Loaded');
        });     
  };


  /* @ngInject */
  function configure($stateProvider, $locationProvider, $urlRouterProvider,$qProvider) {

    $qProvider.errorOnUnhandledRejections(false);
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/app');

    var states: any[] = getStates();
    states.forEach(function (state) {
      console.log('state> ',state.state)
      $stateProvider.state(state.state, state.config);
    });
  }
  function getStates(): any[] {

    return [
       {
        state: 'welcome',
        config: {
          url: '/app',
          template: '<welcome></welcome>',
          title: 'Welcome',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> Dashboard'
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
            nav: 2,
            content: '<i class="fa fa-dashboard"></i> Dashboard'
          },
        }
      }
    ];
  }
};