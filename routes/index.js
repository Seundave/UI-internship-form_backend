const router = require("express").Router();
const { 
    getInterns,  
    deleteIntern, 
    addIntern 
} = require("../controllers");


router.get("/user/", getInterns);
router.delete("/delete", deleteIntern);
router.post("/register", addIntern);



module.exports = router;
