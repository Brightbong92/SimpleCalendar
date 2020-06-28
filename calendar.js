//$(document).ready(function () {
    $(() => {
        tableInitialize();

        $.datepicker.setDefaults($.datepicker.regional['ko']); 
        $( "#startDate" ).datepicker({
             showOn: "both",
             buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif",
             buttonImageOnly: true,
             buttonText: "선택",
             changeMonth: true, 
             changeYear: true,
             nextText: '>>',
             prevText: '<<', 
             dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
             dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], 
             monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
             monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
             dateFormat: "yy-m-d",
        });
        $( "#endDate" ).datepicker({
             showOn: "both",
             buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif",
             buttonImageOnly: true,
             buttonText: "선택",
             changeMonth: true, 
             changeYear: true,
             nextText: '>>',
             prevText: '<<', 
             dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
             dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], 
             monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
             monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
             dateFormat: "yy-m-d", 
        });

    });
    

    //function tableInitialize() {
    const tableInitialize = () => {
        let calendarTbody = "";
        let reserveTbody = "";
            for(let i = 1; i<=5; i++) {
                calendarTbody += "<tr>";
                for(let j = 1; j<=7; j++) {
                    calendarTbody += "<td></td>";
                }
                calendarTbody += "</tr>";
            }
        
            for(let i = 1; i<=7; i++) {
                reserveTbody += "<tr>";
                for(let j = 1; j<=3; j++) {
                    reserveTbody += "<td></td>";
                }
                reserveTbody += "</tr>";
            }

            $('#calendar-tbody').append(calendarTbody);
            $('#reserve-tbody').append(reserveTbody);
    }

    
    const hourMinuteSecond = 24 * 60 * 60 * 1000;
    let reserveArray = new Array();
    

    const checkValidation = () => {
        if($('#startDate').val() === "" || $('#endDate').val() === "") {
            alert("날짜가 비어져 있습니다.");
            return false;
        }
    }

    const showCalendar = () => {
        deleteReserveList();
        
        if($('#startDate').val() === "" || $('#endDate').val() === "") {
            alert("날짜를 선택해주세요.");
            return false;
        }
        
        let $startDate = new Date($('#startDate').val());
        let $endDate = new Date($('#endDate').val());
    
        let differenceDay = parseInt(( $endDate - $startDate ) / hourMinuteSecond);
        let differenceMonth = parseInt(( $endDate - $startDate ) / (hourMinuteSecond * 30));
        let differenceYear = parseInt(( $endDate - $startDate ) / (hourMinuteSecond * 30 * 12));

        if(validateDate(differenceYear, differenceMonth, differenceDay) === 0) return false;

        let startYear = $startDate.getFullYear();
        let startMonth = $startDate.getMonth();
        let startDay = $startDate.getDate();
        let endYear = $endDate.getFullYear();
        let endMonth = $endDate.getMonth();
        let endDay = $endDate.getDate();
    
        let checkedDate = new Object();
        checkedDate.startYear = startYear;
        checkedDate.startMonth = startMonth;
        checkedDate.startDay = startDay;
        checkedDate.endYear = endYear;
        checkedDate.endMonth = endMonth;
        checkedDate.endDay = endDay;

        checkedDate.endDay = endDayCheckAndReturn(checkedDate);
        let makedDate = new Object();
        makedDate.startYear = startYear;
        makedDate.startMonth = startMonth;
        makedDate.startDay = startDay;
        makedDate.endDay = checkedDate.endDay;
        clearCalendar();
        makeCalendar(makedDate);
        changeYearMonth(startYear, changeMonthNumberString(startMonth+1), startMonth+1);
    
        $('input[type=hidden][name=calendar-active]').val("true");
        $('#startDate').val((startYear) + "-" + ((startMonth)+1) + "-" + (startDay));
        $('#endDate').val((endYear) + "-" + ((endMonth)+1) + "-" + (endDay));
        cleanSelectedDate();
    }

    const endDayCheckAndReturn = (checkedDate) => {
        let endDay = 0;
        let endDayList = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
        if(checkedDate.startYear === checkedDate.endYear) {
            if(checkedDate.startMonth === checkedDate.endMonth) {
                endDay = checkedDate.endDay;
                return endDay;
            }else {
                endDay = endDayList[checkedDate.startMonth];
                return endDay;
            }

        }else if(checkedDate.startYear < checkedDate.endYear) {
                if(checkedDate.startYear % 4 == 0 && checkedDate.startYear % 100 !=0 || checkedDate.startYear % 400 == 0) {
                    endDayList[1] = 29;
                }
                endDay = endDayList[checkedDate.startMonth];
                return endDay;
        }

        console.log("endDay two: " + endDay);
        return checkedDate.endDay;
    }

    const makeCalendar = (makedDate) => {
        let theDate = new Date(makedDate.startYear, makedDate.startMonth, makedDate.startDay);
        let dayOfTheWeek = theDate.getDay();
        let lastDay = makedDate.endDay;
        //let row = Math.ceil((dayOfTheWeek+lastDay)/7);
        let dayNumber = makedDate.startDay;
        let strTbodyInTrTd = "";
        /*
        for(let i = 1; i <= row; i++) {
            strTbodyInTrTd += "<tr>";
            for(let j = 1; j <= 7; j++) {
                 if(i === 1 && j <= dayOfTheWeek || dayNumber > lastDay) {
                     strTbodyInTrTd += "<td>&nbsp;</td>";
                 }
                 else {
                     strTbodyInTrTd += "<td class='selectTd' onClick=selectDate(this)>"+dayNumber+"</td>";
                     dayNumber++;
                 }
            }
            strTbodyInTrTd += "</tr>";
        }
        */
        for(let i = 0; i < 6; i++) {
            strTbodyInTrTd += "<tr>";
            for(let j = 0; j < 7; j++) {
                if((i === 0 && j < dayOfTheWeek || dayNumber > lastDay)) {
                    strTbodyInTrTd += "<td>&nbsp;</td>";
                }else {
                    strTbodyInTrTd += "<td class='selectTd' onClick=selectDate(this)>"+dayNumber+"</td>";
                    dayNumber++;
                }
            }
            strTbodyInTrTd += "</tr>";
        }

        document.getElementById("calendar-tbody").innerHTML = strTbodyInTrTd;
    }

    const prev = () => {
        let $startDate = new Date($('#startDate').val());
        let $endDate = new Date($('#endDate').val());
        let calendarActive = $('input[type=hidden][name=calendar-active]').val();

        if(!validatePaging($startDate, calendarActive)) return false;
        let differenceDay = parseInt(( $endDate - $startDate ) / hourMinuteSecond);
        let differenceMonth = parseInt(( $endDate - $startDate ) / (hourMinuteSecond * 30));
        let differenceYear = parseInt(( $endDate - $startDate ) / (hourMinuteSecond * 30 * 12));
        /*
        if(validateDate(differenceYear, differenceMonth, differenceDay) == -1) {
            alert("지정한 기간까지 입니다.");
            return false;
        }
        */
        let prevYear = $startDate.getFullYear();
        let prevMonth = $startDate.getMonth()
        let prevDay = 1;

        if(prevMonth === 0) {
            prevMonth = 12;
            prevYear--;
        }
        $('#startDate').val((prevYear) + "-" + (prevMonth) + "-" + prevDay);

        let endYear = $endDate.getFullYear();
        let endMonth = $endDate.getMonth();
        let endDay = $endDate.getDate();

        let checkedDate = new Object();
        checkedDate.startYear = prevYear;
        checkedDate.startMonth = prevMonth-1;
        checkedDate.startDay = prevDay;
        checkedDate.endYear = endYear;
        checkedDate.endMonth = endMonth;
        checkedDate.endDay = endDay;
        checkedDate.endDay = endDayCheckAndReturn(checkedDate);

        let makedDate = new Object();
        makedDate.startYear = prevYear;
        makedDate.startMonth = prevMonth-1; // new Date 에서 month 는 0 부터 시작하기 때문에 nextMonth -1  ex) 7-1 = 6(7월)
        makedDate.startDay = prevDay;
        makedDate.endDay = checkedDate.endDay;

        clearCalendar();
        makeCalendar(makedDate);
        changeYearMonth(prevYear, changeMonthNumberString(prevMonth), prevMonth);
    }

    const next = () => {
        let $startDate = new Date($('#startDate').val());
        let $endDate = new Date($('#endDate').val());
        let calendarActive = $('input[type=hidden][name=calendar-active]').val();

        if(!validatePaging($startDate, calendarActive)) return false; 

        let differenceDay = parseInt(( $endDate - $startDate ) / hourMinuteSecond);
        let differenceMonth = parseInt(( $endDate - $startDate ) / (hourMinuteSecond * 30));
        let differenceYear = parseInt(( $endDate - $startDate ) / (hourMinuteSecond * 30 * 12));

        if(validateDate(differenceYear, differenceMonth, differenceDay) == -1) {
            alert("지정한 기간까지 입니다.");
            return false;
        }

        let nextYear = $startDate.getFullYear();
        let nextMonth = $startDate.getMonth()+2;//다음 월
        let nextDay = 1;

        console.log("nextMonth:"+nextMonth);
        if(nextMonth === 13) { //12월에서 다음 눌렀을 경우
            nextYear++;
            nextMonth = 1;
        }
        $('#startDate').val((nextYear) + "-" + ((nextMonth)) + "-" + nextDay);

        let endYear = $endDate.getFullYear();
        let endMonth = $endDate.getMonth();
        let endDay = $endDate.getDate();

        let checkedDate = new Object();
        checkedDate.startYear = nextYear;
        checkedDate.startMonth = nextMonth-1;
        checkedDate.startDay = nextDay;
        checkedDate.endYear = endYear;
        checkedDate.endMonth = endMonth;
        checkedDate.endDay = endDay;
        checkedDate.endDay = endDayCheckAndReturn(checkedDate);

        let makedDate = new Object();
        makedDate.startYear = nextYear;
        makedDate.startMonth = nextMonth-1; // new Date 에서 month 는 0 부터 시작하기 때문에 nextMonth -1  ex) 7-1 = 6(7월)
        makedDate.startDay = nextDay;
        makedDate.endDay = checkedDate.endDay;

        clearCalendar();
        makeCalendar(makedDate);
        changeYearMonth(nextYear, changeMonthNumberString(nextMonth), nextMonth);
    }
    
    const selectDate = (object) => {
        let date = $(object).text();
        let year = $("#year").val();
        let month = $("#month").val();
        $('td').removeClass('selectTdActive');
        $(object).addClass("selectTdActive");
        makeSelectedDate(year, month, date);
    }
    
    const makeSelectedDate = (year, month, date) => {
        let choiceDate = new Date(year, month-1, date);
        let selectedYear = choiceDate.getFullYear();
        let selectedMonth = choiceDate.getMonth();
        let selectedDate = choiceDate.getDate();
        let selectedDay = choiceDate.getDay();
    
        let dayOfTheWeek = convertDayOfTheWeekString(selectedDay);
    
        $('#selected-Day').text(dayOfTheWeek);
        $('#selected-Year').text(selectedYear);
        $('#selected-Month').text(selectedMonth+1);
        $('#selected-Date').text(selectedDate);
    }
    
    const convertDayOfTheWeekString = (dayOfTheWeek) => {
            switch (dayOfTheWeek) {
                case 0: return "일요일";
                case 1: return "월요일";
                case 2: return "화요일";
                case 3: return "수요일";
                case 4: return "목요일";
                case 5: return "금요일";
                case 6: return "토요일";
            }
    }
    
    const getHoliday = (year, month, date)  => {
        let holiday = new Array();
        $.ajax({
            url:'https://api.manana.kr/calendar/' + year + '/' + month + '/' + date + '.json',
            type:"GET",
            async: false,
            success: function(data) {
                if(data.length != 0) {
                    if(data[0].category == "holiday") {
                        holiday[0] = "holiday";
                        holiday[1] = data[0].name;
                    }else {
                        holiday[0] = "notHoliday";
                        holiday[1] = data[0].name;
                    }
                }else {
                    holiday[0] = "false";
                }
            }
        });
        return holiday;
    }
    
    const showReservation = () => {
        let day = $('#selected-Day').text();
        let year = $('#selected-Year').text();
        let month = $('#selected-Month').text();
        let date = $('#selected-Date').text();
    
        let data = new Object();
    
        data.date = year + "-" + month + "-" + date;
        data.dayOfTheWeek = day;
    
        let holiday = getHoliday(year, month, date);
        if(holiday[0] == "holiday") {
            data.holiday = "예" + "(" + holiday[1] + ")";
        }else if(holiday[0] == "notHoliday"){
            data.holiday = "아니요" + "(" + holiday[1] + ")";
        }else {
            data.holiday = "아니요";
        }
    
        reserveArray.push(data);
    
        clearReservation();
    
        let reservationString = "";
        for(let value of reserveArray) {
            let reservationStringTemp = "<tr>";
                reservationStringTemp += "<td style='text-align:center;'>"+value.date+"</td>";
            if(value.dayOfTheWeek == "일요일") {
                reservationStringTemp += "<td style='color:red; text-align:center;'>"+value.dayOfTheWeek+"</td>";
                reservationStringTemp += "<td style='color:red; text-align:center;'>"+value.holiday+"</td>";
            }else if(value.dayOfTheWeek == "토요일") {
                reservationStringTemp += "<td style='color:blue; text-align:center;'>"+value.dayOfTheWeek+"</td>";
                reservationStringTemp += "<td style='color:blue; text-align:center;'>"+value.holiday+"</td>";
            }else {
                reservationStringTemp += "<td style='text-align:center;'>"+value.dayOfTheWeek+"</td>";
                reservationStringTemp += "<td style='text-align:center;'>"+value.holiday+"</td>";
            } 
            reservationStringTemp += "</tr>";
            reservationString += reservationStringTemp;
        }
    
        document.getElementById('reserve-tbody').innerHTML = reservationString;
    }
    
    const cleanSelectedDate = () => {
        $('#selected-Day').text("요일");
        $('#selected-Year').text("");
        $('#selected-Month').text("");
        $('#selected-Date').text("");
    }
    
    const validateDate = (differenceYear, differenceMonth, differenceDay) => {        
        if(differenceDay < 0) {
            alert("시작날짜의 값이 더 큼니다.");
            $('#startDate').val("");
            $('#endDate').val("");
            return 0;
        }else if(differenceYear === 0 && differenceMonth === 0) {
            return -1;
        }else if(differenceYear === 0 && differenceMonth > 0 && differenceDay != 0) {
            return 1;
        }
    }

    const changeMonthNumberString = (monthTemp) => {
        switch (monthTemp) {
            case 1: return "January";
            case 2: return "Febuary";
            case 3: return "March";
            case 4: return "April";
            case 5: return "May";
            case 6: return "June";
            case 7: return "July";
            case 8: return "August";
            case 9: return "September";
            case 10: return "October";
            case 11: return "November";
            case 12: return "December";
            default : return "";
        }
    }

    const clearCalendar = () => {
        document.getElementById("calendar-tbody").innerHTML = "";
    }

    const clearReservation = () => {
        document.getElementById('reserve-tbody').innerHTML = "";
    }

    const changeYearMonth = (startYear, monthName, nowMonth) => {
        $("#year").val(startYear);
        $("#month").val(nowMonth);
        $("#year").text(startYear+"년");
        $("#month").text(monthName);
    }

    const validatePaging = ($startDate, calendarActive) => {
        if($startDate == "" || calendarActive == "false") {
            alert("조회 후 확인해주세요.");
            return false;
        }else {
            return true;
        }
    }

    const deleteReserveList = () => {
        reserveArray.length = 0;
        clearReservation();
    }