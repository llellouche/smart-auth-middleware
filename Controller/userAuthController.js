const userAuth = require('../Model/user-auth')
const userAuthController = {}

userAuthController.userAuth = async (req, res)=> {
    try {
        const user = await userAuth.login(req.body?.email, req.body?.password)
        let status = 200;
        if (user == undefined) {
            status = 401;
        }

        user['@id'] = '/users/' + user.id;
        res.status(status).json(user)
    } catch (err) {
        console.log(err)
        throw err
    }
}

userAuthController.userRegister = async (req, res)=> {
    try {
        const user = await userAuth.register(req.body?.email, req.body?.username, req.body?.password)
        let status = 200;
        if (user == undefined) {
            status = 500;
        }

        user['@id'] = '/users/' + user.id;
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        throw err
    }
}

module.exports = userAuthController
