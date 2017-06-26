var emailTemplate;
module app.emailForm {
    'use strict';
    export class EmailFormController {

        static $inject: Array<string> = ['$scope', '$element', '$http', '$q', '$timeout','API']
        public myvar;
        public formClick;
        public myForm: any;
        public emailTo: any;
        public emailSend:any;
        public hideform:any=0;
        public form:any=0
        constructor(
            public scope,
            public element,
            public http,
            public q,
            public timeout,
            public API
        ) {
            this.form={
                is:0
            }

            this.emailSend = {
                send:0,
                error:0,
                serverERR:0,
                close:0
            }

            //reset values once hideform is closed                   
            this.scope.$watch(()=>{
                    if(this.hideform==1){
                            //reset server messages
                            this.emailSend.serverERR=0; 
                            this.emailSend.error=0;
                            this.emailSend.send=0;
                            
                            //rset form fields
                            var formReset = this.scope.myForm
                            this.form.is=0;
                            this.emailTo='',
                            formReset.$setPristine(true);
                    }
            },true);
        }

        /**
       * Our emailForm is the dependant of ticketModal component/directive
       * is grabs data from to send email.
       */


        sendFormRequest() {
            var formis = this.scope.myForm.emailTo;
            if (!formis.$valid && !formis.$dirty && formis.$modelValue.lenght == 0) {
                console.log('form is not valid');
                return;
            }

            var parentModalData = this.scope.vm.modal.tempData;
            var parentUserData = this.scope.vm.modal.modalData.user;
            var DATA ={
                fName: parentUserData.firstName,
                lName: parentUserData.lastName,
                emailFrom: parentUserData.email,
                emailTo: formis.$modelValue,
                company: parentUserData.company,
                ticket: parentModalData,
                subject:"Your Trello Ticket | "+parentModalData.name
            };

            this.http({               
                params: DATA,
                method: 'GET',
                url: this.API.EMAIL
            }).then((success)=> {
              
                if(success.data=='send'){                    
                   this.emailSend.serverERR=0; 
                   this.emailSend.error=0;
                   this.emailSend.send=1;
                   console.log('it went fine!', success.data);  
                   return;
                }
                else if(success.data=='error'){
                    this.emailSend.send=0; 
                    this.emailSend.error=1;
                    console.log('Server rerejected your request!', success); 
                    return;
                }
                return;
            }, (error)=> {
                console.log('your nomailer server is not running, or wrong API?:', this.API.EMAIL);
                this.emailSend.serverERR=1;
                this.emailSend.send=0;
                return;
            })
            /*
            .catch(()=>{
                console.log('catch???')
                console.log('your nomailer server is not running, or wrong API?:', this.API.EMAIL);
                this.emailSend.serverERR=1;
                this.emailSend.send=0;
                return;
            })
            */
        }

    }

    class MainComponent {
        constructor() { }
        require = {
            modal: '^^?ticketModal'
        }
         bindings = {
            hideform: '=',
        };
        transclude = true;
        controllerAs = "vm";
        template = () => {
            return emailTemplate;
        }
        controller = EmailFormController;
    }
    angular.module('app.emailForm', []);
    angular.module('app.emailForm')
        .component('emailForm', new MainComponent());
}



emailTemplate =
    `<a hre="#" ng-init='vm.hideform=0' class="close-email-form" ng-click="vm.hideform=1;"><i class="text-success fa fa-times fa-lg" aria-hidden="true"></i></a>
    <div class="px-0 container p-5" ng-model="vm.form">

<div class="display-message-wrap"> 
    <div class="mt-0 pt-0 px-3 center" 
                    ng-show='vm.form.is==1 && vm.emailSend.send==0 
                                && vm.emailSend.serverERR==0 && 
                                vm.emailSend.error==0'>
       <i class="mt-4 fa fa-spinner fa-spin" style="font-size:24px"></i>
    </div>


    <div class="mt-0 pt-0 px-3  return-message" ng-show='vm.form.is==1 && vm.emailSend.send==1'>
        <strong class="text-success form-control-feedback">
        <i class="fa fa-smile-o mr-2 fa-4x" aria-hidden="true"></i>
        Email Send</strong>
    </div>
    <div class="mt-0 pt-0 px-3  return-message" ng-show='vm.emailSend.serverERR==1;'>
        <strong class="text-danger form-control-danger">NodeMailer Server is not running? <br>>>{{vm.API.EMAIL}} </strong>
    </div>
        <div class="mt-0 pt-0 px-3  return-message" ng-show='vm.emailSend.error==1;'>
        <strong class="text-danger form-control-danger">Server rerejected your request!</strong>
    </div>
</div>

  <form  ng-model="vm.form" name="myForm" ng-submit="vm.form.is=1;" ng-hide='vm.form.is==1'>
    <div class="form-group row mb-1"
    ng-class="{'has-danger':myForm.emailTo.$invalid==true,
                'has-success':myForm.emailTo.$valid==true}">  

      <div class="col-12">
        <input name="emailTo"  
             ng-pattern="/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/"  required               
             ng-class="{'form-control-danger':myForm.emailTo.$invalid==true,
                         'form-control-success':myForm.emailTo.$valid==true && myForm.emailTo.$dirty==true && vm.emailTo.length>0 }"
             id="emailField" type="email" class="form-control w-100" placeholder="name@example.com" 
             ng-model="vm.emailTo">

        
      </div>
    </div>
    <button ng-click="vm.sendFormRequest();" type="submit" class="text-white float-right btn btn-md btn-success" 
             ng-show="myForm.emailTo.$valid==true && 
                       myForm.emailTo.$dirty==true && 
                       vm.emailTo.length>0">Submit</button>
  </form>
</div>
<div class='back-fill'></div>
`;