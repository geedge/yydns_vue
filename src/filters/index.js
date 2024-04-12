import Moment from 'moment'

// 定义时间戳 -> 日期
export function formatDate(value) {
    if (!value || value === undefined) return '--'
    return Moment(value).format('YYYY-MM-DD')
}

// 定义时间戳 -> 时间
export function formatTime(value) {
    if (!value || value === undefined) return '--'
    return Moment(value).format('YYYY-MM-DD HH:mm:ss')
}