export class DayMood {
  constructor(day, mood, reason) {
    this.day = day;
    this.mood = mood;
    this.reason = reason;
  }

  getDay() {
    return this.day;
  }
  getMood() {
    return this.mood;
  }
  getReason() {
    return this.reason;
  }
  setDay(day) {
    this.day = day;
  }
  setMood(mood) {
    this.mood = mood;
  }
  setReason(reason) {
    this.reason = reason;
  }
}
