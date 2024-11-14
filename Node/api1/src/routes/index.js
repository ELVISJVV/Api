const { Router } = require( 'express' );




const router = Router();



router.use( '/admin', adminRouter );

module.exports = router;