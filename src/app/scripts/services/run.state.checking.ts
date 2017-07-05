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
                e.preventDefault();
                state.go('welcome');
            }
            console.log('what is token', this.dataservice.GLOBALS.token)

            // if not registered to not let to TC page
            if (!this.dataservice.GLOBALS.token && toState.name !== "welcome") {
                e.preventDefault();
                state.go('welcome');
                console.log('you are not registered, declined')
            }

            // if not registered to not let to TC page
            if (this.dataservice.GLOBALS.token && toState.name == "welcome") {
                e.preventDefault();
                state.go('terms');
                console.log('You have token, redirecting to terms')
            }

            // if not registered to not let to TC page
            if (this.dataservice.GLOBALS.terms === true && toState.name == "terms") {
                e.preventDefault();
                state.go('application');
                console.log('You already accepted terms, redirecting to application')
            }



            if (toState.name == 'application') {
                if (this.dataservice.GLOBALS.terms == false || this.dataservice.GLOBALS.terms == undefined) {
                    e.preventDefault();
                    state.go('terms');
                    console.log('terms not accepted')
                }
            }
        }

    }

    angular
        .module('app.core.stateChecking', []);

    angular
        .module('app.core.stateChecking')
        .service('stateChecking', MockData)
}