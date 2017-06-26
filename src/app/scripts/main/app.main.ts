module app.main {
  'use strict';
  export class MainController {
    public dataForModal: any;
    public lists = [];
    public category: any;
    public test1:any;
    public user: any;
    static $inject: Array<string> = ['$scope', '$element', '$document', '$uibModal', '$timeout', '$q', 'dataservice'];
    /* @ngInject */
    constructor(
      public scope: any,
      public element: any,
      public document: any,
      public modal: any,
      public timeout: any,
      public q: any,
      private DataService
    ) {

      element.dblclick((e) => {
        if (e.target.nodeName == 'INPUT') return false;
        this.openModal(false, null);
      })

      //our data!  
      DataService.get().then((data) => {
        this.user = data.user;
        this.lists = data.lists;
      }, (error) => {
        console.log('data not available', error)
      })
    }

    

    test(text){
      this.test1=text;
    }


    openModal(elmData, _inx) {

      //new item
      if (!elmData && !_inx) {
        this.dataForModal = {
          newIndex: this.lists.length,
        }
        
      }
      //updating item
      else {
        this.dataForModal = {
          lists: [elmData],
          inx: _inx
        }
      }

      /**
       * Calling our modal which loads modal directive/component 'ticketModal'
       * 
       */
       var _t = this;
      this.modal.open({
     //   windowClass:'ng-show',
       // backdropClass:'ng-show'
        animation: true,
        template: `<ticket-modal hideself='vm.hideself'
                    ng-hide="vm.hideself==1"
                    modal-data="vm.modalData" $close="$close(result)" 
                    $dismiss="$dismiss(reason)"></ticket-modal>`,

        controller: ['modalData','hideself', function (modalData,hideself) {
          this.modalData = modalData;
          this.hideself=hideself;
        }],
        controllerAs: 'vm',
        resolve: {
          hideself:0,
          modalData: () => {
            return {
              cats: this.scope.$parent.$ctrl.category,
              main: this.dataForModal,
              user: this.user
            }
          }
        }
      }).result.then((result) => {
        var ListsTotalLenght = this.lists.length - 1;

        //update
        if (_inx <= ListsTotalLenght) this.lists[_inx] = result;

        //add new
        if (result.id > ListsTotalLenght) {
          // sord latest to oldest
          this.lists = _.orderBy(this.lists.concat(result), ['id'], ['desc', 'asc']);
        }

      }, function (reason) {
        console.log('modal failed!', reason)
      });

    }

    addCard(elmData, i) {
      var tempData = angular.copy(elmData);

      var mergeData = (data) => {
        var deferred = this.q.defer();
        if (data) deferred.resolve(data);
        else deferred.reject('error data');
        return deferred.promise;
      }
      var datPromiss = mergeData(tempData);
      datPromiss.then((data) => {
        this.lists[i].tickets.unshift({ title: data });

      }).finally(() => {
        console.log('data updated')
        return;
      }).catch((error) => {
        // console.log('error',error)
      })

    }// addcard

    deleteCard(index) {
      this.lists.splice(index, 1);
      this.scope.$watch('lists', () => {
        console.log('card removed!')
      })
    }
  }

  class MainComponent {

    constructor() { }
    restrict = 'E';
    controllerAs = "vm";
    templateUrl = 'dist/js/app.main.html';
    controller = MainController;
  }

  angular
    .module('app.main', ['app.main.modal'])
  angular
    .module('app.main').component('main', new MainComponent());
}
