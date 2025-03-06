import { defineStore } from 'pinia'

interface TimeItem {
  s: string
  e: string
}

// 定义时间管理相关的 store
export const useTimeStore = defineStore('time', {
  // 定义状态
  state: () => ({
    date: new Date(), // 当前日期
    isStart: false, // 是否已开学
    startDate: new Date('2025-02-17'), // 开学日期（暂时写死）
    weekNum: 20, // 总周数
    currentMonth: new Date().getMonth() + 1, // 当前月份
    originalWeekIndex: 0, // 原始周次（从开学日期计算）
    currentWeekIndex: 0, // 当前显示的周次
    weekTitle: ['一', '二', '三', '四', '五', '六', '日'], // 周标题
    currentTimeList: [] as TimeItem[], // 当前使用的作息时间表
    // 冬季作息时间
    winterTimeList: [
      { s: '08:00', e: '08:45' },
      { s: '08:55', e: '09:40' }, // 第1-2节
      { s: '10:10', e: '10:55' },
      { s: '11:05', e: '12:50' }, // 第3-4节
      { s: '14:00', e: '14:45' },
      { s: '14:55', e: '15:40' }, // 第5-6节
      { s: '16:10', e: '16:55' },
      { s: '17:05', e: '17:50' }, // 第7-8节
      { s: '19:00', e: '19:45' },
      { s: '19:55', e: '20:40' }, // 第9-10节
      { s: '21:10', e: '21:55' },
      { s: '22:05', e: '22:50' }, // 第11-12节
    ] as TimeItem[],
    // 夏季作息时间
    summerTimeList: [
      { s: '08:00', e: '08:45' },
      { s: '08:55', e: '09:40' }, // 第1-2节
      { s: '10:10', e: '10:55' },
      { s: '11:05', e: '12:50' }, // 第3-4节
      { s: '14:30', e: '15:15' },
      { s: '15:25', e: '16:10' }, // 第5-6节
      { s: '16:40', e: '17:25' },
      { s: '17:35', e: '18:20' }, // 第7-8节
      { s: '19:30', e: '20:15' },
      { s: '20:15', e: '21:10' }, // 第9-10节
      { s: '21:40', e: '22:25' },
      { s: '22:35', e: '23:10' }, // 第11-12节
    ] as TimeItem[],
  }),

  // 定义 getters
  getters: {
    // 获取当前周次
    getCurrentWeek(): number {
      return this.currentWeekIndex
    },
    // 获取作息时间表
    getTimeList(): TimeItem[] {
      return this.currentTimeList
    },
    // 获取当前日期字符串
    getCurrentDateString(): string {
      const today = new Date()
      return `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
    },
    // 获取星期信息
    getWeekMessage(): string {
      const today = new Date()
      const weekDay = today.getDay()
      const weekDayMap = ['日', '一', '二', '三', '四', '五', '六']
      return `星期${weekDayMap[weekDay]}`
    },
    // 获取周次信息
    getWeekIndexMessage(): string {
      return this.currentWeekIndex === this.originalWeekIndex
        ? this.getWeekMessage
        : `当前为第${this.originalWeekIndex}周`
    },
  },

  // 定义 actions
  actions: {
    // 根据月份获取对应的作息时间表
    getTimeListByMonth(month: number): TimeItem[] {
      return month > 5 && month < 10 ? this.summerTimeList : this.winterTimeList
    },

    // 初始化时间设置
    initialize(startDate: string | Date) {
      this.startDate = new Date(startDate)
      const now = new Date()
      this.date = now

      // 计算从开学到现在的天数
      const days = now.getTime() - this.startDate.getTime()
      this.isStart = days > 0

      // 计算当前教学周（向上取整，最小为0）
      const weekIndex = Math.max(0, Math.floor(days / (1000 * 60 * 60 * 24 * 7)) + 1)
      this.originalWeekIndex = weekIndex
      this.currentWeekIndex = weekIndex

      // 更新当前月份和对应的作息时间表
      const currentDate = new Date(this.startDate)
      currentDate.setDate(currentDate.getDate() + weekIndex * 7)
      this.currentMonth = currentDate.getMonth() + 1
      this.currentTimeList = this.getTimeListByMonth(this.currentMonth)

      return weekIndex
    },

    // 获取当前周的日期数组
    getCurrentWeekDayArray(): string[] {
      const weekIndex = this.currentWeekIndex - 1
      const someDate = new Date(this.startDate)
      // 设置到当前周的周一
      someDate.setDate(someDate.getDate() + weekIndex * 7)

      const dayArray = []
      // 添加周一的日期
      dayArray.push(someDate.getMonth() + 1 + '/' + someDate.getDate())

      // 依次添加周二到周日的日期
      for (let i = 0; i < 6; i++) {
        someDate.setDate(someDate.getDate() + 1)
        dayArray.push(someDate.getMonth() + 1 + '/' + someDate.getDate())
      }

      return dayArray
    },

    // 切换周次
    switchWeek(direction: number): boolean {
      const oldWeekIndex = this.currentWeekIndex
      let newWeekIndex = oldWeekIndex + direction

      if (newWeekIndex < 1) newWeekIndex = 1
      if (newWeekIndex > this.weekNum) {
        newWeekIndex = this.weekNum
      }

      if (newWeekIndex !== oldWeekIndex) {
        this.currentWeekIndex = newWeekIndex
        // 更新当前月份和时间表
        const currentDate = new Date(this.startDate)
        currentDate.setDate(currentDate.getDate() + (newWeekIndex - 1) * 7)
        this.currentMonth = currentDate.getMonth() + 1
        this.currentTimeList = this.getTimeListByMonth(this.currentMonth)
        return true
      }

      return false
    },
  },
})
