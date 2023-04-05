const express = require('express')
const router = express.Router();
const Admin = require('../models/admin')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyBlackList = require('./verifyJWT')

router.get('/', (req,res) => {
    const token = req.cookies.jwt;
    try{        
        const decoded = jwt.verify(token,process.env.ADMIN_TOKEN)
        res.redirect('/add')
    }catch{
        const myError = req.query.myError;
        res.render('login', { myError })
    }

})

router.get('/log', (req,res) => {
    const myError = req.query.myError;
    res.render('login', { myError })
})

router.post('/logout', verifyBlackList, (req,res) => {
    blacklist.push(req.cookies.jwt)
    res.redirect('/login?myError=' + req.query.myError)
})

router.post('/', (req,res) => {    
    Admin.findOne({user_name : req.body.user_name}, async (err,thisAdmin) => {
        if (err){
            res.send('ERROR')
        }else if (thisAdmin!=null){
            try
            {
                if (await bcrypt.compare(req.body.user_pwd, thisAdmin.user_pwd)){
                    const accessToken = jwt.sign({usernameJWT : thisAdmin.user_name}, process.env.ADMIN_TOKEN, {expiresIn: '1h'})
                    res.cookie('jwt',accessToken)
                    res.redirect('/add')
                }else{
                    const myError = 'Λάθος Όνομα ή Κωδικός'
                    res.redirect('/login?myError=' + myError )
                }    
            }
            catch(error){

            }        
        }else{
            res.send('User not found')
        }
    })
})

// router.post('/', async (req,res) => {
//     try {
//         const salt = await bcrypt.genSalt()
//         const hashedPwd = await bcrypt.hash(req.body.user_pwd, salt)
//         const newAdmin = new Admin({
//             user_pwd: hashedPwd,
//             user_name: req.body.user_name       
//         })
//         await newAdmin.save()
//         res.status(201).send()
//     }catch(err){
//         res.send('ERROR SAVING ADMIN')
//     }
// })

module.exports = router;