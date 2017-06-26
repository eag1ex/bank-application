module app.projectName {
    'use strict';
    class ProjectName {

         static $inject: Array<string> = ['$scope','$elements','attrs'];
        static instance() {
            return new ProjectName();
        }

        template=`<input ng-model='$ctrl.projectName' class='form-control main-project-name' placeholder='Enter Project' value=''>`;
        restrict = 'E'; 
        controller(){

        }
        link(scope, elements, attrs) {
            var input = angular.element(elements[0]).find('input');
            input.focus(()=>{
            })
            input.focus();
        }
    }
    angular.module('app.projectName',[]);
    angular.module('app.projectName')
            .directive('projectName', ProjectName.instance);
}