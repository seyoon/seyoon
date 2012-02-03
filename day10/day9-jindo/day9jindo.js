var day9 = function(elCanvas, elDivCP) {
	var elLineCount = null, elTrail = null, elThickness = null, elSpeed = null;
	elRaidus = null, elLineLength = null, oTimeoutJob = null, elColor = null,
			elColor2 = null, elColor3 = null, elColor4 = null;
	var oGradation = elCanvas.getContext('2d').createLinearGradient(0, 0,
			elCanvas.width, elCanvas.height);
	setGradationObj('white', 'blue', 'orange', 'white');
	var MIN_ALPHA_PERCENTAGE = 10;
	var aLines = null;

	var setControlPanelUp = function() {
		elLineCount = $("<input>");
		$Element(elLineCount).attr('type', 'range').attr('min', 6).attr('max',
				60).attr('step', 1).attr('width', '100px').attr('value', 60);
		$Fn(function(e) {
			onDataChange(e);
		}).attach(elLineCount, 'change');
		var elLabel = $Element('<div>').html("Lines(6-60) ");
		$Element(elDivCP).append(elLabel).append(elLineCount);

		elTrail = $("<input>");
		$Element(elTrail).attr('type', 'range').attr('min', 5).attr('max', elLineCount.value)
				.attr('step', 1).attr('width', '100px').attr('value', 10);
		$Fn(function(e) {
			onDataChange(e);
		}).attach(elTrail, 'change');
		elLabel = $Element('<div>').html("Trails(5-40) ");
		$Element(elDivCP).append(elLabel).append(elTrail);

		elThickness = $("<input>");
		$Element(elThickness).attr('type', 'range').attr('min', 5).attr('max',
				80).attr('step', 1).attr('width', '100px').attr('value', 60);
		$Fn(function(e) {
			onDataChange(e);
		}).attach(elThickness, 'change');
		elLabel = $Element('<div>').html("Thickness(5-80) ");
		$Element(elDivCP).append(elLabel).append(elThickness);

		elSpeed = $("<input>");
		$Element(elSpeed).attr('type', 'range').attr('min', 400).attr('max',
				495).attr('step', 1).attr('width', '100px').attr('value', 460);
		$Fn(function(e) {
			onDataChange(e);
		}).attach(elSpeed, 'change');
		elLabel = $Element('<div>').html("Speed(400-495) ");
		$Element(elDivCP).append(elLabel).append(elSpeed);

		elRaidus = $("<input>");
		$Element(elRaidus).attr('type', 'range').attr('min', 0).attr('max',
				elCanvas.width * 0.1).attr('step', 1).attr('width', '100px')
				.attr('value', 0);
		$Fn(function(e) {
			onDataChange(e);
		}).attach(elRaidus, 'change');
		elLabel = $Element('<div>').html(
				"Inner ring raidus(1-" + parseInt(elCanvas.width * 0.1) + ") ");
		$Element(elDivCP).append(elLabel).append(elRaidus);

		elLineLength = $("<input>");
		$Element(elLineLength).attr('type', 'range').attr('min', 5).attr('max',
				elCanvas.width * 0.4).attr('step', 1).attr('value', elCanvas.width * 0.4).attr(
				'width', '100px');
		$Fn(function(e) {
			onDataChange(e);
		}).attach(elLineLength, 'change');
		elLabel = $Element('<div>').html("Length(5-" + parseInt(elCanvas.width * 0.4) + ") ");
		$Element(elDivCP).append(elLabel).append(elLineLength);

		elLabel = $Element('<div>').html("스핀박스는 캔버스 지원 모든 브라우저에서 정상 작동하나 레인지인풋은 파폭에서 지원이 안되네요. 딱히 대체하여 사용할만한게 없어서 그냥 두었습니다. 컬러픽커도 오페라에서만 되네요...");
		$Element(elDivCP).append(elLabel);
	};

	function setGradationObj(sColor1, sColor2, sColor3, sColor4) {
		oGradation.addColorStop(0, sColor1);
		oGradation.addColorStop(0.3, sColor2);
		oGradation.addColorStop(0.6, sColor3);
		oGradation.addColorStop(1, sColor4);
	}

	var line = function() {
		this.startX = 0;
		this.startY = 0;
		this.endX = 0;
		this.endY = 0;
		this.alpha = 0;
	};

	setControlPanelUp();
	initSpinner(aLines);

	function onDataChange() {
		clearInterval(oTimeoutJob);
		initSpinner(aLines);
	}

	function initSpinner(aLines) {
		aLines = new Array();
		for( var i = 0; i < elLineCount.value; i++){
			aLines[i] = new line();
		}

		setLineProperties(parseInt(elRaidus.value), parseInt(elRaidus.value) +
				parseInt(elLineLength.value), elLineCount.value,
				elCanvas.width / 2, (elCanvas.height / 2), aLines,
				elTrail.value);
		var nIndex = 0;
		oTimeoutJob = setInterval(function() {
			draw(elCanvas, aLines, elThickness.value, nIndex++);
		}, 500 - elSpeed.value);

	}

	function setLineProperties(nInnerRaidus, nOutterRaidus, nVertice, origX,
			origY, aLines, nTrail) {
		var nAlphaStepSize = (100 - MIN_ALPHA_PERCENTAGE) / nTrail;
		for( var k = 0, i = 0; i < Math.PI * 2 - ((Math.PI * 2) / nVertice) +
				0.1; i += (Math.PI * 2) / nVertice, k++){
			aLines[k].startX = origX + ((Math.cos(i)) * nInnerRaidus);
			aLines[k].startY = origY + ((Math.sin(i)) * nInnerRaidus);
			aLines[k].endX = origX + ((Math.cos(i)) * nOutterRaidus);
			aLines[k].endY = origY + ((Math.sin(i)) * nOutterRaidus);
			var nAlpha = (MIN_ALPHA_PERCENTAGE + (nAlphaStepSize * k)) / 100;
			aLines[k].alpha = (nAlpha <= 1) ? (nAlpha)
					: (MIN_ALPHA_PERCENTAGE / 100);
		}
	}

	function draw(elCnvs, aLines, nThick, nStartIndex) {
		var oCntx = elCnvs.getContext('2d');
		oCntx.lineCap = 'round';
		oCntx.fillStyle = 'black';
		oCntx.strokeStyle = oGradation;
		oCntx.globalAlpha = 1;
		oCntx.clearRect(0, 0, elCnvs.width, elCnvs.height);
		oCntx.fillRect(0, 0, elCnvs.width, elCnvs.height);
		oCntx.globalCompositeOperation = 'lighter';

		oCntx.lineWidth = nThick;
		for( var i = 0; i < aLines.length; i++){
			var oLine = aLines[i];
			oCntx.globalAlpha = oLine.alpha;
			oCntx.beginPath();
			oCntx.moveTo(oLine.startX, oLine.startY);
			oCntx.lineTo(oLine.endX, oLine.endY);
			oCntx.closePath();
			oCntx.stroke();
		}

		var nTmp = 0;
		var nLength = aLines.length;
		for( var i = 0; i < nLength; i++){
			if(i == 0)
				nTmp = aLines[nLength - 1].alpha;
			if(i + 1 == nLength){
				aLines[0].alpha = nTmp;
				break;
			}
			aLines[nLength - 1 - i].alpha = aLines[nLength - 2 - i].alpha;
		}
	}
};