module.exports = function(){
    var express = require('express');
    var router = express.Router();
    router.get('/',function(req,res){
	{
		res.render('login');
	}
});

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
/*	console.log(req.body);
	pool.query("SELECT * FROM users WHERE id=?",
	[req.query.id],
	function(err.result){
		if(err){
			next(err);
			return;
		}
		if(result.length==1){
			var current=result[0];
			if(req.query.user_name===inpUserName){
				if(req.query.user_password===inpUserPwd){
					res.render('PickUpPlus');
				}
			}
		}
	});*/
});	
return router;

}(); 

