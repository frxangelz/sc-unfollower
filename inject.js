/*
	Soundcloud unliker and unfollower
	(c) 2021 - FreeAngel 
		
		youtube channel : http://www.youtube.com/channel/UC15iFd0nlfG_tEBrt6Qz1NQ
		PLEASE SUBSCRIBE !
		
	github : https://github.com/frxangelz/
*/

const _MAX_ACTION_TO_RELOAD = 60; // will reload page after certain amount of deletions
const _DEFAULT_WAIT_TIME = 5;
const _NO_ITEMS_RELOAD_WAIT_TIME = 30;

tick_count = 0;
first = true;
action_count = 0;

var CurActionUrl = "";

var config = {
	enable : 0,
	total : 0
}

var wait_time = _DEFAULT_WAIT_TIME;

var click_count = 0;
var action_type = 0; // 0 = disable, 1 = unfollow, 2 = unlike

function clog(s){

		chrome.runtime.sendMessage({action:"log", log: s});
}

var simulateMouseEvent = function(element, eventName, coordX, coordY) {
	element.dispatchEvent(new MouseEvent(eventName, {
	  view: window,
	  bubbles: true,
	  cancelable: true,
	  clientX: coordX,
	  clientY: coordY,
	  button: 0
	}));
  };
  
  function click(btn){
	  var box = btn.getBoundingClientRect(),
		  coordX = box.left + (box.right - box.left) / 2,
		  coordY = box.top + (box.bottom - box.top) / 2;
		  
	  btn.focus();
	  simulateMouseEvent(btn,"mousemove",coordX,coordY);
	  simulateMouseEvent(btn,"mousedown",coordX,coordY);
	  setTimeout(function(){
		  simulateMouseEvent(btn,"click",coordX,coordY);
		  simulateMouseEvent(btn,"mouseup",coordX,coordY);
	  },200);
  }

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.action === "set") {
		config.enable = request.enable;
		tick_count = 0;
		
		if(!config.enable){
			var info = document.getElementById("info_ex");
			if(info) {
				console.log("removed");
				info.parentNode.removeChild(info);
			}
			first = true;
		}		
	}
	
});

function show_info(){

	var info = document.getElementById("info_ex");
	if(!info) {
	
		info = document.createElement('div');
		info.style.cssText = "position: fixed; bottom: 0; width:100%; z-index: 100000;background-color: #F5FACA; border-style: solid;  border-width: 1px; margins: 5px; paddingLeft: 10px; paddingRight: 10px;";
		info.innerHTML = "<center><h2 id='status_ex'>active</h2></center>";
		info.id = "info_ex";
		document.body.appendChild(info);
		console.log("info_ex created");
	}
}

function info(txt){

	var info = document.getElementById("status_ex");
	if(!info) { return; }
	
	var act_s = 'idel : ';
	switch(action_type){
		case 1 : act_s = 'Unfollowed : ';
				 break;
		case 2 : act_s = 'Unliked : ';
				 break;
	}
		
	if(txt !== ""){	info.textContent = act_s+config.total+", "+txt; }
	else { info.textContent = act_s+config.total; }
}

function DoUnfollow(){

	wait_time = _DEFAULT_WAIT_TIME;
	
	var btns = document.querySelectorAll('button.sc-button-follow'); 
	var l; 
	var cnt = 0;

	for (var i=0; i<btns.length; i++){
		l = btns[i].getAttribute('aria-label'); 
		if(l === 'Unfollow') { 	
			cnt++;
			action_count++;
//			console.log("unfollowed !");
			btns[i].click(); 
		} 
		
		btns[i].scrollIntoView();
	}

	if(cnt > 0){
		chrome.runtime.sendMessage({action: "inc",value:cnt}, function(response){
			config.total = response.total;
		});	
	}
	
	return cnt;
}

function DoUnlike(){

	wait_time = _DEFAULT_WAIT_TIME;
	
	var btns = document.querySelectorAll('button.sc-button-like'); 
	var l; 
	var cnt = 0;

	for (var i=0; i<btns.length; i++){
		l = btns[i].getAttribute('aria-label'); 
		if(l === 'Unlike') { 	
			cnt++;
			action_count++;
//			console.log("Unliked !");
			btns[i].click(); 
		} 
		
		btns[i].scrollIntoView();
	}

	if(cnt > 0){
		chrome.runtime.sendMessage({action: "inc",value:cnt}, function(response){
			config.total = response.total;
		});	
	}
	
	return cnt;
}

var loading_tick_count = 0;

 	   var readyStateCheckInterval = setInterval(function() {
	       
		   if (document.readyState !== "complete") { return; }

		   if(first){
				first = false;
				chrome.runtime.sendMessage({action: "get"}, function(response){
	
					config.enable = response.enable;
					config.total = response.total;
				});
		   }

		   if(!config.enable) { return; }
		   
		   cur_url = window.location.href;

           tick_count= tick_count+1; 

		   if(cur_url.indexOf("soundcloud.com") === -1){
				return;
		   }
		   
 		   show_info();

		   if(cur_url.indexOf("/you/") !== -1){
			   wait_time = _DEFAULT_WAIT_TIME;
			   info("invalid url ");
			   return;
		   }
		   
		   // check for action type
		   if(cur_url.indexOf("/likes") !== -1){
			   action_type = 2;
		   } else
		   if(cur_url.indexOf("/following") !== -1){
			   action_type = 1;
		   }

		   if(action_type === 0){
			   wait_time = _DEFAULT_WAIT_TIME;
			   info("invalid url ");
			   return;
		   }
		   
		   if(wait_time > 0){
				wait_time--;
				info("Wait for "+wait_time.toString()+"s");
				return;
		   }

		   if(action_count >= _MAX_ACTION_TO_RELOAD){
			   
			   window.location.href = cur_url;
			   return;
		   }

		   if(action_type == 1){ 
			
			if (DoUnfollow() == 0){
				
				info("No more items");
				wait_time = _NO_ITEMS_RELOAD_WAIT_TIME;
				return;
			}
		   }
		   
		   if(action_type == 2){
			
				if(DoUnlike() == 0){
					info("No more items");
					wait_time = _NO_ITEMS_RELOAD_WAIT_TIME;
					return;
				}
		   }
		   
		   info("");
		   
	 }, 1000);

