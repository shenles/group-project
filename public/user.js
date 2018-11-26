module.exports = function(){
    var express = require('express');
    var router = express.Router();

router.get('/', function(req, res){
        {
            res.render('user');
        }
});

router.post('/', function(req, res){
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO user (user_name,user_password) VALUES (?,?)";
    var inserts = [req.body.fn, req.body.lname, req.body.email, req.body.password];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect('/user');
        }
    });
});

return router;

}(); 

