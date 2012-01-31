var vendingMachine = function() {
	var oInstance = this;
	if(arguments.length == 0){
		oInstance = new vendingMachine(false, false);
		return oInstance;
	}else if(arguments.length == 2){
		var MAX_GOODS_ON_STAGE = 8;
		var MAX_ALLOWED_BILLS = 2;
		var INITIAL_MONEY = 10000;
		var MAX_USAGE_LIMIT = 3000;
		var nMoneyLeft = INITIAL_MONEY, nMoneyInserted = 0, nMoneyDragging = 0, billCount = 0;
		var elMachineHead = document.getElementById('machineHead');
		var elCoinBox = document.getElementById('coins');
		var elDivSafeZone = document.getElementById('moneyIndicator');
		var elMoneyLeft = document.getElementById('moneyLeft');
		var elBtnRefund = document.getElementById('btnRefund');

		this.jsMap = function jsMap() {
			this._array = new Array();
			this.pointer = 0;
			this._getIndexByKey = function(key) {
				for ( var i = 0; i < this._array.length; i++) {
					if (key == this._array[i][0]) {
						return i;
					}
				}
				return -1;
			};

			this.put = function(key, value) {
				var index = this._getIndexByKey(key);
				if (index == -1) {
					var newArray = new Array();
					newArray[0] = key;
					newArray[1] = value;
					this._array[this._array.length] = newArray;
				} else {
					this._array[index][1] = value;
				}
			};

			this.getValueByIndex = function(index) {
				return this._array[index][1];
			};

			this.getKeyByIndex = function(index) {
				return this._array[index][0];
			};

			this.get = function(key) {
				for ( var i = 0; i < this._array.length; i++) {
					if (this._array[i][0] == key) {
						return this._array[i][1];
					}
				}
			};

			this.isNext = function() {
				var result;
				if (this._array.length > this.pointer) {
					result = true;
				} else {
					result = false;
				}
				this.pointer++;
				return result;
			};

			this.size = function() {
				return this._array.length;
			};

			this.nowKey = function() {
				return this._array[this.pointer - 1][0];
			};
			this.nowValue = function() {
				return this._array[this.pointer - 1][1];
			};
		};
		
		var oStuff = function(nValue, sImgSrc) {
			this.value = nValue;
			this.stock = parseInt(Math.random() * 3 + 1);
			this.imgSrc = sImgSrc;
		};
		
		var goods = new oInstance.jsMap();
		
		this.getGlobalOffset= function (elArg, type) {
			var nOffset = 0;
			while (elArg) {
				nOffset += eval("elArg.offset" + type);
				elArg = elArg.offsetParent;
			}
			return nOffset;
		};
		
		var _setCoinBox = function _setCoinBox(elDivBox) {
			var coinTypes = new Array(50, 100, 500, 1000);

			for ( var i = 0; i < coinTypes.length; i++) {
				var elDivCoinBox = document.createElement('div');
				elDivCoinBox.className = 'coin';
				elDivCoinBox.onmousedown = function(evt) {
					try {
						invokeDragEvent(this, elDivSafeZone, event);
					} catch (e) {
						invokeDragEvent(this, elDivSafeZone, evt);
					}

				};
				var elDivCoinImg = document.createElement('div');
				elDivCoinImg.className = 'coinImg';
				elDivCoinImg.innerHTML = coinTypes[i];
				var elDivCoinValue = document.createElement('div');
				elDivCoinValue.className = 'coinValue';
				elDivCoinValue.innerHTML = "\\ " + coinTypes[i];
				elDivCoinBox.appendChild(elDivCoinImg);
				elDivCoinBox.appendChild(elDivCoinValue);
				elDivBox.appendChild(elDivCoinBox);
				elDivCoinBox.style.top = oInstance.getGlobalOffset(elDivBox, "Top") + i * 43
						+ 'px';
				elDivCoinBox.style.width = elDivBox.offsetWidth + 'px';
			}

			_setMoneyLeft(nMoneyLeft);

		};
		
		_setCoinBox(elCoinBox);
		_setMoneyInserted(0);

		log('Please insert coins.');
		
		for ( var i = 1; i < 16; i++) {
			goods.put("CAR" + i, new oStuff(50 * i, i + ".gif"));
		}
		
		var _refund = function() {
			nMoneyLeft += nMoneyInserted;
			log("refund : " + nMoneyInserted);
			nMoneyInserted = 0;
			_setMoneyInserted(nMoneyInserted);
			_setMoneyLeft(nMoneyLeft);

		};

		if (document.addEventListener) {
			elBtnRefund.addEventListener('click', function() {
				_refund();
			}, false);

		} else if (document.attachEvent) {
			elBtnRefund.attachEvent('onclick', function() {
				_refund();
			});
		}

		var _fCallbackSuccess = function() {
			if (nMoneyLeft >= nMoneyDragging) {
				if ((nMoneyDragging == 1000) && (MAX_ALLOWED_BILLS <= billCount)) {
					log('Only ' + MAX_ALLOWED_BILLS
							+ ' paper bills are allowed to use.');
				} else {

					if (MAX_USAGE_LIMIT >= (nMoneyDragging + nMoneyInserted)) {
						nMoneyInserted += nMoneyDragging;
						nMoneyLeft -= nMoneyDragging;
						document.getElementById('moneyIndicator').innerHTML = nMoneyInserted;
						_setMoneyLeft(nMoneyLeft);
						billCount++;
						log('Inserted : ' + nMoneyDragging);
					} else {
						log('Coin box is full. Sorry!');
					}
				}
			} else {
				log('Not enough money!');
			}
		};

		var _fCallbackFail = function() {
			if (nMoneyLeft >= nMoneyDragging) {
				nMoneyLeft -= nMoneyDragging;
				_setMoneyLeft(nMoneyLeft);
				log('WTF! What happend to my money!');
			} else {
				log('Not enough money!');
			}
		};

		var _onDragEventOccured = function(elDivCoin) {
			nMoneyDragging = parseInt(elDivCoin.childNodes[0].innerHTML);
		};


		var invokeDragEvent = function(elDivCoinBox, elDivSafeZone, event) {
			drag(elDivCoinBox, elDivSafeZone, event, _fCallbackSuccess,
					_fCallbackFail, _onDragEventOccured);
		};

		function _setMoneyLeft(nMoney) {
			elMoneyLeft.innerHTML = "\\ " + nMoney + " in my pocket.";
		}
		;

		function _setMoneyInserted(nMoneyInserted) {
			document.getElementById('moneyIndicator').innerHTML = nMoneyInserted;
		}
		
		var _addGoodsSlot = function(elDivBox, goodsName, goodsValue, imgSrc) {
			var elDivNewSlot = document.createElement('div');
			elDivNewSlot.className = 'goods';
			elDivNewSlot.ondblclick = function() {
				_setSelectedStyle(elDivNewSlot);
				_getStuff(this);
			};
			var elDivNewGoodsName = document.createElement('div');
			elDivNewGoodsName.className = 'goodsName';
			elDivNewGoodsName.innerHTML = goodsName;
			var elDivNewValueLabel = document.createElement('div');
			elDivNewValueLabel.className = 'valueLabel';
			elDivNewValueLabel.innerHTML = goodsValue;
			var elImg = document.createElement('img');
			elImg.src = imgSrc;
			elImg.alt = goodsName;
			elImg.className = 'goodsImg';
			elDivNewSlot.appendChild(elImg);
			elDivNewSlot.appendChild(elDivNewValueLabel);
			elDivBox.appendChild(elDivNewSlot);
		};
		
		mountGoods(elMachineHead);
		
		function mountGoods(elDivBox) {
			var isUsedIndex = function(nIndex, aUsed) {
				for (nUsed in aUsed) {
					if (aUsed[nUsed] == nIndex)
						return true;
				}
				return false;
			};
			var aUsed = new Array();

			for ( var i = 0; i < MAX_GOODS_ON_STAGE;) {
				var nIndex = parseInt(Math.random() * goods.size());
				if (isUsedIndex(nIndex, aUsed))
					continue;
				i++;
				aUsed.push(nIndex);
				var sName = goods.getKeyByIndex(nIndex);
				var sValue = goods.getValueByIndex(nIndex).value;
				var sImgSrc = goods.getValueByIndex(nIndex).imgSrc;
				_addGoodsSlot(elDivBox, sName, sValue, sImgSrc);
			}
		}

		var _addGoodsSlot = function(elDivBox, goodsName, goodsValue, imgSrc) {
			var elDivNewSlot = document.createElement('div');
			elDivNewSlot.className = 'goods';
			elDivNewSlot.ondblclick = function() {
				_setSelectedStyle(elDivNewSlot);
				_getStuff(this);
			};
			var elDivNewGoodsName = document.createElement('div');
			elDivNewGoodsName.className = 'goodsName';
			elDivNewGoodsName.innerHTML = goodsName;
			var elDivNewValueLabel = document.createElement('div');
			elDivNewValueLabel.className = 'valueLabel';
			elDivNewValueLabel.innerHTML = goodsValue;
			var elImg = document.createElement('img');
			elImg.src = imgSrc;
			elImg.alt = goodsName;
			elImg.className = 'goodsImg';
			elDivNewSlot.appendChild(elImg);
			elDivNewSlot.appendChild(elDivNewValueLabel);
			elDivBox.appendChild(elDivNewSlot);
		};

		function _getStuff(elDivStuff) {
			var nStuffPrice = parseInt(elDivStuff.childNodes[1].innerHTML);
			if (nMoneyInserted >= nStuffPrice) {
				var sStuffName = elDivStuff.childNodes[0].alt;
				var oStuffInfo = goods.get(sStuffName);
				if (oStuffInfo.stock > 0) {
					nMoneyInserted -= nStuffPrice;
					_setMoneyInserted(nMoneyInserted);
					oStuffInfo.stock -= 1;
					log("WOW! I just got " + sStuffName + "!");
					if (oStuffInfo.stock > 0) {
						log(oStuffInfo.stock + " " + sStuffName + " in stock.");
					} else {
						log('SOLD OUT!');
					}
				} else {
					log('SOLD OUT!');
				}
			} else {
				log('Please insert more money.');
			}
		}

		function _setSelectedStyle(elSelected) {
			var aSiblings = elSelected.parentNode.childNodes;
			for (elChild in aSiblings) {
				aSiblings[elChild].className = 'goods';
			}
			elSelected.className = 'selectedGoods';
		}

		function log(sLog) {
			var logger = document.getElementById('log');
			logger.innerHTML = logger.innerHTML + sLog + "<br/>";
			logger.scrollTop = logger.scrollHeight;

		}
	}
};