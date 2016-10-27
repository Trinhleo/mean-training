var userDao = require('./../dao/user.dao');
var cryptoPasswordUtil = require('./../services/crypto-password.ultil');
var jwt = require('./../services/jwt.ultil');

module.exports = {
    signup: signup,
    signin: signin,
    signout: signout
};

function signin(req, res) {
    console.log(req.body);
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({
            message: "error input information!"
        })
    };
    var hashedpassword = cryptoPasswordUtil.cryptoPassword(req.body.password);
    console.log(hashedpassword)
    var user = {
        username: req.body.username,
        password: hashedpassword
    };

    userDao.readUser(user, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "internal error"
            })
        };

        if (result && user.password === result.password) {
            var token_info = {
                _id: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                profileImageURL: result.profileImageURL,
                createtionDate: result.createtionDate
            };
            var token = jwt.signToken(token_info);
            // var userInfo = {
            //     _id: result._id,
            //     firstName: result.firstName,
            //     lastName: result.lastName,
            //     email: result.email,
            //     createtionDate: result.createtionDate
            // };
            res.status(200).send({
                userInfo: token_info,
                name: result.firstName + " " + result.lastName,
                access_token: token
            });
        } else {
            res.status(400).send({
                message: "username or password is false!"
            });
        };
    });
};

function signup(req, res) {
    console.log(req.body);
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.username || !req.body.password) {
        return res.status(403).send({
            message: "error input information!"
        });
    };
    var hashedpassword = cryptoPasswordUtil.cryptoPassword(req.body.password);
    console.log(hashedpassword)
    var creditial = {
        firstName: req.body.firstName,
        username: req.body.username,
        password: hashedpassword,
        email: req.body.email,
        lastName: req.body.lastName
    }
    userDao.readUser(creditial, function (err, result) {
        if (err) {
            return res.status(500).send({
                message: "internal error"
            })
        };
        if (null != result) {
            return res.status(400).send("user is existed!")
        }
        userDao.createUser(creditial, function (err, result) {
            if (err) {
                return res.status(400).send({
                    errorcode: err.code,
                    errorms: err.errmsg
                });
            };
            var userInfo = {
                _id: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                createtionDate: result.createtionDate
            };
            res.status(200).send(userInfo);
        });
    });
};

function signout(req, res) {
    res.status(200).send("signed out");
}