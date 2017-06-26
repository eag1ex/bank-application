module app.main.modal {

    'use strict';
    export class MainController {
        public hideself:any;
        public handleClose: any;
        public handleDismiss: any;
        public tempData: any = [];
        public $dismiss: any;
        public modalData: any;
        public $close: any;
        public cats: any;
        public formDATA: any;
        static $inject: Array<string> = ['$scope', '$element', '$timeout'];
        /* @ngInject */
        constructor(
            public scope: any,
            public element: any,
            public timeout: any,
        ) {

            // initialize 
            this.modalInit();
        }

       /**
       * 
       * Our Ticket modal is the parent of emailForm component/directive
       * 
       */

        modalInit() {

            this.timeout(() => {
                // show first text description box;

                console.log('this.hideself',this.hideself)
                this.cats = this.modalData.cats;
                this.hideself=0;
                // updating       
                if (this.modalData.main.inx != null) {
                    console.log('updating..')
                    this.tempData = angular.copy(this.modalData.main.lists[0]);

                    // adding new    
                } if (this.modalData.main.newIndex >= 0) {
                    console.log('adding new..')
                    var newID = this.modalData.main.newIndex;
                    //passing data to object
                    this.tempData = {
                        id: newID,
                        name: 'new list',
                        tickets: [{ title: '' }],
                        catList: '',
                        desc: ''
                    }
                }

            this.addList();    

            }, 100)

            this.handleClose = () => {
                // not empty
                this.hideself=1;
                var returnArrayTickets = this.tempData.tickets.filter(function (n) {
                    return n.title != ''
                });
                this.tempData.tickets = returnArrayTickets;

                this.$close({ result: this.tempData }, function () {
                    this.tempData = [];
                });

            };
            this.handleDismiss = () => {
                this.$dismiss({
                    reason: 'cancel'
                });
            };
        }

        addList() {
            this.tempData.tickets.unshift({ title: '' });
        }
        removeList(index) {
            this.tempData.tickets.splice(index, 1);
            this.scope.$watch('tempData', () => {
                console.log('data changed!')
            })
        }
        addCatList(name, i) {
            this.tempData['catList'] = name;
        }
    }

    class MainComponent {
        constructor() { }
        bindings = {
            $close: '&',
            $dismiss: '&',
            modalData: '<?',
            hideself:"="
        };
        transclude = true;
        controllerAs = "vm";
        templateUrl = 'dist/js/app.modal.html';
        controller = MainController;
    }

    angular
        .module('app.main.modal', [])
    angular
        .module('app.main.modal').component('ticketModal', new MainComponent());
}
