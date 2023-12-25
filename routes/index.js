const router = require("express").Router();
const { 
    getInterns,  
    deleteIntern, 
    addIntern, 
    signUpAdmin,
    signInAdmin
} = require("../controllers");


router.get("/user/", getInterns);
router.delete("/delete", deleteIntern);
router.post("/register", addIntern);
router.post("/signup", signUpAdmin);
router.post("/signin", signInAdmin);



module.exports = router;
