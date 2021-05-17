const router = require('express').Router();
const {ADDEVENTS, EDITEVENTS, FAVEVENTS, DELEVENTS} = require('../controller/events');
const {REGISTER, LOGIN, LOGOUT_USER, FORGOTPASSWORD, RESETPASSWORD, DEL_USER, GET_USER, VERIFYEMAIL} = require('../controller/users');
const {ADD_TODO, DEL_TODO, EDIT_TODO} = require('../controller/todos');
const { IS_AUTHENTICATED } = require('../middlewares/authcheck');

router.post('/addevents', IS_AUTHENTICATED, ADDEVENTS);
router.post('/editevents', IS_AUTHENTICATED, EDITEVENTS);
router.post('/favevents', IS_AUTHENTICATED, FAVEVENTS);
router.post('/delevents', IS_AUTHENTICATED, DELEVENTS);
router.post('/register', REGISTER);
router.post('/login', LOGIN);
router.post('/logout', IS_AUTHENTICATED ,LOGOUT_USER);
router.post('/forgot-password', FORGOTPASSWORD);
router.post('/reset-password/:id/:token', RESETPASSWORD);
router.post('/addtodo', IS_AUTHENTICATED ,ADD_TODO);
router.post('/deltodo',IS_AUTHENTICATED, DEL_TODO);
router.post('/edittodo',IS_AUTHENTICATED, EDIT_TODO);
router.post('/deluser', IS_AUTHENTICATED, DEL_USER);
router.post('/getuser', IS_AUTHENTICATED, GET_USER);
router.post('/first-set-password/verify/:password/:token', VERIFYEMAIL);

router.get('/',(_,res) => {
    res.status(200).json({
        message: "User Home Page"
    })
})

module.exports = router;