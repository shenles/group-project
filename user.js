module.exports = function(){
    var express = require('express');
    var router = express.Router();

router.get('/', function(req, res){
        {
            res.render('user');
        }
});

function InvalidMsgFName(textbox) {

	if(textbox.validity.missing){ //check that first name field is entered
		textbox.setCustomValidity('please enter a first name.');
    } else {
        textbox.setCustomValidity('');
    }
    return true;
}

function InvalidMsgLName(textbox) {

	if(textbox.validity.missing){ //check that last name field is entered
		textbox.setCustomValidity('please enter a last name.');
    } else {
        textbox.setCustomValidity('');
    }
    return true;
}

function InvalidMsgUserName(textbox) {

	if(textbox.validity.missing){ //check that username field is entered
		textbox.setCustomValidity('please enter a last name.');
	} else if(textbox.validity.underflow){  //check that username is at least 3 digits
        textbox.setCustomValidity('please enter 3 digits.');
    } else {
        textbox.setCustomValidity('');
    }
    return true;
}

function InvalidMsgUserNameCheck(input) {

	console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "SELECT FROM users (user_name) VALUES (?)";
	
    sql = mysql.pool.query(sql,input,function(error, results){

		if(results.length){
			input.setCustomValidity('username already exists');
        }else{
            input.setCustomValidity('');
        }
    });
	
    return true;
}

function InvalidMsgPassword(textbox) {

	if(textbox.validity.missing){ //check that password field is entered
		textbox.setCustomValidity('please enter a password.');
	} else if(textbox.validity.underflow){  //check that password is at least 8 digits
        textbox.setCustomValidity('please enter 8 digits.');
    } else {
        textbox.setCustomValidity('');
    }
    return true;
}

function InvalidMsgPasswordConf(textbox) {

	if(textbox.validity.missing){ //check that password conf field is entered
		textbox.setCustomValidity('please enter a password.');
	} else if(textbox.validity.underflow){  //check that password conf is at least 8 digits
        textbox.setCustomValidity('please enter 8 digits.');
    } else {
        textbox.setCustomValidity('');
    }
    return true;
}

function InvalidMsgPasswordCheck(input) {
    if (input.value != document.getElementById('user_password').value) {
        input.setCustomValidity('Password Must be Matching.');
    } else {
        input.setCustomValidity('');
    }
	return true;
}
	
router.post('/', function(req, res){
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO users (fname, lname, user_name, user_password) VALUES (?,?,?,?)";
	var fname = req.body.fname;
	var lname = req.body.lname;
	var user_name = req.body.user_name;
	var user_password = req.body.user_password;
	
    var inserts = [req.body.fname, req.body.lname, req.body.user_name, req.body.user_password];
	
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
			if(error.errno===1062 || error.code==='ER_DUP_ENTRY'){
				textbox.setCustomValidity('duplicate username');
			} else {
				textbox.setCustomValidity('');
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}
        }else{
            res.redirect('login');
        }
    });
});


return router;


}(); 

