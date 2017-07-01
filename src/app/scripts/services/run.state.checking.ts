module app.core.stateChecking {
    'use strict';

    interface IPeople {
        id: number;
        firstName: string;
        lastName: string;
        age: number;
        location: string;
    }

    export class MockData {

        /* @ngInject */
        constructor(private dataservice: any) {

        }

        run(e, toState, state) {
            if (this.dataservice === undefined) {
                console.log('this.dataservice not available');
                return;
            }

            // if not registered to not let to TC page
            if (this.dataservice.GLOB().token !== undefined && toState.name == "welcome") {
                e.preventDefault();
                state.go('terms');
                console.log('You have token, redirecting to terms')
            }

            // if not registered to not let to TC page
            if (this.dataservice.GLOB().terms === true && toState.name == "terms") {
                e.preventDefault();
                state.go('application');
                console.log('You already accepted terms, redirecting to application')
            }


            /// if no cached data, only allow on welcome page!
            if (this.dataservice.GLOB().cached === undefined && toState.name !== "welcome") {
                e.preventDefault();
                state.go('welcome');
                console.log('no cached data availabe, declined')
            }

            // if not registered to not let to TC page
            if (this.dataservice.GLOB().token === undefined && toState.name == "terms") {
                e.preventDefault();
                state.go('welcome');
                console.log('you are not registered, declined')
            }

            if (toState.name == 'application') {
                if (this.dataservice.GLOB().terms == false || this.dataservice.GLOB().terms == undefined) {
                    e.preventDefault();
                    state.go('terms');
                    console.log('terms not accepted')
                }

                if (this.dataservice.GLOB().terms == true) {
                    console.log('terms accepted')
                }

            } else if (toState.module === 'public') {
                e.preventDefault();
                // state.go('tool.suggestions');
            };

        }

    }

    angular
        .module('app.core.stateChecking', []);

    angular
        .module('app.core.stateChecking')
        .service('stateChecking', MockData)
}