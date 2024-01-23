var app;
(function (app) {
    var formModel;
    (function (formModel) {
        var Form = /** @class */ (function () {
            function Form(dataservice, _t, APPFORM) {
                this.dataservice = dataservice;
                this._t = _t;
                this.APPFORM = APPFORM;
            }
            Form.prototype.model = function () {
                var _this = this;
                var _t = this._t;
                if (!this.dataservice)
                    return;
                var appFormClass = function (val) {
                    var _this = this;
                    if (val === void 0) { val = 'one'; }
                    this.one = { /*index: 9,*/ valid: null };
                    this.two = { /*index: 4,*/ valid: null };
                    this.three = { /*index: 3,*/ valid: null };
                    this.final = { /*index: 1,*/ valid: null }; // inportant for server decission to not final save.
                    this.update = function (d) {
                        if (d === void 0) { d = _t.APPFORM; }
                        var data = {
                            one: Object.assign({}, d.one, { className: ".step-one" }),
                            two: Object.assign({}, d.two, { className: ".step-two" }),
                            three: Object.assign({}, d.three, { className: ".step-three" }),
                            final: Object.assign({}, d.final, { className: ".step-final" })
                        };
                        console.info('Form.model.update() called');
                        return data;
                    };
                    this.data = this.update;
                    this.nextClass = function (v) {
                        if (v === void 0) { v = val; }
                        var next = 0;
                        var data = _this.data();
                        for (var key in data) {
                            if (next === 1)
                                return data[key].className;
                            if (key === v)
                                next++;
                        }
                    };
                };
                //initially anyway
                this.APPFORM = _.merge(this.APPFORM, new appFormClass());
                // at this point we retreive cached data
                var deff = this.dataservice.getCached().then(function (data) {
                    if (data.form !== undefined && Object.keys(data.form).length > 0) {
                        _this.APPFORM = _.merge(_this.APPFORM, data.form);
                    }
                    return _this.APPFORM;
                });
                return deff;
            };
            return Form;
        }());
        formModel.Form = Form;
        angular.module('app.formModel', []);
        angular.module('app.formModel').factory('Form', function () {
            return Form;
        });
    })(formModel = app.formModel || (app.formModel = {}));
})(app || (app = {}));

//# sourceMappingURL=app.form.model.js.map
