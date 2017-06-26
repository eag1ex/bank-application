module app.data {

    export class MockService {
        static $inject: [string] = ['$httpBackend', 'mockData'];
        /* @ngInject */
        constructor(private $httpBackend: any, private mockData: any) {
        }

        public run() {
            var productUrl = "/api";
            let MOCKDATA = this.mockData.data();
            // console.log('MOCKDATA',MOCKDATA)   
            this.$httpBackend.whenGET(productUrl).respond(MOCKDATA);
            return this.$httpBackend.whenGET(productUrl).respond(function (method, url, data) {
                return [200, data, {}];
            });
            //this.$httpBackend.whenGET(/app/).passThrough();
        }
        public post() { }

    }

    angular
        .module('app.data.httpMock', []);

    angular
        .module('app.data.httpMock')
        /* @ngInject */
        .service('httpbackedMockService', MockService);
}