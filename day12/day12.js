var day12 = function(elDiv) {

	generateBoxes();
	function generateBoxes() {
		var welWrapper = $Element(elDiv);
		var nRedBoxes = parseInt(Math.random() * 10) + 1;
		var nBlueBoxes = parseInt(Math.random() * 10) + 1;
		var initialX = 0, initialY = 0, bSucceed = false;
		var oTransition = new jindo.Transition();
		for( var i = 0; i < nRedBoxes; i++){
			var welRedBox = $Element('<div>').className('draggable');
			welRedBox.offset((welWrapper.height() - welRedBox.height()) *
					Math.random(), (welWrapper.width() - welRedBox.width()) *
					Math.random());
			welWrapper.append(welRedBox);
		}

		for( var j = 0; j < nBlueBoxes; j++){
			var welBlueBox = $Element('<div>').className('droppable').html(0);
			welBlueBox.offset((welWrapper.height() - welBlueBox.width()) *
					Math.random(), (welWrapper.width() - welBlueBox.width()) *
					Math.random());
			welWrapper.append(welBlueBox);
		}

		var welCloneWrapper = $Element(elDiv.cloneNode(true));
		welWrapper.parent().append(welCloneWrapper);
		var oFoggy = new jindo.Foggy();
		
		welWrapper.delegate('click','.droppable',function(e){
			oFoggy.show(e.element);
		});
		welCloneWrapper.delegate('click','.droppable',function(e){
			oFoggy.show(e.element);
		});
		oFoggy.getFog().onclick = function(){oFoggy.hide();};
		
		new jindo.RolloverArea(welCloneWrapper.$value(),{
			sClassName : 'draggable',
			sClassPrefix : 'draggable-',
			bCheckMouseDown : true,
			htStatus : {
				sOver : 'over',
				sDown : 'down'
			}
		});
		
		var oDragArea = new jindo.DragArea(welCloneWrapper.$value(), {
			sClassName : 'draggable',
			bFlowOut : true,
			nThreshold : 5
		}).attach({
			'dragStart' : function(ce) {
				initialX = $Element(ce.elDrag).css('left');
				initialY = $Element(ce.elDrag).css('top');
				bSucceed=false;
			},

			'handleUp' : function(ce) {

				if(!bSucceed){
					oTransition.abort().start(200, ce.elDrag, {
						'@left' : jindo.Effect['easeIn'](initialX)
					}, ce.elDrag, {
						'@top' : jindo.Effect['easeIn'](initialY)
					});
					
				}else{
					$Element(ce.elDrag).css('top', initialY).css('left',
							initialX);
				}
			},
			'end' : function(ce){
				$Element(ce.elDrag).className('draggable');
			}
		});

		new jindo.DropArea(welCloneWrapper.$value(), {
			sClassName : 'droppable',
			oDragInstance : oDragArea,
		}).attach({
			'over' : function(ce) {
				ce.elDrop.style.backgroundColor = 'skyblue';
			},
			'drop' : function(ce) {
				bSucceed = true;
				ce.elDrop.style.backgroundColor = 'blue';
				var welDrop = $Element(ce.elDrop);
				welDrop.html(parseInt(welDrop.html()) + 1);
				ce.elDrag.nx = initialX;
				
			},
			'out' : function(ce) {
				ce.elDrop.style.backgroundColor = 'blue';
			}
		});

	}

};