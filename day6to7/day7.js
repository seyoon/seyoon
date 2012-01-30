function drag(elToDrag, elTarget, event) {
	var nStartX = event.clientX, nStartY = event.clientY;
	var nOrigX = elToDrag.offsetLeft, nOrigY = elToDrag.offsetTop;
	var nDeltaX = nStartX - nOrigX, nDeltaY = nStartY - nOrigY;
	var bEventPairFlag = false;
	var oTargetArea = {
		topLeftX : function() {
			return getGlobalOffset(elTarget, "Left");
		},
		topLeftY : function() {
			return getGlobalOffset(elTarget, "Top");
		},
		btmRightX : function() {
			return this.topLeftX() + elTarget.offsetWidth;
		},
		btmRightY : function() {
			return this.topLeftY() + elTarget.offsetHeight;
		}
	};
	var oDraggingObj = {
		middleX : function() {
			return getGlobalOffset(elClone, "Left") + elClone.offsetWidth / 2;
		},
		middleY : function() {
			return getGlobalOffset(elClone, "Top") + elClone.offsetHeight / 2;
		}
	};
	var elClone = elToDrag.cloneNode(true);
	if(!document.all){
		elClone.innerHTML = elToDrag.innerHTML;
	}

	copyComputedStyle(elToDrag, elClone);
	document.body.appendChild(elClone);

	if(document.addEventListener){
		document.addEventListener("mousemove", moveHandler, true);
		document.addEventListener("mouseup", upHandler, true);
	}else if(document.attachEvent){
		elClone.setCapture();
		elClone.attachEvent("onmousemove", moveHandler);
		elClone.attachEvent("onmouseup", upHandler);
		elClone.attachEvent("onlosecapture", upHandler);
	}else{
		var oOldmovehandler = document.onmousemove;
		var oOlduphandler = document.onmouseup;
		document.onmousemove = moveHandler;
		document.onmouseup = upHandler;
	}

	if(event.stopPropagation){
		event.stopPropagation();
	}else{
		event.cancelBubble = true;
	}

	if(event.preventDefault){
		event.preventDefault();
	}else{
		event.returnValue = false;
	}

	function getGlobalOffset(elArg, type) {
		var nOffset = 0;
		while (elArg){
			nOffset += eval("elArg.offset" + type);
			elArg = elArg.offsetParent;
		}
		return nOffset;
	}

	function getRealStyle(elArg, sStyle) {
		var oComputedStyle;
		if(typeof elArg.currentStyle != 'undefined'){
			oComputedStyle = elArg.currentStyle;
		}else{
			oComputedStyle = document.defaultView.getComputedStyle(elArg, null);
		}

		return sStyle ? oComputedStyle[sStyle] : oComputedStyle;
	}
	;

	function copyComputedStyle(elSrc, elDest) {
		var oStyle = getRealStyle(elSrc);
		for( var i in oStyle){
			
			if(typeof i == "string" && i != "cssText" && !/\d/.test(i)){
				try{
					elDest.style[i] = oStyle[i];
					if(i == "font"){
						elDest.style.fontSize = oStyle.fontSize;
					}
				}catch (e){
				}
			}
		}
	}
	;

	function moveHandler(e) {
		if(!e){
			e = window.event;
		}
		elClone.style.left = (e.clientX - nDeltaX) + "px";
		elClone.style.top = (e.clientY - nDeltaY) + "px";
		if(e.stopPropagation){
			e.stopPropagation();
		}else{
			e.cancelBubble = true;
		}
		bEventPairFlag = false;
	}

	function upHandler(e) {
		if(!bEventPairFlag){
			bEventPairFlag = true;
			if((oDraggingObj.middleX() >= oTargetArea.topLeftX()) &&
					(oDraggingObj.middleY() >= oTargetArea.topLeftY()) &&
					(oDraggingObj.middleX() <= oTargetArea.btmRightX()) &&
					(oDraggingObj.middleY() <= oTargetArea.btmRightY())){
				alert('Olleh!');
			}

			if(!e){
				e = window.event;
			}

			if(document.removeEventListener){
				document.removeEventListener("mouseup", upHandler, true);
				document.removeEventListener("mousemove", moveHandler, true);
			}else if(document.detachEvent){
				elClone.detachEvent("onlosecapture", upHandler);
				elClone.detachEvent("onmouseup", upHandler);
				elClone.detachEvent("onmousemove", moveHandler);
				elClone.releaseCapture();
			}else{
				document.onmouseup = oOlduphandler;
				document.onmousemove = oOldmovehandler;
			}

			if(e.stopPropagation){
				e.stopPropagation();
			}else{
				e.cancelBubble = true;
			}
			document.body.removeChild(elClone);

		}
	}
}