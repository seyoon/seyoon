var Day6 = function(elDivLeft, elDivRight) {
	var oInstance = this, nInitialValue = 0, dStartTime = 0, oTimeoutJob = null, bEventPairFlag = false;
	;
	if(arguments.length == 2){
		oInstance = new Day6(elDivLeft, elDivRight, false, false);
		return oInstance;
	}else if(arguments.length == 4){
		var elBtnPlus = document.createElement("input");
		elBtnPlus.value = "+";
		elBtnPlus.type = "button";
		elBtnPlus.onclick = function() {
			_onPlusBtnPressed();
		};
		elDivLeft.appendChild(elBtnPlus);

		var _initEvents = function(elTxtBox, elBtnUp, elBtnDown) {
			if(document.addEventListener){
				elTxtBox.addEventListener("blur", function() {
					oInstance.rangeEvaluation(elTxtBox);
				}, false);
				elBtnUp.addEventListener("mousedown", function() {
					_onBtnIncreasePressed(elTxtBox);
				}, false);
				elBtnUp.addEventListener("mouseout", function() {
					_finalizeJob(elTxtBox, true);
				}, false);
				elBtnUp.addEventListener("mouseup", function() {
					_finalizeJob(elTxtBox, true);
				}, false);
				elBtnDown.addEventListener("mousedown", function() {
					_onBtnDecreasePressed(elTxtBox);
				}, false);
				elBtnDown.addEventListener("mouseout", function() {
					_finalizeJob(elTxtBox, false);
				}, false);
				elBtnDown.addEventListener("mouseup", function() {
					_finalizeJob(elTxtBox, false);
				}, false);
			}else{
				elTxtBox.attachEvent("onblur", function() {
					oInstance.rangeEvaluation(elTxtBox);
				});
				elBtnUp.attachEvent("onmousedown", function() {
					_onBtnIncreasePressed(elTxtBox);
				});
				elBtnUp.attachEvent("onmouseout", function() {
					_finalizeJob(elTxtBox, true);
				});
				elBtnUp.attachEvent("onmouseup", function() {
					_finalizeJob(elTxtBox, true);
				});
				elBtnDown.attachEvent("onmousedown", function() {
					_onBtnDecreasePressed(elTxtBox);
				});
				elBtnDown.attachEvent("onmouseout", function() {
					_finalizeJob(elTxtBox, false);
				});
				elBtnDown.attachEvent("onmouseup", function() {
					_finalizeJob(elTxtBox, false);
				});
			}
		};

		var _onBtnIncreasePressed = function(elArg) {
			bEventPairFlag = true;
			nInitialValue = Number(elArg.value);
			dStartTime = (new Date()).getTime();
			oTimeoutJob = setInterval(function() {
				_autoIncrement(elArg);
			}, 100);
		};

		var _onBtnDecreasePressed = function(elArg) {
			bEventPairFlag = true;
			nInitialValue = Number(elArg.value);
			dStartTime = (new Date()).getTime();
			oTimeoutJob = setInterval(function() {
				_autoDecrement(elArg);
			}, 100);
		};

		var _autoIncrement = function(elArg) {
			if(((new Date()).getTime() - Number(dStartTime)) < 500)
				return false;
			oInstance.increment(elArg);
		};

		var _autoDecrement = function(elArg) {
			if(((new Date()).getTime() - Number(dStartTime)) < 500)
				return false;
			oInstance.decrement(elArg);
		};

		var _finalizeJob = function(elArg, type) {
			clearInterval(oTimeoutJob);
			if(nInitialValue == elArg.value && bEventPairFlag){
				if(type == true){
					oInstance.increment(elArg);
				}else{
					oInstance.decrement(elArg);
				}
			}
			bEventPairFlag = false;
		};

		this.extractNumbers = function(elArg) {
			var rxNumbers = /[\d]+/g;
			var nExtValue = ((elArg.value).match(rxNumbers)).join('');
			elArg.value = Number(nExtValue);
			return elArg.value;
		};

		this.increment = function(elArg) {
			if(this.extractNumbers(elArg) >= 300)
				return false;
			elArg.value = Number(elArg.value) + 1;
		};

		this.decrement = function(elArg) {
			if(this.extractNumbers(elArg) <= 100)
				return false;
			elArg.value = Number(elArg.value) - 1;
		};

		this.rangeEvaluation = function(elArg) {
			var nExtValue = this.extractNumbers(elArg);

			if(nExtValue > 300){
				elArg.value = 300;
			}else if(nExtValue < 100){
				elArg.value = 100;
			}
		};

		var _onDelBtnPressed = function(elDelBtn) {
			elDivRight.removeChild(elDelBtn.parentNode);
		};

		var _onPlusBtnPressed = function() {
			var elDivNewSpinBoxSet = document.createElement("div");
			var elBtnDel = document.createElement("input");
			elBtnDel.type = "button";
			elBtnDel.value = "-";
			elBtnDel.onclick = function() {
				_onDelBtnPressed(elBtnDel);
			};
			var elNewSpinBox = document.createElement("input");
			elNewSpinBox.type = "text";
			elNewSpinBox.value = 200;
			var elBtnNewIncrement = document.createElement("input");
			elBtnNewIncrement.type = "button";
			elBtnNewIncrement.value = "up";
			var elBtnNewDecrement = document.createElement("input");
			elBtnNewDecrement.type = "button";
			elBtnNewDecrement.value = "down";
			elDivNewSpinBoxSet.appendChild(elBtnDel);
			elDivNewSpinBoxSet.appendChild(elNewSpinBox);
			elDivNewSpinBoxSet.appendChild(elBtnNewIncrement);
			elDivNewSpinBoxSet.appendChild(elBtnNewDecrement);
			elDivRight.appendChild(elDivNewSpinBoxSet);
			_initEvents(elNewSpinBox, elBtnNewIncrement, elBtnNewDecrement);
		};
	}
};
