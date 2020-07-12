var Search = document.querySelector('#SearchF');
var avatar = document.querySelector('.svgContainer');
var twoFingers = document.querySelector('.twoFingers');
var armL = document.querySelector('.armL');
var armR = document.querySelector('.armR');
var eyeL = document.querySelector('.eyeL');
var eyeR = document.querySelector('.eyeR');
var mouth = document.querySelector('.mouth');
var mouthBG = document.querySelector('.mouthBG');
var face = document.querySelector('.face');
var eyebrow = document.querySelector('.eyebrow');
var outerEarL = document.querySelector('.earL .outerEar');
var outerEarR = document.querySelector('.earR .outerEar');

var bodyBG = document.querySelector('.bodyBGnormal');
var bodyBGchanged = document.querySelector('.bodyBGchanged');

var activeElement;
var curSearchIndex;
var screenCenter;
var svgCoords;
var SearchCoords;
var SearchScrollMax;
var dFromC;
var mouthStatus = "small";
var blinking;
var eyeScale = 1;
var eyesCovered = false;
var eyeLCoords;
var eyeRCoords;
var mouthCoords;
var eyeLAngle;
var eyeLX;
var eyeLY;
var eyeRAngle;
var eyeRX;
var eyeRY;
var mouthAngle;
var mouthX;
var mouthY;
var mouthR;
var faceX;
var faceY;
var faceSkew;
var eyebrowSkew;
var outerEarX;
var outerEarY;

function calculateFaceMove(e) {
	var carPos = Search.selectionEnd
	var	div = document.createElement('div')
	var	span = document.createElement('span')
	var	copyStyle = getComputedStyle(Search)
	var	caretCoords = {}
	
	if(carPos == null || carPos == 0) {
		carPos = Search.value.length;
	}
	[].forEach.call(copyStyle, function(prop){
		div.style[prop] = copyStyle[prop];
	});
	div.style.position = 'absolute';
	document.body.appendChild(div);
	div.textContent = Search.value.substr(0, carPos);
	span.textContent = Search.value.substr(carPos) || '.';
	div.appendChild(span);
	
	if(Search.scrollWidth <= SearchScrollMax) {
		caretCoords = getPosition(span);
		dFromC = screenCenter - (caretCoords.x + SearchCoords.x);
		eyeLAngle = getAngle(eyeLCoords.x, eyeLCoords.y, SearchCoords.x + caretCoords.x, SearchCoords.y + 25);
		eyeRAngle = getAngle(eyeRCoords.x, eyeRCoords.y, SearchCoords.x + caretCoords.x, SearchCoords.y + 25);
		mouthAngle = getAngle(mouthCoords.x, mouthCoords.y, SearchCoords.x + caretCoords.x, SearchCoords.y + 25);
	} else {
		eyeLAngle = getAngle(eyeLCoords.x, eyeLCoords.y, SearchCoords.x + SearchScrollMax, SearchCoords.y + 25);
		eyeRAngle = getAngle(eyeRCoords.x, eyeRCoords.y, SearchCoords.x + SearchScrollMax, SearchCoords.y + 25);
		mouthAngle = getAngle(mouthCoords.x, mouthCoords.y, SearchCoords.x + SearchScrollMax, SearchCoords.y + 25);
	}
	
	eyeLX = Math.cos(eyeLAngle) * 10;
	eyeLY = Math.sin(eyeLAngle) * 5;
	eyeRX = Math.cos(eyeRAngle) * 10;
	eyeRY = Math.sin(eyeRAngle) * 5;
	mouthX = Math.cos(mouthAngle) * 10;
	mouthY = Math.sin(mouthAngle) * 5;
	mouthR = Math.cos(mouthAngle) * 2;
	faceX = mouthX * .01;
	faceY = mouthY * .02;
	faceSkew = Math.cos(mouthAngle) * 5;
	eyebrowSkew = Math.cos(mouthAngle) * 25;	
	
	TweenMax.to(eyeL, 1, {x: -eyeLX , y: -eyeLY, ease: Expo.easeOut});
	TweenMax.to(eyeR, 1, {x: -eyeRX , y: -eyeRY, ease: Expo.easeOut});
	TweenMax.to(mouth, 1, {x: -mouthX , y: -mouthY, rotation: mouthR, transformOrigin: "center center", ease: Expo.easeOut});
	TweenMax.to(face, 1, {x: -faceX, y: -faceY, skewX: -faceSkew, transformOrigin: "center top", ease: Expo.easeOut});
	TweenMax.to(eyebrow, 1, {x: -faceX, y: -faceY, skewX: -eyebrowSkew, transformOrigin: "center top", ease: Expo.easeOut});
	
	TweenMax.to(outerEarL, 1, {x: outerEarX, y: -outerEarY, ease: Expo.easeOut});
	TweenMax.to(outerEarR, 1, {x: outerEarX, y: outerEarY, ease: Expo.easeOut});
		
	document.body.removeChild(div);
};

function onSearchInput(e) {
	calculateFaceMove(e);
	var value = Search.value;
	curSearchIndex = value.length;
	
	if(curSearchIndex > 0) {
		TweenMax.to([eyeL, eyeR], 1, {scaleX: .85, scaleY: .85, ease: Expo.easeOut});
		eyeScale = .85;

		if(curSearchIndex > 4) {
			TweenMax.to([eyeL, eyeR], 1, {scaleX: .65, scaleY: .65, ease: Expo.easeOut, transformOrigin: "center center"});
		} else {
			TweenMax.to([eyeL, eyeR], 1, {scaleX: .85, scaleY: .85, ease: Expo.easeOut});
		}

		if(curSearchIndex >= 6) {
			coverEyes();
			stopBlinking();
			startBlinking(5);
		}

		if(curSearchIndex > 9) {
			spreadFingers();
		}

		if(curSearchIndex > 16) {
			closeFingers();
		}

		if(curSearchIndex > 18) {
			calculateFaceMove(e);
			TweenMax.to(armL, .5, {x: -93, y: 0, rotation: -0.5, ease: Quad.easeOut});
			closeFingers();
		}

		if(curSearchIndex < 9) {
			closeFingers();
		}
		
		if(curSearchIndex < 6) {
			uncoverEyes();
		}

	} else {
		TweenMax.to([eyeL, eyeR], 1, {scaleX: 1, scaleY: 1, ease: Expo.easeOut});
		uncoverEyes();
	}
}

function onSearchFocus(e) {
	activeElement = "Search";
	onSearchInput();
}

function onSearchBlur(e) {
	activeElement = null;
	setTimeout(function() {
		if(activeElement !== "Search") {
			if(e.target.value == "") {
				e.target.parentElement.classList.remove("focusWithText");
			}
			uncoverEyes();
			resetFace();
			stopBlinking();
			startBlinking(5);
		}
	}, 100);
}

function spreadFingers() {
	TweenMax.to(twoFingers, .35, {transformOrigin: "bottom left", rotation: 30, x: -9, y: -2, ease: Power2.easeInOut});
}

function closeFingers() {
	TweenMax.to(twoFingers, .35, {transformOrigin: "bottom left", rotation: 0, x: 0, y: 0, ease: Power2.easeInOut});
}

function coverEyes() {
	TweenMax.killTweensOf([armL, armR]);
	TweenMax.set([armL, armR], {visibility: "visible"});
	TweenMax.to(armL, .45, {x: -88, y: 8, rotation: 0, ease: Quad.easeOut});
	TweenMax.to(armR, .45, {x: -93, y: 10, rotation: 0, ease: Quad.easeOut, delay: .1});
	TweenMax.to(bodyBG, .45, {morphSVG: bodyBGchanged, ease: Quad.easeOut});
	eyesCovered = true;
}

function uncoverEyes() {
	TweenMax.killTweensOf([armL, armR]);
	TweenMax.to(armL, 1.35, {y: 220, ease: Quad.easeOut});
	TweenMax.to(armL, 1.35, {rotation: 105, ease: Quad.easeOut, delay: .1});
	TweenMax.to(armR, 1.35, {y: 220, ease: Quad.easeOut});
	TweenMax.to(armR, 1.35, {rotation: -105, ease: Quad.easeOut, delay: .1, onComplete: function() {
		TweenMax.set([armL, armR], {visibility: "hidden"});
	}});
	TweenMax.to(bodyBG, .45, {morphSVG: bodyBG, ease: Quad.easeOut});
	eyesCovered = false;
}

function resetFace() {
	TweenMax.to([eyeL, eyeR], 1, {x: 0, y: 0, ease: Expo.easeOut});
	TweenMax.to(mouth, 1, {x: 0, y: 0, rotation: 0, ease: Expo.easeOut});
	TweenMax.to([face, eyebrow], 1, {x: 0, y: 0, skewX: 0, ease: Expo.easeOut});
	TweenMax.to([outerEarL, outerEarR], 1, {x: 0, y: 0, scaleY: 1, ease: Expo.easeOut});
}

function startBlinking(delay) {
	if(delay) {
		delay = getRandomInt(delay);
	} else {
		delay = 1;
	}
	blinking = TweenMax.to([eyeL, eyeR], .1, {delay: delay, scaleY: 0, yoyo: true, repeat: 1, transformOrigin: "center center", onComplete: function() {
		startBlinking(12);
	}});
}

function stopBlinking() {
	blinking.kill();
	blinking = null;
	TweenMax.set([eyeL, eyeR], {scaleY: eyeScale});
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function getAngle(x1, y1, x2, y2) {
	var angle = Math.atan2(y1 - y2, x1 - x2);
	return angle;
}

function getPosition(el) {
	var xPos = 0;
	var yPos = 0;

	while (el) {
		if (el.tagName == "BODY") {
			// deal with browser quirks with body/window/document and page scroll
			var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
			var yScroll = el.scrollTop || document.documentElement.scrollTop;

			xPos += (el.offsetLeft - xScroll + el.clientLeft);
			yPos += (el.offsetTop - yScroll + el.clientTop);
		} else {
			// for all other non-BODY elements
			xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
			yPos += (el.offsetTop - el.scrollTop + el.clientTop);
		}

		el = el.offsetParent;
	}
	//console.log("xPos: " + xPos + ", yPos: " + yPos);
	return {
		x: xPos,
		y: yPos
	};
}

function isMobileDevice() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

function initLoginForm() {
	// some measurements for the svg's elements
	svgCoords = getPosition(avatar);
	SearchCoords = getPosition(Search);
	screenCenter = svgCoords.x + (avatar.offsetWidth / 2);
	eyeLCoords = {x: svgCoords.x + 84, y: svgCoords.y + 76};
	eyeRCoords = {x: svgCoords.x + 113, y: svgCoords.y + 76};
	mouthCoords = {x: svgCoords.x + 100, y: svgCoords.y + 100};
	
	// handle events for Search input
	Search.addEventListener('focus', onSearchFocus);
	Search.addEventListener('blur', onSearchBlur);
	Search.addEventListener('input', onSearchInput);
	
	// move arms to initial positions
	TweenMax.set(armL, {x: -93, y: 220, rotation: 105, transformOrigin: "top left"});
	TweenMax.set(armR, {x: -93, y: 220, rotation: -105, transformOrigin: "top right"});
	
	startBlinking(5);
	
	// determine how far Search input can go before scrolling occurs
	// will be used as the furthest point avatar will look to the right
	SearchScrollMax = Search.scrollWidth;
	
	// check if we're on mobile/tablet, if so then show password initially
	if(isMobileDevice()) {
		TweenMax.set(twoFingers, {transformOrigin: "bottom left", rotation: 30, x: -9, y: -2, ease: Power2.easeInOut});
	}
	
	// clear the console
	console.clear();
}

initLoginForm();

function Inter() {
	var interSearch = document.getElementById('SearchF').value;
	var interG = interSearch.startsWith('HejBit, Wyszukaj:');
	var interC = interSearch.startsWith('HejBit, Włącz czarne tło');
	var interS = interSearch.startsWith('HejBit, co to za sekret');

	if (interG == true) {
		var cut = interSearch.split(":");
		window.open('http://google.com/search?q='+cut[1]);
	}

	if (interC == true) {
		document.body.style.backgroundColor = "Black";
	}

	if (interS == true) {
		alert('Wejdź na stronę Juniora, wybierz opcję "DOŁĄCZ DO E-MAILINGU", następnie wpisz "KAImieFEJ", zaznacz "Wyrażam..." i zamknij formularz.');
	}
}