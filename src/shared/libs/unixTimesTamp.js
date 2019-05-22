import moment from "moment"

/**
 * 转换UnixTime
 * params {timeString} Array|String    like "2017/2/3"
 */
export default function transformUnixTimestamp(timeString) {
    if (timeString && typeof (timeString) == "string") {
        return moment(new Date(timeString).getTime()).unix()
    }

    if (timeString && timeString instanceof Array) {
        let times = timeString.map((time, i) => {
            if (time == "") return time;
            return moment(new Date(time).getTime()).unix()
        })
        return times
    }
}