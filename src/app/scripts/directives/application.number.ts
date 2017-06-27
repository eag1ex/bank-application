module app.appNumber {
    'use strict';
    class Appnumber {

        static $inject: Array<string> = ['$scope','$elements','attrs'];
        static instance() {
            return new Appnumber();
        }   

        template=`<input ng-model='appNumber' class='form-control main-project-name' placeholder='Enter Project' value=''>`;
        restrict = 'E'; 
        replace = true
        scope={
            appNumber: '=ngModel'
        };
        controllerAs="vm";
        controller(){

        }
        link($scope, elements, attrs) {
                $scope.appNumber=123235;
            
            var input = angular.element(elements[0]).find('input');
            input.focus(()=>{
            })
            input.focus();
        }
    }
    angular.module('app.appNumber',[]);
    angular.module('app.appNumber')
            .directive('appnumber', Appnumber.instance);
}