function drag(elToDrag, elTarget, event, fCallbackSuccess, fCallbackFail,
		fCallbackReportObjInfo) {
	if(fCallbackReportObjInfo){
		fCallbackReportObjInfo(elToDrag);
	}
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

	// copyComputedStyle(elToDrag, elClone);
	$Element(elToDrag).parent().append(elClone);

	$Fn(moveHandler,document).attach(document,'mousemove');
	$Fn(upHandler,elClone).attach(elClone,'mouseup');
	$Event(event).stop();

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

	function moveHandler(e) {
		e = e.$value();
		$Element(elClone).css('left', (e.clientX - nDeltaX) + "px").css('top',
				(e.clientY - nDeltaY) + "px");
		$Event(e).stop();
		bEventPairFlag = false;
	}

	function upHandler(e) {
		e = e.$value();
		var result = false;
		if(!bEventPairFlag){
			bEventPairFlag = true;
			if((oDraggingObj.middleX() >= oTargetArea.topLeftX()) &&
					(oDraggingObj.middleY() >= oTargetArea.topLeftY()) &&
					(oDraggingObj.middleX() <= oTargetArea.btmRightX()) &&
					(oDraggingObj.middleY() <= oTargetArea.btmRightY())){
				result = true;
			}else{
				result = false;
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
			$Event(e).stop();
			$Element(elToDrag).parent().remove(elClone);

			if(result){
				if(fCallbackSuccess)
					fCallbackSuccess();
			}else{
				if(fCallbackFail)
					fCallbackFail();
			}
		}
	}
}