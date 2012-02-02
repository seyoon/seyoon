var day11 = function(elDivCalendar, nDateType) {
	var aDaysOfMonthes = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30,
			31);
	var nCurrentTime = new $Date();
	var nCurrentYear = nCurrentTime.year(), nCurrentMonth = nCurrentTime
			.month();

	// alert(getWeeksInTheMonth(2012, 1));
	setMonthHeader();
	drawDatebar();
	drawCalendar();

	function processLeapYear(nYear, aDays) {
		if(((nYear % 4 == 0) && (nYear % 100 != 0)) || (nYear % 400 == 0)){
			aDays[1] = 29;
		}
	}

	function getFirstDayOfTheMonth(nYear, nMonth) {
		var nFday = new Date(nYear, nMonth, 1);
		return $Date(nFday).day();
	}

	// real month -1
	function getWeeksInTheMonth(nYear, nMonth) {
		var nFday = getFirstDayOfTheMonth(nYear, nMonth);
		processLeapYear(nYear, aDaysOfMonthes);
		return Math.ceil((nFday + aDaysOfMonthes[nMonth]) / 7);
	}

	function drawDatebar(nDataType) {
		var aDay;
		if(nDataType = 'en'){
			aDay = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
		}else if(nDataType = 'en-simple'){
			aDay = new Array('S', 'M', 'T', 'W', 'T', 'F', 'S');
		}else{
			aDay = new Array('일', '월', '화', '수', '목', '금', '토');
		}
		var welDay = $Element('<div>').className('redDayHeader').html(aDay[0]);
		var welDayHeader = $Element('<div>').className('dayLine')
				.append(welDay);
		for( var r = 0; r < 5; r++){
			welDay = $Element('<div>').className('normDayHeader').html(
					aDay[r + 1]);
			welDayHeader.append(welDay);
		}
		welDay = $Element('<div>').className('blueDayHeader').html(aDay[6]);
		welDayHeader.append(welDay);
		$Element(elDivCalendar).append(welDayHeader);
	}

	function drawCalendar() {
		var welCalendar = $Element(elDivCalendar);
		var nFday = getFirstDayOfTheMonth(nCurrentYear, nCurrentMonth);
		var nWeeks = getWeeksInTheMonth(nCurrentYear, nCurrentMonth);
		var nDatePointer = 1;
		for( var j = 0; j < nWeeks; j++){
			var welNewWeek = $Element('<div>').className('week');
			var nDaySlots = 7;

			if(j == 0){
				for( var i = 0; i < nFday; i++){
					var welNewDay = $Element('<div>').className('grayDay');
					var nGrayDate = aDaysOfMonthes[(nCurrentMonth + 11) % 12] -
							(nFday - i - 1);
					welNewDay.html(nGrayDate);
					welNewWeek.append(welNewDay);
					nDaySlots--;
				}
			}
			var nTail = 1;
			for( var k = 0; k < nDaySlots; k++){
				var welNewDay;
				if(nDaySlots - k == 7){
					welNewDay = $Element('<div>').className('redDay');
				}else if(nDaySlots - k == 1){
					welNewDay = $Element('<div>').className('blueDay');
				}else{
					welNewDay = $Element('<div>').className('normDay');
				}

				if(nDatePointer <= aDaysOfMonthes[nCurrentMonth]){
					welNewDay.html(nDatePointer++);
					// this지정 위하여 delegate사용 안함
					$Fn(
							function(e) {
								$ElementList($$('.selectedDay')).className(
										'unselectedDay');
								$Element(this).className('selectedDay');

								alert(getDateString(nCurrentYear,
										nCurrentMonth, $Element(this).html()));
							}, welNewDay).attach(welNewDay, 'click');
				}else{
					welNewDay.html(nTail++).className('grayDay');
				}
				welNewWeek.append(welNewDay);
			}
			welCalendar.append(welNewWeek);
		}
	}

	function setMonthHeader() {
		var welCalendar = $Element(elDivCalendar);
		var welHeader = $Element('<div>').className('header');
		var welYearMonthBox = $Element('<div>').className('yearMonthBox');
		var welYear = $Element('<div>').className('year').html(nCurrentYear);
		var welMonth = $Element('<div>').className('month').html(
				nCurrentMonth + 1);
		welYearMonthBox.append(welYear).append(welMonth);
		var welLeftBtn = $Element('<div>').className('btnLeft').html('<');
		$Element(welLeftBtn).delegate('click', '.btnLeft', function(e) {
			nCurrentMonth = (nCurrentMonth + 11) % 12;
			if(nCurrentMonth == 11)
				nCurrentYear--;
			$Element(elDivCalendar).empty();
			setMonthHeader();
			drawDatebar();
			drawCalendar();
		});
		var welRightBtn = $Element('<div>').className('btnRight').html('>');
		$Element(welRightBtn).delegate('click', '.btnRight', function(e) {
			nCurrentMonth = (nCurrentMonth + 13) % 12;
			if(nCurrentMonth == 0)
				nCurrentYear++;
			$Element(elDivCalendar).empty();
			setMonthHeader();
			drawDatebar();
			drawCalendar();
		});
		welHeader.append(welLeftBtn).append(welYearMonthBox)
				.append(welRightBtn);
		welCalendar.append(welHeader);
	}

	function getDateString(nYear, nMonth, nDay) {
		return nYear + "년 " + (nMonth + 1) + "월 " + nDay + "일";
	}

};