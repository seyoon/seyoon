/**
 * @fileOverview 자식 노드를 Ajax요청으로 실시간으로 가져오는 동적트리
 * @author senxation
 * @version 1.0.2
 */
jindo.DynamicTree = jindo.$Class({
	/** @lends jindo.DynamicTree.prototype */
	
	/**
	 * DynamicTree 컴포넌트를 생성한다.
	 * @constructs
	 * @class 자식 노드를 Ajax요청으로 실시간으로 가져오는 동적트리 컴포넌트
	 * @extends jindo.Tree
	 * @param {HTMLElement} el 컴포넌트를 적용할 Base (기준) 엘리먼트
	 * @param {HashTable} htOption 옵션객체
	 * @example
var oDanamicTree = new jindo.DynamicTree(jindo.$('tree'), {
	sClassPrefix: 'tree-',
	sUrl : "http://ajaxui.jindodesign.com/docs/components/samples/response/DynamicTree.php"
}).attach({
	request : function(oCustomEvent) {
		//자식노드의 데이터를 가져오기위해 Ajax 요청을 보내기 직전에 발생
		//이벤트 객체 oCustomEvent = {
		//	element : (HTMLElement) 선택된 노드, 
		//	htRequestParameter : { //(Object) Ajax 요청을 보낼 파라메터 객체
		//		sKey : (String) 선택된 노드의 유일한 key값
		// 	}
		//}
		//oCustomEvent.stop() 수행시 Ajax 요청 보내지 않음
	},
	response : function(oCustomEvent) {
		//응답을 받은 후 자식노드를 트리에 추가하기 전에 발생
		//이벤트 객체 e = {
		//	htResponseJSON : (HashTable) Ajax 응답의 JSON 객체
		//}
		//oCustomEvent.stop() 수행시 응답에 대한 자식노드를 추가하지 않음
	}
});
	 * @example
응답 예제
{
	sKey : 'tree-data-12452282036211399187', //부모 노드의 키
	htChildren : [
		{
			sLabel : 'node', //첫번째 자식 노드의 레이블   
			bHasChild : false //노드가 자식을 가지는지의 여부 
		},
		{
			sLabel : 'internal-node', 
			bHasChild : true
		}
	]
}
	 */
	$init : function(el, htOption) {
		
		var htDefaultOption = {
			sUrl : "", //요청 url
			sRequestType : "jsonp", //요청타입
			sRequestMethod : "get", //요청방식
			htRequestParameter : {} //(Object) 파라메터
		};
		
		this.option(htDefaultOption);
		this.option(htOption || {});

		this._attachEvents();		
		this._initAjax();
	},
	
	_attachEvents : function() {
		var self = this;
		
		this.attach("beforeExpand", function(oCustomEvent){
			
			var el = oCustomEvent.element;
			
			var self = this;
			//받아온 데이터가 있는지확인
			if(self.getNodeData(el).hasOwnProperty("_aChildren")) {
				return;
			}
	
			var htRequestParameter = self.option("htRequestParameter");
			htRequestParameter.key = self._getNodeDataKey(el);
			var htParam = {
				element : el,
				htRequestParameter : htRequestParameter 
			};
			
			if (self.fireEvent("request", htParam)) {
				//데이터를 받아옴
				self._request(htParam.htRequestParameter);
			}
			else {
				oCustomEvent.stop();				
			}
		});
	},
	
	_initAjax : function() {
		var htOption = this.option();
		var sPrefix = this.option("sClassPrefix");
        var sUrl = htOption.sUrl;
		var self = this;     
		this._oAjax = jindo.$Ajax(sUrl, {
            type: htOption.sRequestType,
            method: htOption.sRequestMethod,
            onload: function(oResponse){
                try {
					var htParam = {
						htResponseJSON : oResponse.json() 
					};
					
					if (!self.fireEvent("response", htParam)) {
						return;
					}
					
					var elNode = self.createNode(htParam.htResponseJSON["aChildren"]);
					var elTargetNode = jindo.$$.getSingle("." + htParam.htResponseJSON["sKey"], self.getRootList());
					if(self.getChildListOfNode(elTargetNode)) {
						return;
					}
					self.appendNode(elTargetNode, elNode);
					
					//자식이 있는경우 닫힌상태로 append
					jindo.$A(elNode).forEach(function(el){
						if (jindo.$$.getSingle("." + sPrefix + "has-child", el)) {
							jindo.$Element(el).addClass(sPrefix + "collapsed");	
						}
					});
                } 
                catch (e) {
                }
            }
        });
	},
	
	/**
     * @ignore
     */
    _request: function(htRequestParameter){
		this._oAjax.abort();
		this._oAjax.request(htRequestParameter);	
    },
		
	/**
	 * 노드가 자식을 가지고 있는지 여부를 가져온다. (overriding)
	 * @param {Object} elNode
	 * @return {Boolean}
	 */
	hasChild : function(elNode) {
		return this._htNodeData[this._getNodeDataKey(elNode)]["bHasChild"];
	},
	
	/**
	 * 노드를 새로 그린다. (자식노드가 있거나 마지막 노드일경우 클래스명 처리)
	 * @ignore
	 * @param {HTMLElement} elNode
	 */
	_paintNode : function(elNode) {
		if (!elNode) {
			return;
		}
		var htPart = this.getPartsOfNode(elNode);
		var aChildNodes = this.getChildNodes(elNode);
		
		var oNodeData = this.getNodeData(elNode);
		
		var welNode = jindo.$Element(elNode); 
		var welItem = jindo.$Element(htPart.elItem);

		delete oNodeData["_aChildren"]; //자식이 없으면 _aChildren 제거
		
		//자식이 있는지 여부		
		if (this.hasChild(elNode)) {
			welItem.addClass(this.htClassName.sHasChild);
			if (aChildNodes.length > 0) { //Ajax로 받아오기전에는 length == 0;
				oNodeData["bHasChild"] = true;
				oNodeData["_aChildren"] = [];
			}
			
			var self = this;
			jindo.$A(aChildNodes).forEach(function(elNode, i){
				oNodeData["_aChildren"].push(self.getNodeData(elNode));
			});
		}
		else {
			welItem.removeClass(this.htClassName.sHasChild);
			if (htPart.elChild) {
				htPart.elChild.parentNode.removeChild(htPart.elChild);	
			}
		}
		
		//마지막 노드인지
		oNodeData["lastNode"] = jindo.$$.getSingle('~ .' + this.htClassName.sNode, elNode) ? false : true;
		if (oNodeData["lastNode"]) {
			welNode.addClass(this.htClassName.sLastNode);
		} else {
			welNode.removeClass(this.htClassName.sLastNode);
		}
		elNode.parentNode.style.zoom = 1; //ie 렌더링 버그 수정!!
	},
	
	/**
	 * (overriding)
	 * @ignore
	 */
	_makeNodeData : function(elNode) {
		var oNodeData = this.getNodeData(elNode);
		oNodeData["bHasChild"] = false;
		if (jindo.$Element(this.getPartsOfNode(elNode).elItem).hasClass(this.option('sClassPrefix') + 'has-child')) {
			oNodeData["bHasChild"] = true;				
		}	
		this.$super._makeNodeData(elNode);
	}
	
}).extend(jindo.Tree);
