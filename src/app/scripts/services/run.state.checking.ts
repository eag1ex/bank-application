module app.core.stateChecking {
    'use strict';

    export class StateChecking {

        /**
         * we have moved the functionaliti from the on .run to its seperate module, its more clear 
         * of what is happening here.
         * we validate so only existing users with valid token can enter the particular states.
         * existing users is they approved the TC and saved at least first form step will ultimatly be 
         * retidested from welcom to application page.
         */

        /* @ngInject */
        constructor(private dataservice: any) {

        }

        run(e, toState, state, location) {
            if (this.dataservice === undefined) {
                console.info('this.dataservice not available');
                e.preventDefault();
                state.go('welcome');
            }


            //dataservice.GLOBALS
            if (this.dataservice.GLOBALS.form !== undefined && toState.name !== 'complete') {
                if (this.dataservice.GLOBALS.form.final.valid === true) {
                    let decission = (this.dataservice.GLOBALS.form.approved === true) ? 'approved' : 'declined';
                    e.preventDefault();
                    state.go('complete', { decission: decission });
                    console.info('you already completed the form');
                }
            }
            // if not registered,only allow on welcome page
            if (!this.dataservice.GLOBALS.token && toState.name !== "welcome") {
                e.preventDefault();
                state.go('welcome');
                console.info('you are not registered')
            }

            // if not registered,only allow on welcome page
            if (!this.dataservice.GLOBALS.token && toState.name !== "welcome") {
                e.preventDefault();
                state.go('welcome');
                console.info('you are not registered')
            }

            // if not registered do not let to TC page
            if (this.dataservice.GLOBALS.token && toState.name === "welcome") {
                e.preventDefault();
                state.go('terms');
                console.log('You have token, redirecting to terms')
            }

            // if terms are approved already skip to next application state.
            if (this.dataservice.GLOBALS.terms === true && toState.name === "terms") {
                e.preventDefault();
                state.go('application');
                console.log('You already accepted terms, redirecting to application')
            }

            // if terms not signed return and sing.
            if (toState.name === 'application') {
                if (this.dataservice.GLOBALS.terms === false || this.dataservice.GLOBALS.terms === undefined) {
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
        /* @ngInject */
        .service('stateChecking', StateChecking)
}