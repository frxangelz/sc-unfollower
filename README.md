# sc-unfollower
 
This is a just simple soundcloud unfollower and unliker script, nothing fancy, but very helpful for someone who doesnt like to spend lot of times with single click on every soundcloud account followed or liked. Imagine if you have followed or liked thousands of soundcloud accounts. Even if you don’t care about having a tight “follower to following ratio,” this is useful because it helps to unclutter your feed, ensuring that the content you scroll through is all stuff you want to see. This tutorial is to help people who are not familiar with scripting and want to work with it easily.

Unfollower Script

var btns = document.querySelectorAll('button.sc-button-follow');
var l;
btns.forEach(function(btn){
	l = btn.getAttribute('aria-label');
	if(l == 'Unfollow') { btn.click(); }
});

Unliker Script

var btns = document.querySelectorAll('button.sc-button-like');
var l;
btns.forEach(function(btn){
	l = btn.getAttribute('aria-label');
	if(l == 'Unlike') { btn.click(); }
});

copy script at your chrome developer console, press enter to execute, reload page, repeat until no more followed/liked accounts/tracks.

You should watch video demo on youtube :
