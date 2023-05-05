const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");


// for user registration

router.post("/register", async (req, res) => {

    const { fname, email, password ,age} = req.body;

    if (!fname || !email || !password || !age) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {

        const preuser = await userdb.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This Email is Already Exist" })
        // } else if (password !== cpassword) {
        //     res.status(422).json({ error: "Password and Confirm Password Not Match" })
         } else {
            const finalUser = new userdb({
                fname, email, password, age
            });

            // here password hasing

            const storeData = await finalUser.save();

            // console.log(storeData);
            res.status(201).json({ status: 201, storeData })
        }

    } catch (error) {
        res.status(422).json(error);
        console.log("catch block error");
    }

});




// user Login

router.post("/login", async (req, res) => {
    

    const { email, password } = req.body;
    console.log('email', email)
    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {
       const userValid = await userdb.findOne({email:email});
       console.log('userValid', userValid)

        if(userValid){

            const isMatch = await bcrypt.compare(password,userValid.password);
            console.log('isMatch', isMatch)

            if(!isMatch){
                res.status(422).json({ error: "invalid details"})
            }else{

                // token generate
                const token = await userValid.generateAuthtoken();
                console.log('token', token)

                // cookiegenerate
                res.cookie("usercookie",token,{
                    expires:new Date(Date.now()+9000000),
                    httpOnly:true
                });

                const result = {
                    userValid,
                    token
                }
                res.status(201).json({status:201,result})
            }
        }

    } catch (error) {
        res.status(401).json(error);
        console.log(error);
    }
});



// user valid
router.get("/validuser",authenticate,async(req,res)=>{
    console.log('req', res)
    
    try {
        const ValidUserOne = await userdb.findOne({_id:req.userId});
        res.status(201).json({status:201,ValidUserOne});
    } catch (error) {
        res.status(401).json({status:401,error});
    }
});

router.patch("/updateUser/:id", async(req, res) => {
    const _id = req.params.id
    console.log(_id);
 try{
        const updatedUser = await userdb.findByIdAndUpdate(_id, {fname: req.body.fname, email: req.body.email, age:req.body.age}, 
         {
             new: true,
             runValidators: true
         })
       
        res.status(200).json({
           message: "updated users",
           data: updatedUser
        })
 }
 catch(e) {
        res.status(400).json({
           message: e.message
        })
 }
})
// user logout

router.get("/logout",authenticate,async(req,res)=>{
    try {
        req.rootUser.tokens =  req.rootUser.tokens.filter((curelem)=>{
            return curelem.token !== req.token
        });

        res.clearCookie("usercookie",{path:"/"});

        req.rootUser.save();

        res.status(201).json({status:201})

    } catch (error) {
        res.status(401).json({status:401,error})
    }
})


module.exports = router;



// 2 way connection
// 12345 ---> e#@$hagsjd
// e#@$hagsjd -->  12345

// hashing compare
// 1 way connection
// 1234 ->> e#@$hagsjd
// 1234->> (e#@$hagsjd,e#@$hagsjd)=> true



