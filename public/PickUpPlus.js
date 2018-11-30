//Anthony Clemente

var pageURL = window.location.href;

var flipNumber = pageURL[pageURL.indexOf("flip") + 4];

var shortURL = pageURL.substring(pageURL.indexOf(".edu") + 5);

var portNumber = shortURL.substring(0, shortURL.indexOf("\/"));


displayTables();


var tables = ["game"];

tables.forEach(setUpShowFormsButtons);


document.getElementById("searchgame").addEventListener("click", function(event){
		
	event.preventDefault();
	var allForms = document.getElementsByTagName("form");
	for (var i = 0; i < allForms.length; i++){
		allForms[i].style.display = "none";
		
	}
	var currForm = document.getElementById("search_form");
	currForm.style.display = "block";
		
});

		
function setUpShowFormsButtons(t){	

	document.getElementById("add" + t).addEventListener("click", function(event){
		
		event.preventDefault();
		var allForms = document.getElementsByTagName("form");
		for (var i = 0; i < allForms.length; i++){
			allForms[i].style.display = "none";
			
		}
		var currForm = document.getElementById(t + "_form");
		currForm.style.display = "block";
		
	});
}

populateSportDropdown();

function populateSportDropdown(){

        var getSportRequest = new XMLHttpRequest();
        getSportRequest.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/sport_info", true);
        getSportRequest.addEventListener('load',function(){
                if(getSportRequest.status >= 200 && getSportRequest.status < 400){

                        var response = JSON.parse(getSportRequest.responseText);
                        var sportDropdown = document.getElementById("sport_type");

                        var sportArray = [];

                        for(var i = 0; i < response.length; i++){
                                if(sportArray.indexOf(response[i]["sport_name"]) < 0){
                                        sportArray.push(response[i]["sport_name"]);
                                }
                        }

                        for(var i = 0; i < sportArray.length; i++){
                                optionElem = document.createElement("option");
                                optionElem.value = response[i]["sport_name"];
                                optionElem.innerHTML = sportArray[i];

                                sportDropdown.append(optionElem);
                        }

                } else {
                        console.log("Error in network request: " + getSportRequest.statusText);
                }});
        getSportRequest.send(null);

}


populateUserDropdown();

function populateUserDropdown(){

        var getUserRequest = new XMLHttpRequest();
        getUserRequest.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/user_info", true);
        getUserRequest.addEventListener('load',function(){
                if(getUserRequest.status >= 200 && getUserRequest.status < 400){

                        var response = JSON.parse(getUserRequest.responseText);
                        var userDropdown = document.getElementById("host_user");

                        var userArray = [];

                        for(var i = 0; i < response.length; i++){
                                if(userArray.indexOf(response[i]["user_name"]) < 0){
                                        userArray.push(response[i]["user_name"]);
                                }
                        }

                        for(var i = 0; i < userArray.length; i++){
                                optionElem = document.createElement("option");
                                optionElem.value = response[i]["user_id"];
                                optionElem.innerHTML = userArray[i];

                                userDropdown.append(optionElem);
                        }

                } else {
                        console.log("Error in network request: " + getUserRequest.statusText);
                }});
        getUserRequest.send(null);

}


populateGameFilter();

function populateGameFilter(){
	
	var getGameTypeRequest = new XMLHttpRequest();
	getGameTypeRequest.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/game_type", true);
	getGameTypeRequest.addEventListener('load',function(){
		if(getGameTypeRequest.status >= 200 && getGameTypeRequest.status < 400){
			
			var response = JSON.parse(getGameTypeRequest.responseText);
			var typeDropdown = document.getElementById("sport_types");
			//var searchDropdown = document.getElementById("sport_search");	
			var typeArray = [];
	
			for(var i = 0; i < response.length; i++){
				if(typeArray.indexOf(response[i]["sport_type"]) < 0){
					typeArray.push(response[i]["sport_type"]);
				}
			}

			for(var i = 0; i < typeArray.length; i++){
				optionElem = document.createElement("option");
				optionElem.value = typeArray[i];
				optionElem.innerHTML = typeArray[i];

				typeDropdown.append(optionElem);
				//searchDropdown.append(optionElem);	
			}
			
		} else {
			console.log("Error in network request: " + getGameTypeRequest.statusText);
		}});
	getGameTypeRequest.send(null);	
	
}


//Set up filtering
document.getElementById("filterGames").addEventListener("click", function(event){
	
	event.preventDefault();
	if(document.getElementById("sport_types").value != 1){
		
		var typeSelect = document.getElementById("sport_types");
		var type = typeSelect.options[typeSelect.selectedIndex].value;
		
		var gameByType = new XMLHttpRequest();
		
		gameByType.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber + "/games_by_type?type=" + type, true);
		gameByType.addEventListener('load',function(){
		  if(gameByType.status >= 200 && gameByType.status < 400){
			
			var response = JSON.parse(gameByType.responseText);
			
			var table = document.createElement("table");
			var thead = document.createElement("thead");
			var tr = document.createElement("tr");

			for(var prop in response[0]){
				var th = document.createElement("th");
				th.style.border = "1px solid black";
				th.textContent = prop;
				tr.appendChild(th);
			}
			
			thead.appendChild(tr);
			var tbody = document.createElement("tbody");
			for(var i = 0; i < response.length; i++){
				var tr = document.createElement("tr"); 
				for(var prop in response[i]){
					var td = document.createElement("td");
					td.style.border = "1px solid black";
					td.textContent = response[i][prop];
					tr.appendChild(td);
				}

								
				var viewgameButton = document.createElement("button");
				viewgameButton.textContent = "View Details";
				var gameId = response[i]["Game ID"];

				function setUpViewGameButton(gameId){
					viewgameButton.addEventListener('click', function(event){

						window.open("http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber + "/GameView.html?id=" + gameId, "_self");
   
					});
				};
		
				setUpViewGameButton(gameId);
				tr.appendChild(viewgameButton);	

				tbody.appendChild(tr);
			}
			table.appendChild(thead);
			table.appendChild(tbody);

			table.style.border = "1px solid black";

			document.body.insertBefore(table, document.getElementById("gametable"));
			document.getElementById("gametable").remove();
			table.id = "gametable";
			
			
		  } else {
			console.log("Error in network request: " + gameByType.statusText);
		  }});
		gameByType.send(null);
	}
	else {
		//location = location;
                var searchlocation = document.getElementById("location_search").value;
                
                var gameByLocation = new XMLHttpRequest();	
                
                gameByLocation.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber + "/games_by_location?searchlocation=" + searchlocation, true);
                gameByLocation.addEventListener('load',function(){
                  if(gameByLocation.status >= 200 && gameByLocation.status < 400){

                        var response = JSON.parse(gameByLocation.responseText);
                          
                        var table = document.createElement("table");
                        var thead = document.createElement("thead");
                        var tr = document.createElement("tr");

                        for(var prop in response[0]){
                                var th = document.createElement("th");
                                th.style.border = "1px solid black";
                                th.textContent = prop;
                                tr.appendChild(th);
                        }	
                        
                        thead.appendChild(tr);
                        var tbody = document.createElement("tbody");
                        for(var i = 0; i < response.length; i++){
                                var tr = document.createElement("tr");
                                for(var prop in response[i]){
                                        var td = document.createElement("td");
                                        td.style.border = "1px solid black";
                                        td.textContent = response[i][prop];
                                        tr.appendChild(td);
                                }

				
				var viewgameButton = document.createElement("button");
				viewgameButton.textContent = "View Details";
				var gameId = response[i]["Game ID"];

				function setUpViewGameButton(gameId){
					viewgameButton.addEventListener('click', function(event){

						window.open("http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber + "/GameView.html?id=" + gameId, "_self");
   
					});
				};
		
				setUpViewGameButton(gameId);
				tr.appendChild(viewgameButton);	

                                tbody.appendChild(tr);
                        }
                        table.appendChild(thead);
                        table.appendChild(tbody);

                        table.style.border = "1px solid black";

                        document.body.insertBefore(table, document.getElementById("gametable"));
                        document.getElementById("gametable").remove();
                        table.id = "gametable";


                  } else {
                        console.log("Error in network request: " + gameByLocation.statusText);
                  }});
                gameByLocation.send(null);
        }
	
});


document.getElementById("insertgame").addEventListener("click", function(event){
	
		//event.preventDefault();
		var sport = document.getElementById("sport_type").value;
		var start_date = document.getElementById("start_date").value;
		var start_time = document.getElementById("start_time").value;
	        var playercap = document.getElementById("max_players").value;	
                var game_location = document.getElementById("location_name").value;
	        var street = document.getElementById("location_address").value;
                var city = document.getElementById("location_city").value;
                var stateabbr = document.getElementById("location_state").value;
                var zipcode = document.getElementById("location_zip").value;
                var host_user = document.getElementById("host_user").value;

		invalid=0;

		if(!start_date){
			alert("Please enter a start date");
			invalid=1;
	
		} else if(!start_time){
			alert("Please enter start time");	
			invalid=2;
		} else if(game_location==""){
			alert("Please enter a game location");			
			invalid=3;
		} else if(street==""){
			invalid=4;
			alert("Please enter street address");
		} else if(city==""){
			alert("Please enter a city");
			invalid=5;
		} else if(stateabbr==""){
			alert("Please enter state");
			invalid=6;
		} else if(zipcode==""){
			invalid=7;
			alert("zipcode is missing");	
		} else if(playercap==""){
			invalid=8;
			alert("Max players is missing");
		}else if(host_user==""||host_user==38){
			invalid=9;
			alert("host name is missing");
		} else {
			console.log(host_user);
		}

		event.preventDefault();

		if(!invalid){
			var getRequest = new XMLHttpRequest();
		
			getRequest.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber + "/game_insert?sport=" + sport + "&date=" + start_date + 
				"&time=" + start_time + "&host_user=" + host_user + "&playercap=" + playercap + "&game_location=" + game_location + 
				"&street=" + street + "&city=" + city + "&stateabbr=" + stateabbr + "&zipcode=" + zipcode, true);
			getRequest.addEventListener('load',function(){
		  	if(getRequest.status >= 200 && getRequest.status < 400){
			
			location = location;
			
		  	} else {
				console.log("Error in network request: " + getRequest.statusText);
		  	}});
			getRequest.send(null);
		}else {
			invalid=false;
		}
});



function displayTables(){
	
	var gameRequest = new XMLHttpRequest();
	gameRequest.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber + "/games", true);
	gameRequest.addEventListener('load',function(){
	  if(gameRequest.status >= 200 && gameRequest.status < 400){
		var response = JSON.parse(gameRequest.responseText);
		
		var currentTable = document.getElementsByTagName("table")[0];
		
		if(currentTable){
			console.log(currentTable);
			var currentTableParent = currentTable.parentNode;
			currentTableParent.removeChild(currentTable);
		}

		makeTable(response, "game");
		
	  } else {
		console.log("Error in network request: " + gameRequest.statusText);
	  }});
	gameRequest.send(null);
	
	

}


function makeTable(response, tableName){
	
	var br = document.createElement("br");
	var label = document.createElement("label");
	

	label.innerHTML = tableName.charAt(0).toUpperCase() + tableName.slice(1) + ":";
	
	document.body.appendChild(br);
	document.body.appendChild(label);
	
	// Create a table element, a thead element and a tr element
	// for the first row (the header row)
	var table = document.createElement("table");
	table.id = tableName + "table";
	
	var thead = document.createElement("thead");
	var tr = document.createElement("tr");

	// Set up a loop to run, creating a th element
	// with proper styling and text and append this to the first row
	for(var prop in response[0]){
		var th = document.createElement("th");
		th.style.border = "1px solid black";
		th.textContent = prop;
		tr.appendChild(th);
	}

	// Add the completed header row to the thead element
	thead.appendChild(tr);

	// Create a tbody element for the rest of the cells
	var tbody = document.createElement("tbody");

	
	for(var i = 0; i < response.length; i++){
	   
		// For each row create a new row element
		var tr = document.createElement("tr");
	   
		for(var prop in response[i]){
		   
			// Create a td element with appropriate styling and
			// text and append this to the current row
			var td = document.createElement("td");
			td.style.border = "1px solid black";
			//console.log(response[i]["name"]);
			td.textContent = response[i][prop];
			tr.appendChild(td);
			
		}

		var viewgameButton = document.createElement("button");
		viewgameButton.textContent = "View Details";
		var gameId = response[i]["Game ID"];

		function setUpViewGameButton(gameId){
			viewgameButton.addEventListener('click', function(event){

				window.open("http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber + "/GameView.html?id=" + gameId, "_self");
   
			});
		};
		
		setUpViewGameButton(gameId);
		tr.appendChild(viewgameButton);	
		// Add the new row to the body of the table before looping
		// again (if required)
		tbody.appendChild(tr);
	}

	//Add the completed head and body to the table
	table.appendChild(thead);
	table.appendChild(tbody);

	// Style the entire table with a border
	table.style.border = "1px solid black";

	// Add this table to the page
	document.body.appendChild(table);
}
