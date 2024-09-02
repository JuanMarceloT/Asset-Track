function getLastWeekdaysSince(month, year) {
    let startDate = new Date(year, month - 1);
    let currentDate = new Date();
    let result = [];

    while (startDate <= currentDate) {
        let lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

        while (lastDay.getDay() === 0 || lastDay.getDay() === 6) {
            lastDay.setDate(lastDay.getDate() - 1);
        }
        if (lastDay < currentDate) {
            result.push(new Date(lastDay));
        } else {
            result.push(currentDate);
        }

        startDate.setMonth(startDate.getMonth() + 1);
    }

    return result;
}

function date_to_yyyy_mm_dd(date){
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`
}

function formatDate(year, month, day) {
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');

    const date = new Date(year, month, day);

    //'YYYY-MM-DD'
    const formattedDate = `${date.getFullYear()}-${formattedMonth}-${formattedDay}`;

    return formattedDate;
}


function compare_string_yyyy_mm_dd_dates(date1, date2) {
    const parsedDate1 = new Date(date1);
    const parsedDate2 = new Date(date2);

    if (parsedDate2 > parsedDate1) {
        return false;
    }

    return true;
}
module.exports = {getLastWeekdaysSince, formatDate, compare_string_yyyy_mm_dd_dates, date_to_yyyy_mm_dd}