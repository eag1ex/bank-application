module app.data {
    'use strict';

    interface IPeople {
        id: number;
        firstName: string;
        lastName: string;
        age: number;
        location: string;
    }

    export class MockData {
        static $inject: Array<string> = ['$q'];

        /* @ngInject */
        constructor(private q: any) {

        }

        data() {
            var deferred = this.q.defer();
            // var data {}
            return { // using httpbackendmockservice
                category: this.categories(),
                user: this.user(),
                lists: this.lists()
            }
           // if (data) deferred.resolve(data);
           // else deferred.reject('error data not found');
            //return deferred.promise;
        }

        categories() {
            var category = [
                'Inspiration',
                'On Hold',
                'Done',
                "In Progress"
            ];
            return category;
        }

        user() {
            var user = {
                firstName: "Guy",
                lastName: "",
                company: "Invision",
                email: "guy@email.com",
            }
            return user;
        }

        lists() {
            var lists = [
                {
                    id: 0,
                    name: 'list 1',
                    catList: '',
                    tickets: [
                        { title: 'task 1' },
                        { title: 'task 2' }
                    ],
                    desc: 'this is a Trello new project, please give me your feedback!'
                },
                {
                    id: 1,
                    name: 'list 2',
                    catList: '',
                    tickets: [
                        { title: 'task 3' },
                        { title: 'task 4' }
                    ],
                    desc: 'A new Trello Angular project what is your feedback!'
                }
            ];
            return lists;
        }




    }

    angular
        .module('app.mockData', []);

    angular
        .module('app.mockData')
        .service('mockData', MockData)
}