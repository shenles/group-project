var express = require('express');
var mysql = require('./dbcon.js');
const bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.use('/user', require('./user.js'));
app.use('/login', require('./login.js'));
app.use('/', express.static('public'));

app.get('/games',function(req,res,next){
	var context = {};
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
	//var queryString = 'SELECT * FROM games';
	var queryString = "SELECT game_id AS `Game ID`, sport_type AS `Sport`, start_date AS `Start Date`, " +
			"start_time AS `Start Time`, (SELECT user_name FROM users WHERE user_id = host_user) AS Host, " +
			"max_players AS `Max Players`, current_players AS `Current Players`, location_name AS `Location Name`, " +
			"location_address AS `Location Street Address`, location_city AS `City`, location_state AS `State`, " +
			"location_zip AS `Zip Code`, location_lat AS `Latitude`, location_long AS `Longitude` FROM games";	
	mysql.pool.query(queryString, function(err, rows, fields){
    		if(err){
      			next(err);
      			return;
    		}
		for(var i = 0; i < rows.length; i++){
			//console.log(rows[i]["Start Date"]);
			rows[i]["Start Date"] = rows[i]["Start Date"].toString().slice(0,10);
		}
		//context.results = JSON.stringify(rows);
		res.send(rows);
	});
});

app.get('/game_insert',function(req,res,next){
	var context = {};
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
	mysql.pool.query('INSERT INTO games (sport_type, start_date, start_time, host_user, max_players, location_name, location_address, location_city, location_state, location_zip) VALUES (?,?,?,?,?,?,?,?,?,?)', [req.query.sport, req.query.date, req.query.time, req.query.host_user, req.query.playercap, req.query.game_location, req.query.street, req.query.city, req.query.stateabbr, req.query.zipcode], function(err, rows, fields){
    		if(err){
      			console.log(err);
      			return;
    		}
		res.send(rows);
	});
});


app.get('/game_type',function(req,res,next){
	var context = {};
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
	var queryString = "SELECT sport_type FROM games";	
	mysql.pool.query(queryString, function(err, rows, fields){
		if(err){
			console.log(err);
		}
		res.send(rows)
	});
});

app.get('/game_city',function(req,res,next){
	var context = {};
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
	var queryString = "SELECT location_city FROM games";	
	mysql.pool.query(queryString, function(err, rows, fields){
		if(err){
			console.log(err);
		}
		res.send(rows)
	});
});

app.get('/games_by_type',function(req,res,next){
	var context = {};
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
	//var queryString  = 'SELECT * FROM games WHERE sport_type=?';
	var queryString = "SELECT game_id AS `Game ID`, sport_type AS `Sport`, start_date AS `Start Date`, " +
			"start_time AS `Start Time`, (SELECT user_name FROM users WHERE user_id = host_user) AS Host, " +
			"max_players AS `Max Players`, current_players AS `Current Players`, location_name AS `Location Name`, " +
			"location_address AS `Location Street Address`, location_city AS `City`, location_state AS `State`, " +
			"location_zip AS `Zip Code`, location_lat AS `Latitude`, location_long AS `Longitude` FROM games WHERE sport_type = ?";	
	mysql.pool.query(queryString, [req.query.type], function(err, rows, fields){
		if(err){
			console.log(err);
		}	
		for(var i = 0; i < rows.length; i++){
			rows[i]["Start Date"] = rows[i]["Start Date"].toString().slice(0,10);
		}
		res.send(rows)
	});
});


app.get('/games_by_location',function(req,res,next){
        var context = {};
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
       
        var queryString = "SELECT game_id AS `Game ID`, sport_type AS `Sport`, start_date AS `Start Date`, " +
                        "start_time AS `Start Time`, (SELECT user_name FROM users WHERE user_id = host_user) AS Host, " +
                        "max_players AS `Max Players`, current_players AS `Current Players`, location_name AS `Location Name`, " +
                        "location_address AS `Location Street Address`, location_city AS `City`, location_state AS `State`, " +
                        "location_zip AS `Zip Code`, location_lat AS `Latitude`, location_long AS `Longitude` FROM games WHERE location_city = ?";

        mysql.pool.query(queryString, [req.query.searchlocation], function(err, rows, fields){
                if(err){
                        console.log(err);
                }
                for(var i = 0; i < rows.length; i++){
                        rows[i]["Start Date"] = rows[i]["Start Date"].toString().slice(0,10);
                }
                res.send(rows)
        });
});        


app.get('/game_by_id/:id',function(req,res,next){
        var context = {};
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
       
        var queryString = "SELECT * FROM `games` WHERE game_id = ?";

        mysql.pool.query(queryString, [req.params.id], function(err, rows, fields){
                if(err){
                        console.log(err);
                }
		//console.log(rows);
                res.status(200).json(rows);
        });
}); 


app.get('/user_by_id/:id',function(req,res,next){
        var context = {};
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
       
        var queryString = "SELECT * FROM `users` WHERE user_id = ?";

        mysql.pool.query(queryString, [req.params.id], function(err, rows, fields){
                if(err){
                        console.log(err);
                }
		//console.log(rows);
                res.status(200).json(rows);
        });
});        

       
app.get('/users_in_game/:id',function(req,res,next){
        var context = {};
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
       
        var queryString = "SELECT u.user_name AS Names FROM users u INNER JOIN gameUsers g ON g.user_id = u.user_id WHERE g.game_id = ?";

        mysql.pool.query(queryString, [req.params.id], function(err, rows, fields){
                if(err){
                        console.log(err);
                }
		//console.log(rows);
                res.status(200).json(rows);
        });
});        

app.get('/sport_info',function(req,res,next){
        var context = {};
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        var queryString = "SELECT sport_name FROM sports";
        mysql.pool.query(queryString, function(err, rows, fields){
               if(err){
                      console.log(err);
               }
               res.send(rows)
        });
});


app.get('/user_info',function(req,res,next){
        var context = {};
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        var queryString = "SELECT user_id, user_name FROM users";
        mysql.pool.query(queryString, function(err, rows, fields){
                if(err){
                        console.log(err);
                }
                res.send(rows)
        });
});

app.get('/get_user_id',function(req,res,next){
        var context = {};
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        var queryString = "SELECT user_id FROM users WHERE user_name = ? AND user_password = ?";
        mysql.pool.query(queryString, [req.query.username, req.query.password], function(err, rows, fields){
                if(err){
                        console.log(err);
                }
                res.send(rows);
        });
});


app.get('/add_user_to_game',function(req,res,next){
        var context = {};
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        var queryString = "INSERT INTO gameUsers (game_id, user_id) VALUES (?, ?);";
        mysql.pool.query(queryString, [req.query.gameID, req.query.userID], function(err, rows, fields){
                if(err){
                        console.log(err);
                }
                res.send(rows);
        });
});

app.get('/remove_user_from_game',function(req,res,next){
        var context = {};
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        var queryString = "DELETE FROM gameUsers WHERE game_id = ? AND user_id = ?;";
        mysql.pool.query(queryString, [req.query.gameID, req.query.userID], function(err, rows, fields){
                if(err){
                        console.log(err);
                }
                res.send(rows);
        });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

