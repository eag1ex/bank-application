/**
 * controller.registerAndSave
 * controller.uploadImage
 * controller.initialSetup
 * controller.updateUser
 */


module.exports = (upload, Bankuser, jsonData) => {

    function errorHandler(err, res, req, next) {
        throw new Error(err);
    }


    /**
     * controller.registerAndSave
     * 
     * this function has 2 purpouses, it registers a new user to DB, and also it returns existing user and skips registration.
     * the registration function has a callback promiss that saves  data to DB for new user, or returns existing user.
     * function retuires a token
     */

    function registerAndSave(req, res) {

        let checkTok = req.params.token || "??><$%^";
        let tokenOK = checkTok.match(/^[a-zA-Z0-9\s]*$/);

        if (!tokenOK) {
            return res.status(200).json({
                userExists: false,
                message: 'token invalid!',
                success: false,
                newUser: false,
                invalidToken: true
            });
        }

        if (!req.params.token) {
            return res.status(200).json({
                userExists: false,
                message: 'no token found',
                success: false,
                newUser: false
            });
        }


        var _TOKEN_ = req.params.token;
        // check for existing user before registering new token
        //
        let userfound = findUser(() => {
            let promise = new Promise((resolve, reject) => {
                resolve({ token: _TOKEN_ })
            })
            return promise;
        }, res);

        userfound.then((data) => {
            // if existing user not found move on!
            if (!data) return false;


            return res.json({
                message: 'user data found!',
                userExists: true,
                newUser: false,
                data: data
            });

        }).then((data) => {
            /// register new user here
            if (data === false) registerNew();

        }, (err) => {
            return res.json({ serverError: "could not do post/register request" })
        }).catch((err) => console.log(err));


        function registerNew() {
            let user = new Bankuser(
                {
                    token: req.params.token,
                    date: new Date(),
                    form: {}
                });

            // save
            user.save(function (err) {
                if (err) errorHandler(err, res);

                return res.status(200).json({
                    message: 'registered new user token',
                    success: true,
                    newUser: true,
                    userExists: false,
                    data: user
                });
            });
        }
    }//registerAndSave


    /**
     * @findUser using promiss with callback from POST/register route
     */
    function findUser(callbackPromise, res) {
        var dataFound = false;
        return callbackPromise().then((tokenName) => {

            var query = Bankuser.where({ token: tokenName.token });
            return query.findOne(function (err, obj) {
                if (obj === null) {
                    console.log('no Bankuser with token ' + tokenName.token + " found!")
                    return dataFound;
                }

                if (err) errorHandler(err, res);

                if (obj) {
                    dataFound = obj;
                    return dataFound;
                }
            });
        });
    }

    /**
     * controller.uploadImage
     * 
     * the upload function uses multer and storage to work.
     * it also returns new generated image/file name saved on server back to the client, 
     * to save back to DB on final post request.
     */

    function uploadImage(req, res) {

        upload(req, res, (err) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                    message: 'error uploading file',
                    err:err
                })
            }
            return res.status(200).json({
                success:true,
                file: req.protocol + '://' + req.get('host') + '/images/' + req.file.originalname,
                response: req.file
            })
        })

    }//uploadImage


    /**
     * controller.updateUser
     * 
     * we update user and require token to perform search, then we update the user
     * if user.form.final.valid===true  then we save additional fields and handle on 
     * client side.
     * 
     * This function calls on every subsequent save of the falid steps.
     */

    function updateUser(req, res) {

        if (req.body.token === undefined || req.body.token == '') {
            return res.status(404).json({
                message: 'no token found!',
                success: false
            })
        }

        let tokenID = req.body.token;
        let newData = req.body.form;

        var query = Bankuser.where({ token: tokenID });
        query.findOne(function (err, obj) {
            if (obj === null) {

                return res.status(404).json({
                    message: 'no data found',
                    success: false
                });

            }
            if (err) errorHandler(err, res);
            if (obj._id) saveUserToDB(obj._id, newData, res);
        })// findOne

    }//updateUser

    /**
     * saveUserToDB works with updateUser
     */

    function saveUserToDB(findID, formData, res) {

        Bankuser.findById(findID, function (err, user) {
            if (err) errorHandler(err, res);

            // MAGIC HERE
            user.form = formData;
            if (user.form['final'].valid === true) {
                if (!user.form.accountNumber) {
                    if (user.form.approved === true) {
                        user.form.contactBranchNumber = '';
                        user.form.accountNumber = Date.now().toString();
                    } if (user.form.approved === false) {
                        user.form.accountNumber = '';
                        user.form.contactBranchNumber = '+66 08-54-23-556';
                    }

                    console.log('saving final application', user);

                } else {
                    // nothing else is required
                }
            }
            console.log('user will be saved', user);

            user.save(function (err) {
                if (err) errorHandler(err, res);
                return res.status(200).json({ data: user, success: true })
            }, () => errorHandler(err, res));
        });
    }// saveUser


    /**
     * an initial function to populate 1 user database from jsonfile './server/config/initial_data.json'
     */

    function initialSetup(req, res) {
        if (!jsonData.data) {
            return res.status(200).json({
                message: 'json data not available for new db',
                success: false
            });

        }
        // create
        let user1 = new Bankuser(
            {
                token: jsonData.data[0].token, // token length should be max 11 in length
                form: jsonData.data[0].form
            });

        // save
        user1.save(function (err) {
            if (err) throw err;
            return res.status(200).json({
                message: 'populated db for jsonfile',
                success: true,
                data: user1
            });
        });
    }//initialSetup


    return {
        registerAndSave: registerAndSave,
        updateUser: updateUser,
        initialSetup: initialSetup,
        uploadImage: uploadImage
    }
}