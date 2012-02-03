var day9 = function(elCanvas, elDivCP) {
	var elLineCount = null, elTrail = null, elThickness = null, elSpeed = null;
	elRaidus = null, elLineLength = null, oTimeoutJob = null, elColor = null,
			elColor2 = null, elColor3 = null, elColor4 = null;
	var oGradation = elCanvas.getContext('2d').createLinearGradient(0, 0,
			elCanvas.width, elCanvas.height);
	setGradationObj('white', 'blue', 'orange', 'red');
	var MIN_ALPHA_PERCENTAGE = 10;
	var aLines = null;

	// 조정 메뉴 생성
	var setControlPanelUp = function() {
		elLineCount = document.createElement("input");
		elLineCount.type = 'range';
		elLineCount.min = 6;
		elLineCount.max = 40;
		elLineCount.step = 1;
		elLineCount.width = '100px';
		elLineCount.value = 20;
		elLineCount.onchange = function(e) {
			onDataChange(e);
		};
		var elLabel = document.createElement('div');
		elLabel.innerHTML = "Lines(6-40) ";
		elDivCP.appendChild(elLabel);
		elDivCP.appendChild(elLineCount);

		elTrail = document.createElement("input");
		elTrail.type = 'range';
		elTrail.min = 5;
		elTrail.max = 40;
		elTrail.step = 1;
		elTrail.width = '100px';
		elTrail.value = 15;
		elTrail.onchange = function(e) {
			onDataChange(e);
		};
		elLabel = document.createElement('div');
		elLabel.innerHTML = "Trails(5-40) ";
		elDivCP.appendChild(elLabel);
		elDivCP.appendChild(elTrail);

		elThickness = document.createElement("input");
		elThickness.type = 'range';
		elThickness.min = 5;
		elThickness.max = 20;
		elThickness.step = 1;
		elThickness.width = '100px';
		elThickness.value = 15;
		elThickness.onchange = function(e) {
			onDataChange(e);
		};
		elLabel = document.createElement('div');
		elLabel.innerHTML = "Thickness(5-20) ";
		elDivCP.appendChild(elLabel);
		elDivCP.appendChild(elThickness);

		elSpeed = document.createElement("input");
		elSpeed.type = 'range';
		elSpeed.min = 400;
		elSpeed.max = 490;
		elSpeed.step = 1;
		elSpeed.width = '100px';
		elSpeed.value = 450;
		elSpeed.onchange = function(e) {
			onDataChange(e);
		};
		elLabel = document.createElement('div');
		elLabel.innerHTML = "Speed(400-490) ";
		elDivCP.appendChild(elLabel);
		elDivCP.appendChild(elSpeed);

		elRaidus = document.createElement("input");
		elRaidus.type = 'range';
		elRaidus.min = 1;
		elRaidus.max = elCanvas.width * 0.1;
		elRaidus.step = 1;
		elRaidus.width = '100px';
		elRaidus.value = 30;
		elRaidus.onchange = function(e) {
			onDataChange(e);
		};
		elLabel = document.createElement('div');
		elLabel.innerHTML = "Inner ring raidus(1-" +
				parseInt(elCanvas.width * 0.1) + ") ";
		elDivCP.appendChild(elLabel);
		elDivCP.appendChild(elRaidus);

		elLineLength = document.createElement("input");
		elLineLength.type = 'range';
		elLineLength.min = 5;
		elLineLength.max = elCanvas.width * 0.4;
		elLineLength.step = 1;
		elLineLength.value = 100;
		elLineLength.width = '100px';
		elLineLength.onchange = function(e) {
			onDataChange(e);
		};
		elLabel = document.createElement('div');
		elLabel.innerHTML = "Length(5-" + parseInt(elCanvas.width * 0.4) + ") ";
		elDivCP.appendChild(elLabel);
		elDivCP.appendChild(elLineLength);

		elLabel = document.createElement('div');
		elLabel.innerHTML = "스핀박스는 캔버스 지원 모든 브라우저에서 정상 작동하나 레인지인풋은 파폭에서 지원이 안되네요. 딱히 대체하여 사용할만한게 없어서 그냥 두었습니다. 컬러픽커도 오페라에서만 되네요...";
		elDivCP.appendChild(elLabel);

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