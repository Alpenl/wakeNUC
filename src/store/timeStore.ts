import { defineStore } from 'pinia'

/**
 * 时间项接口定义
 * 用于表示一个时间段的开始和结束时间
 */
interface TimeItem {
  s: string // 开始时间，格式为 "HH:mm"
  e: string // 结束时间，格式为 "HH:mm"
}

/**
 * 课程模型接口定义
 * 包含课程的所有必要信息
 */
export interface CourseModel {
  title: string // 课程标题
  location: string // 课程地点（教室）
  teacherName: string // 授课教师姓名
  dayOfWeek: number // 课程在周几，1-7 分别代表周一到周日
  startPeriods: number // 课程开始的节次，例如：1 表示第一节课
  endPeriods: number // 课程结束的节次，例如：2 表示第二节课
  number: number // 课程节数，连续的课程节数
  weeks: number[] // 课程在学期中的周次，例如：[1,2,3] 表示第1,2,3周有这门课
  color?: string // 课程显示的颜色，可选属性
}

/**
 * 课程颜色主题列表
 * 包含两套配色方案，每套方案包含多个预设颜色
 */
export const colorList = [
  // 主题一：明亮色系
  [
    '#FFDC72', // 明黄色
    '#CE7CF4', // 淡紫色
    '#FF7171', // 粉红色
    '#66CC99', // 青绿色
    '#FF9966', // 橙色
    '#66CCCC', // 青色
    '#6699CC', // 淡蓝色
    '#99CC99', // 淡绿色
    '#669966', // 深绿色
    '#66CCFF', // 天蓝色
    '#99CC66', // 黄绿色
    '#FF9999', // 浅粉色
    '#81CC74', // 草绿色
  ],
  // 主题二：柔和色系
  [
    '#99CCFF', // 淡蓝色
    '#FFCC99', // 杏色
    '#CCCCFF', // 淡紫色
    '#99CCCC', // 灰青色
    '#A1D699', // 淡绿色
    '#7397db', // 钴蓝色
    '#ff9983', // 珊瑚色
    '#87D7EB', // 天蓝色
    '#99CC99', // 青草色
  ],
]

// 用于存储课程标题与颜色的映射关系的 Map
const colorMap = new Map<string, string>()

/**
 * 时间管理相关的 Store
 * 用于管理课程表、作息时间等信息
 */
export const useTimeStore = defineStore('time', {
  // 状态定义
  state: () => ({
    date: new Date(), // 当前日期
    isStart: false, // 是否已开学
    startDate: new Date('2025-02-17'), // 开学日期
    weekNum: 20, // 总教学周数
    currentMonth: new Date().getMonth() + 1, // 当前月份（1-12）
    originalWeekIndex: 0, // 实际教学周次（从开学日期计算）
    currentWeekIndex: 0, // 当前显示的教学周次（可能与实际周次不同）
    weekTitle: ['一', '二', '三', '四', '五', '六', '日'], // 周标题
    currentTimeList: [] as TimeItem[], // 当前使用的作息时间表
    courseList: [] as CourseModel[], // 课程列表
    colorArrayIndex: 0, // 当前使用的颜色主题索引

    // 冬季作息时间表（每节课的开始和结束时间）
    winterTimeList: [
      { s: '08:00', e: '08:45' }, // 第1节
      { s: '08:55', e: '09:40' }, // 第2节
      { s: '10:10', e: '10:55' }, // 第3节
      { s: '11:05', e: '12:50' }, // 第4节
      { s: '14:00', e: '14:45' }, // 第5节
      { s: '14:55', e: '15:40' }, // 第6节
      { s: '16:10', e: '16:55' }, // 第7节
      { s: '17:05', e: '17:50' }, // 第8节
      { s: '19:00', e: '19:45' }, // 第9节
      { s: '19:55', e: '20:40' }, // 第10节
      { s: '21:10', e: '21:55' }, // 第11节
      { s: '22:05', e: '22:50' }, // 第12节
    ] as TimeItem[],

    // 夏季作息时间表
    summerTimeList: [
      { s: '08:00', e: '08:45' }, // 第1节
      { s: '08:55', e: '09:40' }, // 第2节
      { s: '10:10', e: '10:55' }, // 第3节
      { s: '11:05', e: '12:50' }, // 第4节
      { s: '14:30', e: '15:15' }, // 第5节
      { s: '15:25', e: '16:10' }, // 第6节
      { s: '16:40', e: '17:25' }, // 第7节
      { s: '17:35', e: '18:20' }, // 第8节
      { s: '19:30', e: '20:15' }, // 第9节
      { s: '20:15', e: '21:10' }, // 第10节
      { s: '21:40', e: '22:25' }, // 第11节
      { s: '22:35', e: '23:10' }, // 第12节
    ] as TimeItem[],
  }),

  // 计算属性
  getters: {
    // 获取当前显示的教学周次
    getCurrentWeek(): number {
      return this.currentWeekIndex
    },

    // 获取当前使用的作息时间表
    getTimeList(): TimeItem[] {
      return this.currentTimeList
    },

    // 获取当前日期的字符串表示
    getCurrentDateString(): string {
      const today = new Date()
      return `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
    },

    // 获取当前星期的中文表示
    getWeekMessage(): string {
      const today = new Date()
      const weekDay = today.getDay()
      const weekDayMap = ['日', '一', '二', '三', '四', '五', '六']
      return `星期${weekDayMap[weekDay]}`
    },

    // 获取周次信息的文字描述
    getWeekIndexMessage(): string {
      return this.currentWeekIndex === this.originalWeekIndex
        ? this.getWeekMessage
        : `当前为第${this.originalWeekIndex}周`
    },

    // 获取当前周的课程列表
    weekCourseList(): CourseModel[] {
      if (this.courseList)
        return this.courseList.filter((item) => item.weeks.includes(this.currentWeekIndex + 1))
      return []
    },

    // 获取当前周的日期数组（用于显示日期标题）
    currentWeekDayArray(): string[] {
      const weekIndex = this.currentWeekIndex - 1
      const someDate = new Date(this.startDate)
      someDate.setDate(someDate.getDate() + weekIndex * 7)

      const dayArray = []
      dayArray.push(someDate.getMonth() + 1 + '/' + someDate.getDate())

      for (let i = 0; i < 6; i++) {
        someDate.setDate(someDate.getDate() + 1)
        dayArray.push(someDate.getMonth() + 1 + '/' + someDate.getDate())
      }

      return dayArray
    },
  },

  // 操作方法
  actions: {
    /**
     * 根据月份获取对应的作息时间表
     * @param month 月份（1-12）
     * @returns 作息时间表
     */
    getTimeListByMonth(month: number): TimeItem[] {
      return month > 5 && month < 10 ? this.summerTimeList : this.winterTimeList
    },

    /**
     * 初始化时间设置
     * @param startDate 开学日期
     * @returns 当前教学周次
     */
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

    /**
     * 切换显示的教学周
     * @param direction 切换方向：1 表示下一周，-1 表示上一周
     * @returns 是否切换成功
     */
    switchWeek(direction: number): boolean {
      const oldWeekIndex = this.currentWeekIndex
      let newWeekIndex = oldWeekIndex + direction

      // 确保周次在有效范围内
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

    /**
     * 设置课程列表
     * @param newCourseList 新的课程列表
     */
    setCourseList(newCourseList: CourseModel[]) {
      this.courseList = newCourseList.sort(
        (a, b) => a.dayOfWeek - b.dayOfWeek || a.startPeriods - b.startPeriods,
      )
      this.resetCourseBgColor()
    },

    /**
     * 添加新课程
     * @param course 要添加的课程
     */
    addCourse(course: CourseModel) {
      this.courseList.push(course)
      this.courseList.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startPeriods - b.startPeriods)
      this.resetCourseBgColor()
    },

    /**
     * 删除指定课程
     * @param courseTitle 要删除的课程标题
     */
    deleteCourse(courseTitle: string) {
      this.courseList = this.courseList.filter((course) => course.title !== courseTitle)
      colorMap.delete(courseTitle)
    },

    /**
     * 更新课程信息
     * @param oldTitle 原课程标题
     * @param newCourse 新的课程信息
     */
    updateCourse(oldTitle: string, newCourse: CourseModel) {
      const index = this.courseList.findIndex((course) => course.title === oldTitle)
      if (index !== -1) {
        if (oldTitle !== newCourse.title) {
          colorMap.delete(oldTitle)
        }
        this.courseList[index] = newCourse
        // 重新排序并更新颜色
        this.courseList.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startPeriods - b.startPeriods)
        this.resetCourseBgColor()
      }
    },

    /**
     * 重置所有课程的背景颜色
     */
    resetCourseBgColor() {
      colorMap.clear()
      if (this.courseList) {
        this.courseList.forEach((courseItem) => {
          courseItem.color = this.getCourseColor(courseItem)
        })
      }
    },

    /**
     * 获取课程的显示颜色
     * @param courseItem 课程信息
     * @returns 颜色代码
     */
    getCourseColor(courseItem: CourseModel): string {
      const colorArray = colorList[this.colorArrayIndex]
      const { title } = courseItem
      if (!colorMap.has(title)) {
        colorMap.set(title, colorArray[colorMap.size % colorArray.length])
      }
      return colorMap.get(title) || '#ffffff'
    },

    /**
     * 切换颜色主题
     */
    switchColorTheme() {
      this.colorArrayIndex = (this.colorArrayIndex + 1) % colorList.length
      this.resetCourseBgColor()
    },
  },

  // 持久化配置
  persist: {
    // 指定持久化的key
    key: 'timeStore',

    // 指定需要持久化的状态
    paths: [
      'startDate', // 开学日期
      'weekNum', // 总教学周数
      'courseList', // 课程列表
      'colorArrayIndex', // 颜色主题索引
    ],
  },
})
