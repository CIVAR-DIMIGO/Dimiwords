var express = require('express');
var router = express.Router();
var auth = require('../../auth.js');
var Word = require('../../models/words.js');

router.post('/', (req, res) => { // add new word
    var english = req.body.en;
    var korean = req.body.ko;
    var token = req.body.token;
    if (!token){
        res.send({
            success: false,
            message: 'No token provided'
        })
        return
    }
    try {
        var user_id = auth.verify(token).id;
    } catch(err) {
        console.log(err)
        res.send({
            success: false,
            message: 'failed to verify token'
        })
        return
    }  
    console.log(req.body)
    Word.find({en: english, ko: korean}, function (err, docs) {
        // console.log(docs)
        if (docs.length){
            res.send({
                success: false,
                message: 'Word exists'
            })
        } else {                
            var new_word = new Word({
                en: english,
                ko: korean.sort(),
                // sort Korean 
                user_id: user_id
            })
            // console.log(new_word)
            
            new_word.save(function (error) {
                if (error) { console.log(error) }
                res.send({
                    success: true,
                    message: 'Word saved successfully'
                })
            })
        }
    });
})

module.exports = router;