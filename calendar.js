$(document).ready(function () {
    tableInitilize();
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

function tableInitilize() {
    let calendarTbody = "";
    let reserveTbody = "";
    for(var i = 1; i<=5; i++) {
        calendarTbody += "<tr>";
        for(var j = 1; j<=7; j++) {
            calendarTbody += "<td></td>";
        }
        calendarTbody += "</tr>";
    }

    for(var i = 1; i<=7; i++) {
        reserveTbody += "<tr>";
        for(var j = 1; j<=3; j++) {
            reserveTbody += "<td></td>";
        }
        reserveTbody += "</tr>";
    }

    $('#calendar-tbody').append(calendarTbody);
    $('#reserve-tbody').append(reserveTbody);

}
const hourMinuteSecond = 24 * 60 * 60 * 1000;
let reserveArray = new Array();

function showCalendar() {
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

    if(validateDate(differenceDay, differenceMonth, differenceYear) == 0) return false;


    console.log("diffday"+differenceDay);
    console.log("diffmonth"+differenceMonth);
    console.log("diffyear"+differenceYear);

    let startYear = $startDate.getFullYear();
    let startMonth = $startDate.getMonth();
    let startDay = $startDate.getDate();
    let endYear = $endDate.getFullYear();
    let endMonth = $endDate.getMonth();
    let endDay = $endDate.getDate();

    clearCalendar();
    makeCalendar(startYear, startMonth, startDay, endDay, differenceYear, differenceMonth, differenceDay);
    changeYearMonth(startYear, changeMonthNumberString(startMonth+1), startMonth+1);


    $('input[type=hidden][name=calendar-active]').val("true");
    $('#startDate').val((startYear) + "-" + ((startMonth)+1) + "-" + (startDay));
    $('#endDate').val((endYear) + "-" + ((endMonth)+1) + "-" + (endDay));

    cleanSelectedDate();
}

function prev() {
    let calendarActive = $('input[type=hidden][name=calendar-active]').val();
    let $startDate = $('#startDate').val();

    if(!validatePaging($startDate, calendarActive)) return false;

    let prevDate = new Date($startDate);
    let prevYear = prevDate.getFullYear();
    let prevMonth = prevDate.getMonth()
    let prevDay = 1;

    if(prevMonth == 0) {
        prevMonth = 12;
        prevYear--;
    }

    clearCalendar();
    makeCalendar(prevYear, prevMonth-1, prevDay, -1, -1, -1, -1);
    $('#startDate').val((prevYear) + "-" + (prevMonth) + "-" + prevDay);
    changeYearMonth(prevYear, changeMonthNumberString(prevMonth), prevMonth);

    cleanSelectedDate();
}

function next() {
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
    }else {
        let nextYear = $startDate.getFullYear();
        let nextMonth = $startDate.getMonth();
        let nextDay = 1;

        clearCalendar();

        if(nextMonth == 11) {
            nextMonth = 0;
            nextYear++;

            $('#startDate').val((nextYear) + "-" + ((nextMonth)+1) + "-" + nextDay);
            makeCalendar(nextYear, nextMonth, nextDay, $endDate.getDate(), -1, -1, -1);
            changeYearMonth(nextYear, changeMonthNumberString(nextMonth+1), (nextMonth+1));
            cleanSelectedDate();
        }else {
            $('#startDate').val((nextYear) + "-" + ((nextMonth)+2) + "-" + nextDay);

            let nowDate = new Date($('#startDate').val());

            let nowYear = nowDate.getFullYear();
            let nowMonth = nowDate.getMonth()+1;

            let endYear = $endDate.getFullYear();
            let endMonth = $endDate.getMonth()+1;
            let endDay = $endDate.getDate();

            if(nowYear == endYear && nowMonth == endMonth) {
                makeCalendar(nextYear, nextMonth+1, nextDay, endDay, 0, 0, -1, true);
                changeYearMonth(nextYear, changeMonthNumberString(nextMonth+2), (nextMonth+2));
                cleanSelectedDate();
            }else {
                makeCalendar(nextYear, nextMonth+1, nextDay, $endDate.getDate(), -1, -1, -1, false);
                changeYearMonth(nextYear, changeMonthNumberString(nextMonth+2), (nextMonth+2));
                cleanSelectedDate();
            }
        }   
    }
}


function selectDate(object) {
    let date = $(object).text();
    let year = $("#year").val();
    let month = $("#month").val();
    $('td').removeClass('selectTdActive');
    $(object).addClass("selectTdActive");
    makeSelectedDate(year, month, date);
}

function makeSelectedDate(year, month, date) {
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

function convertDayOfTheWeekString(dayOfTheWeek) {
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

function getHoliday (year, month, date) {
    let holiday = new Array();
    $.ajax({
        url:'https://api.manana.kr/calendar/' + year + '/' + month + '/' + date + '.json',
        type:"GET",
        async: false,
        success: function(data) {
            console.log(data);
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

function reservation() {
    let day = $('#selected-Day').text();
    let year = $('#selected-Year').text();
    let month = $('#selected-Month').text();
    let date = $('#selected-Date').text();

    let data = new Object();

    data.date = year + "-" + month + "-" + date;
    data.dayOfTheWeek = day;

    let holiday = getHoliday(year, month, date);
    console.log("functionHoliday: "+ holiday);
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

function cleanSelectedDate() {
    $('#selected-Day').text("요일");
    $('#selected-Year').text("");
    $('#selected-Month').text("");
    $('#selected-Date').text("");
}

let validateDate = function(differenceYear, differenceMonth, differenceDay) {
    if(differenceDay < 0) {
        alert("시작날짜의 값이 더 큼니다.");
        $('#startDate').val("");
        $('#endDate').val("");
        return 0;
    }else if(differenceYear == 0 && differenceMonth == 0) {
        return -1;
    }else if(differenceYear == 0 && differenceMonth > 0 && differenceDay != 0) {
        return 1;
    }
}


let makeCalendar = function (startYear, startMonth, startDay, endDay, differenceYear, differenceMonth, differenceDay, endFlag) {
   let theDate = new Date(startYear, startMonth, startDay);
   let dayOfTheWeek = theDate.getDay();
   let lastDay = 0;
   let last = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
   
   if(differenceYear === 0 && differenceMonth === 0 && differenceDay === 0) {
        lastDay = endDay;
   }else if(differenceYear === 0 && differenceMonth === 0){
        console.log("#endDay"+endDay);
        if(endFlag == false) {
            if(differenceYear === 0 && differenceMonth === 0 && differenceDay <=29 ) {
                lastDay = last[startMonth];
            }
        }else {
            lastDay = endDay;
        }
   }else {
        if(startYear % 4 == 0 && startYear % 100 !=0 || startYear % 400 == 0) {
            last[1] = 29;
        }
        lastDay = last[startMonth];
   }

   let row = Math.ceil((dayOfTheWeek+lastDay)/7);

   let dayNumber = startDay;
   let strTbodyInTrTd = "";

   for(let i = 1; i <= row; i++) {
       strTbodyInTrTd += "<tr>";
       for(let j = 1; j <= 7; j++) {
            if(i == 1 && j <= dayOfTheWeek || dayNumber > lastDay) {
                strTbodyInTrTd += "<td>&nbsp;</td>";
            }
            else {
                strTbodyInTrTd += "<td class='selectTd' onClick=selectDate(this)>"+dayNumber+"</td>";
                dayNumber++;
            }
       }
       strTbodyInTrTd += "</tr>";
   }
   document.getElementById("calendar-tbody").innerHTML = strTbodyInTrTd;
}

    function changeMonthNumberString(monthTemp) {
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

    function clearCalendar() {
        document.getElementById("calendar-tbody").innerHTML = "";
    }

    function clearReservation() {
        document.getElementById('reserve-tbody').innerHTML = "";
    }

    function changeYearMonth(startYear, monthName, nowMonth) {
        $("#year").val(startYear);
        $("#month").val(nowMonth);
        $("#year").text(startYear+"년");
        $("#month").text(monthName);
    }

    function validatePaging($startDate, calendarActive) {
        if($startDate == "" || calendarActive == "false") {
            alert("조회 후 확인해주세요.");
            return false;
        }else {
            return true;
        }
    }

    function deleteReserveList() {
        reserveArray.length = 0;
        clearReservation();
    }