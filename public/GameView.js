var pageURL = window.location.href;
var flipNumber = pageURL[pageURL.indexOf("flip") + 4];
var shortURL = pageURL.substring(pageURL.indexOf(".edu") + 5);
var portNumber = shortURL.substring(0, shortURL.indexOf("\/"));

//var url = location.href;
var idTransform = pageURL.substring(pageURL.lastIndexOf('=') + 1);
var ID = parseInt(idTransform);

var gameReq = new XMLHttpRequest();
var gameItem;

gameReq.addEventListener("load", function(data){
	gameItem = JSON.parse(this.responseText)[0];
	//document.getElementById('gameId').value = gameItem.game_id;
	if(gameItem.sport_type == "Football"){
		document.getElementById("sport_image").src = "images/football.jpg";
	}
	else if(gameItem.sport_type == "Soccer"){
		document.getElementById("sport_image").src = "images/soccer.jpg";
	}
	else{
		document.getElementById("sport_image").src = "images/placeholder.jpg";
	}

	document.getElementById("start_date").value = gameItem.start_date.toString().substring(0, 10);
	document.getElementById("start_time").value = gameItem.start_time;

	document.getElementById("host_user").innerHTML = gameItem.host_user;

	document.getElementById("game_location").innerHTML = gameItem.location_name;

        var zipcode = gameItem.location_zip; 

	var userReq = new XMLHttpRequest();
	userReq.addEventListener("load", function(data){
		userItem = JSON.parse(this.responseText)[0];
		document.getElementById("host_user").innerHTML = userItem.user_name;
	});


	userReq.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/user_by_id/" + gameItem.host_user, true);
	userReq.send();

	
	var usersGameReq = new XMLHttpRequest();
	usersGameReq.addEventListener("load", function(data){
		usersGameItem = JSON.parse(this.responseText);
		for(var i = 0; i < usersGameItem.length; i++){
			var userList = document.getElementById("users_list"); //usersGameItem[i].Names;
			var userListItem = document.createElement("li");
			userListItem.appendChild(document.createTextNode(usersGameItem[i].Names));
			userList.appendChild(userListItem);
			
		}
		console.log(usersGameItem);
	});


	usersGameReq.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/users_in_game/" + gameItem.game_id, true);
	usersGameReq.send();

        var zipCoordReq = new XMLHttpRequest();
        zipCoordReq.addEventListener("load", function(data){
           zipCoordData = this.responseText;
           var searchstring = zipcode + ","; 
           var searchForZip = zipCoordData.indexOf(searchstring);
            
           if (searchForZip != -1) {
             var firstCoordStart = searchForZip + 6;
             var firstCoordEnd = firstCoordStart + 9;
             var secondCoordStart = firstCoordEnd + 1;
             var secondCoordEnd = secondCoordStart + 10;
             var latString = zipCoordData.slice(firstCoordStart, firstCoordEnd);
             var longString = zipCoordData.slice(secondCoordStart, secondCoordEnd);
             var latnum = Number(latString);
             var longnum = Number(longString);
             var coordinates = [];
             coordinates.push(latnum);
             coordinates.push(longnum);
           } else { 
             var coordinates = []; 
             coordinates.push(37.4419);
             coordinates.push(-122.1430); 
           } 
           
           var latlng = L.latLng(coordinates);
           
           var mymap = L.map('locationmap').setView(latlng, 13);

           var mylayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
               attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
               maxZoom: 18,
               id: 'mapbox.streets',
               accessToken: 'pk.eyJ1Ijoic2hlbmxlcyIsImEiOiJjanAwbHF1aGIwNnR2M3ZvNjJicjB4YWZjIn0.djrqYZmfMzZKkrDrURti8w'
              }).addTo(mymap);
 
           var marker = L.marker(latlng).addTo(mymap);        
    
        });    
       
        zipCoordReq.open('GET', "https://gist.githubusercontent.com/erichurst/7882666/raw/5bdc46db47d9515269ab12ed6fb2850377fd869e/US%2520Zip%2520Codes%2520from%25202013%2520Government%2520Data", true);

        zipCoordReq.send();
        

});

gameReq.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/game_by_id/" + ID, true);
gameReq.send();

function addUserToGame(){
	var username = window.prompt("Confirm your username", "");
	var password = window.prompt("Enter your password", "");

	var userConfirmReq = new XMLHttpRequest();
	userConfirmReq.addEventListener("load", function(data){
		if(JSON.parse(this.responseText)[0] != undefined){
			var userId = JSON.parse(this.responseText)[0].user_id;
		//if(userId != null && userId != undefined){
			var joinGameReq = new XMLHttpRequest();
			joinGameReq.addEventListener("load", function(data){
				console.log("Added to the game!");
				location = location;
			});
			joinGameReq.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/add_user_to_game?gameID=" + ID + "&userID=" + userId, true);
			joinGameReq.send();
		}
		else{
			console.log("Problem with getting user ID back");
			console.log(JSON.parse(this.responseText));
			alert("Username or password was incorrect!");
		}
	});
	userConfirmReq.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/get_user_id?username=" + username + "&password=" + password, true);
	userConfirmReq.send();

}
/*var userReq = new XMLHttpRequest();
userReq.addEventListener("load", function(data){
	userItem = JSON.parse(this.responseText)[0];
	document.getElementById("host_user").innerHTML = userItem.user_id;
});


userReq.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/user_by_id/" + gameItem.host_user, true);
userReq.send();*/



