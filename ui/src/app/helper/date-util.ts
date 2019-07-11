export class DateUtil {
    // adds a leading zero if appropriate
    static formatDateNumber(num: number) {
        let result = "0" + num;
        if(result.length === 2) return result;
        return result.substring(1);
    }
    static dateToInputString(date: Date) {
        return date.getFullYear() + "-" + 
        DateUtil.formatDateNumber(date.getMonth() + 1) + "-" +
        DateUtil.formatDateNumber(date.getDate()) + "T" +
        DateUtil.formatDateNumber(date.getHours()) + ":" + 
        DateUtil.formatDateNumber(date.getMinutes()) + ":" + 
        DateUtil.formatDateNumber(date.getSeconds());
    }
}