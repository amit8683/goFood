const  express = require('express');
const {registerController}=require('../controllers/userCtrl');
const router = express.Router();


//REGISTER || POST

router.post('/signups',registerController);



module.exports = router;