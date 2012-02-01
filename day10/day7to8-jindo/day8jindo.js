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
		var elMachineHead = $('machineHead');
		var elCoinBox = $('coins');
		var elDivSafeZone = $('moneyIndicator');
		var elMoneyLeft = $('moneyLeft');
		var elBtnRefund = $('btnRefund');

		this.jsMap = function jsMap() {
			this._array = new Array();
			this.pointer = 0;
			this._getIndexByKey = function(key) {
				for( var i = 0; i < this._array.length; i++){
					if(key == this._array[i][0]){
						return i;
					}
				}
				return -1;
			};

			this.put = function(key, value) {
				var index = this._getIndexByKey(key);
				if(index == -1){
					var newArray = new Array();
					newArray[0] = key;
					newArray[1] = value;
					this._array[this._array.length] = newArray;
				}else{
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
				for( var i = 0; i < this._array.length; i++){
					if(this._array[i][0] == key){
						return this._array[i][1];
					}
				}
			};

			this.isNext = function() {
				var result;
				if(this._array.length > this.pointer){
					result = true;
				}else{
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

		this.getGlobalOffset = function(elArg, type) {
			var nOffset = 0;
			while (elArg){
				nOffset += eval("elArg.offset" + type);
				elArg = elArg.offsetParent;
			}
			return nOffset;
		};
		
		function _setMoneyLeft(nMoney) {
			$Element(elMoneyLeft).html("\\ " + nMoney + " in my pocket.");
		}
		function _setMoneyInserted(nMoneyInserted) {
			$Element('moneyIndicator').html(nMoneyInserted);
		}
		function log(sLog) {
			var logger = $('log');
			logger.innerHTML = logger.innerHTML + sLog + "<br/>";
			logger.scrollTop = logger.scrollHeight;

		}
		var _setCoinBox = function _setCoinBox(elDivBox) {
			var coinTypes = new $A([ 50, 100, 500, 1000 ]);
			for( var i = 0; i < coinTypes.length(); i++){
				var elDivCoinBox = $Element('<div>').className('coin');
				elDivCoinBox.$value().onmousedown = function(evt) {
					try{
						invokeDragEvent(this, elDivSafeZone, event);
					}catch (e){
						invokeDragEvent(this, elDivSafeZone, evt);
					}
				};
				var elDivCoinImg = $Element('<div>').className('coinImg').html(coinTypes.get(i));
				var elDivCoinValue = $Element('<div>').className('coinValue').html("\\ " + coinTypes.get(i));
				elDivCoinBox.append(elDivCoinImg).append(elDivCoinValue);
				$Element(elDivBox).append(elDivCoinBox.$value());
				elDivCoinBox.css('top',oInstance.getGlobalOffset(elDivBox,
						"Top") +
						i * 43 + 'px').css('width', elDivBox.offsetWidth + 'px');
			}
			_setMoneyLeft(nMoneyLeft);

		};

		_setCoinBox(elCoinBox);
		_setMoneyInserted(0);

		log('Please insert coins.');

		for( var i = 1; i < 16; i++){
			goods.put("CAR" + i, new oStuff(50 * i, i + ".gif"));
		}

		var _refund = function() {
			nMoneyLeft += nMoneyInserted;
			log("refund : " + nMoneyInserted);
			nMoneyInserted = 0;
			_setMoneyInserted(nMoneyInserted);
			_setMoneyLeft(nMoneyLeft);

		};

		$Fn(function(){_refund();}).attach(elBtnRefund,'click');

		var _fCallbackSuccess = function() {
			if(nMoneyLeft >= nMoneyDragging){
				if((nMoneyDragging == 1000) && (MAX_ALLOWED_BILLS <= billCount)){
					log('Only ' + MAX_ALLOWED_BILLS +
							' paper bills are allowed to use.');
				}else{

					if(MAX_USAGE_LIMIT >= (nMoneyDragging + nMoneyInserted)){
						nMoneyInserted += nMoneyDragging;
						nMoneyLeft -= nMoneyDragging;
						$Element('moneyIndicator').html(nMoneyInserted);
						_setMoneyLeft(nMoneyLeft);
						billCount++;
						log('Inserted : ' + nMoneyDragging);
					}else{
						log('Coin box is full. Sorry!');
					}
				}
			}else{
				log('Not enough money!');
			}
		};

		var _fCallbackFail = function() {
			if(nMoneyLeft >= nMoneyDragging){
				nMoneyLeft -= nMoneyDragging;
				_setMoneyLeft(nMoneyLeft);
				log('WTF! What happend to my money!');
			}else{
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

		var _addGoodsSlot = function(elDivBox, goodsName, goodsValue, imgSrc) {
			var elDivNewSlot = $Element('<div>');
			elDivNewSlot.className('goods');
			elDivNewSlot.$value().ondblclick = function() {
				_setSelectedStyle(elDivNewSlot.$value());
				_getStuff(this);
			};
			
			$Element('<div>').className('goodsName').html(goodsName);
			var elDivNewValueLabel = $Element('<div>').className('valueLabel').html(goodsValue);
			var elImg = $Element('<img>').attr('src', imgSrc).attr('alt', goodsName).className('goodsImg');
			elDivNewSlot.append(elImg.$value()).append(elDivNewValueLabel);
			$Element(elDivBox).append(elDivNewSlot.$value());
		};
		
		function mountGoods(elDivBox) {
			var isUsedIndex = function(nIndex, aUsed) {
				for(nUsed in aUsed){
					if(aUsed[nUsed] == nIndex)
						return true;
				}
				return false;
			};
			var aUsed = new Array();

			for( var i = 0; i < MAX_GOODS_ON_STAGE;){
				var nIndex = parseInt(Math.random() * goods.size());
				if(isUsedIndex(nIndex, aUsed))
					continue;
				i++;
				aUsed.push(nIndex);
				var sName = goods.getKeyByIndex(nIndex);
				var sValue = goods.getValueByIndex(nIndex).value;
				var sImgSrc = goods.getValueByIndex(nIndex).imgSrc;
				_addGoodsSlot(elDivBox, sName, sValue, sImgSrc);
			}
		}

		mountGoods(elMachineHead);

		function _getStuff(elDivStuff) {
			var nStuffPrice = parseInt($Element(elDivStuff).child()[1].html());
			if(nMoneyInserted >= nStuffPrice){
				var sStuffName = $Element(elDivStuff).child()[0].attr('alt');
				var oStuffInfo = goods.get(sStuffName);
				if(oStuffInfo.stock > 0){
					nMoneyInserted -= nStuffPrice;
					_setMoneyInserted(nMoneyInserted);
					oStuffInfo.stock -= 1;
					log("WOW! I just got " + sStuffName + "!");
					if(oStuffInfo.stock > 0){
						log(oStuffInfo.stock + " " + sStuffName + " in stock.");
					}else{
						log('SOLD OUT!');
					}
				}else{
					log('SOLD OUT!');
				}
			}else{
				log('Please insert more money.');
			}
		}

		function _setSelectedStyle(elSelected) {
			var aSiblings = $Element(elSelected).parent().child();
			$ElementList(aSiblings).className('goods');
			$Element(elSelected).className('selectedGoods');
		}


	}
};