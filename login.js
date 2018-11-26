module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var app = express();
    var bodyParser = require("body-parser");	
	 router.get('/',function(req,res){
	{
		res.render('login');
	}
});

var mysql = require('./dbcon.js');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

function InvalidMsgUserName(textbox){
	if(textbox.validity.missing){ //check that username is entered
		textbox.setCustomValidity('Please enter username');
	} else {
		textbox.setCustomValidity('');
	}
	return true;
}

function InvalidMsgPwd(textbox){
	if(textbox.validity.missing){//check that password is entered
		textbox.setCustomValidity('Please enter password');
	}else {
		textbox.setCustomValidity('');
	}
	return true;
}

router.post('/', function(req,res){

	var inpUserName=req.body.user_name;
	var inpUserPassword=req.body.user_password;
	var found=0;
	var context={};
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers','Content-Type,Authorization,Content-Length,X-Requested-With');

	mysql.pool.query("SELECT * FROM users",
	function(err,rows,fields){
		if(err){
			console.log(err);
			console.log('error');
			return;
		}
			for(var i=0; i< rows.length;i++){
				console.log(i);
				if(rows[i]["user_name"]==inpUserName){
					console.log('username found!');
					if(rows[i]["user_password"]==inpUserPassword){
						console.log('password correct');
						i=rows.length;
						found=1;
					}	
				}
			}
	if(found){
		res.redirect('PickUpPlus.html');
	}else{
		console.log('Password or username incorrect');
		res.redirect('login?error='+encodeURIComponent('Incorrect username or password'));	
	}
	});
});
return router;

}(); 

