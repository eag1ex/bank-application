module app.formModel {
    export class Form {

        constructor(private dataservice: any, private _t:any, private APPFORM:any) {

        }

        model() {
            let _t = this._t;
            if (!this.dataservice) return;

            let appFormClass = function (val = 'one') {

                this.one = { /*index: 9,*/ valid: false };
                this.two = { /*index: 4,*/ valid: false };
                this.three = { /*index: 3,*/ valid: false };
                this.final = { /*index: 1,*/ valid: null };// inportant for server decission to not final save

                this.update = (d = _t.APPFORM) => {
                    let data = {
                        one: Object.assign({}, d.one, { className: ".step-one" }),
                        two: Object.assign({}, d.two, { className: ".step-two" }),
                        three: Object.assign({}, d.three, { className: ".step-three" }),
                        final: Object.assign({}, d.final, { className: ".step-final" })
                    }
                    return data;
                }

                this.data = this.update;
                this.nextClass = (v = val) => {
                    var next = 0;
                    var data = this.data();
                    for (var key in data) {
                        if (next === 1) return data[key].className;
                        if (key === v) next++;
                    }
                }
            };

            //initially anyway
            this.APPFORM = _.merge(this.APPFORM, new appFormClass());

            // at this point we retreive cached data
            let deff = this.dataservice.getCached().then((data) => {
                // console.log('got cached data! ',data)
                if (data.form !== undefined && Object.keys(data.form).length > 0) {
                    this.APPFORM = _.merge(this.APPFORM, data.form);
                    console.log('we have data with form', this.APPFORM);
                }
                return this.APPFORM;
            });
            return deff;
        }
    }

    angular.module('app.formModel', []);
    angular.module('app.formModel').factory('Form', () => {
        return Form;
    });
}