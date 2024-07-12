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



function formatDate(year, month, day) {
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');

    const date = new Date(year, month, day);

    //'YYYY-MM-DD'
    const formattedDate = `${date.getFullYear()}-${formattedMonth}-${formattedDay}`;

    return formattedDate;
}


module.exports = {getLastWeekdaysSince, formatDate}