const router = require('express').Router();
const ViewEvents = require('./events');
const todos = require('./todos');
const session = require('./session');
const { IS_AUTHENTICATED } = require('../middlewares/authcheck')

router.use('/viewevents', IS_AUTHENTICATED, ViewEvents);
router.use('/session', session);
router.use('/todos', IS_AUTHENTICATED, todos);

router.get('/',(_,res)=>{
    res.status(200).json({
        message: "Welcome to user API"
    });
})

module.exports = router;