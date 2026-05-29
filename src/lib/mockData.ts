export const burnoutScore = 42;

export const stressTrend = [
  { day: "Mon", stress: 32, focus: 70 },
  { day: "Tue", stress: 41, focus: 65 },
  { day: "Wed", stress: 55, focus: 52 },
  { day: "Thu", stress: 48, focus: 60 },
  { day: "Fri", stress: 38, focus: 72 },
  { day: "Sat", stress: 22, focus: 80 },
  { day: "Sun", stress: 28, focus: 78 },
];

export const sleepData = [
  { day: "Mon", hours: 6.2 },
  { day: "Tue", hours: 5.4 },
  { day: "Wed", hours: 7.1 },
  { day: "Thu", hours: 6.8 },
  { day: "Fri", hours: 5.9 },
  { day: "Sat", hours: 8.4 },
  { day: "Sun", hours: 7.6 },
];

export const radarData = [
  { axis: "Sleep", value: 72 },
  { axis: "Focus", value: 65 },
  { axis: "Mood", value: 78 },
  { axis: "Energy", value: 58 },
  { axis: "Social", value: 82 },
  { axis: "Activity", value: 45 },
];

export const habitMix = [
  { name: "Study", value: 38 },
  { name: "Sleep", value: 26 },
  { name: "Social", value: 14 },
  { name: "Activity", value: 12 },
  { name: "Screen", value: 10 },
];

export const insights = [
  {
    title: "Late-night screen time spiking",
    body: "Your screen use after 11pm rose 38% this week — directly correlated with lower next-day focus.",
    tag: "Trigger",
  },
  {
    title: "Weekend recovery is working",
    body: "Sleep consistency improved by 22% on weekends. Try anchoring weekday wake times to keep momentum.",
    tag: "Strength",
  },
  {
    title: "Workload feels heavier than it is",
    body: "Reported stress is 1.4× the modeled workload — consider a 10-min reset between deep-work blocks.",
    tag: "Pattern",
  },
];

export const recommendations = [
  { title: "10-min walk after lunch", impact: "+12% afternoon focus" },
  { title: "Phone-free wind-down (30m)", impact: "+38 min sleep" },
  { title: "Two deep-work blocks", impact: "−15% perceived stress" },
  { title: "Hydrate 2L/day", impact: "+8% mood" },
];

export const history = [
  { date: "Today", score: 42, status: "Medium", note: "Heavy screen time" },
  { date: "Yesterday", score: 38, status: "Medium", note: "Decent sleep" },
  { date: "2 days ago", score: 28, status: "Low", note: "Recovery day" },
  { date: "3 days ago", score: 55, status: "High", note: "Two assignments due" },
  { date: "4 days ago", score: 47, status: "Medium", note: "Skipped breakfast" },
  { date: "5 days ago", score: 31, status: "Low", note: "Good routine" },
  { date: "6 days ago", score: 26, status: "Low", note: "Workout + 8h sleep" },
];

export const recoveryPlan = [
  { day: "Mon", task: "Sleep before 11:30pm", done: true },
  { day: "Tue", task: "20-min outdoor walk", done: true },
  { day: "Wed", task: "Phone away after 10pm", done: false },
  { day: "Thu", task: "Journal 5 minutes", done: false },
  { day: "Fri", task: "Coffee before noon only", done: false },
  { day: "Sat", task: "Social activity (in-person)", done: false },
  { day: "Sun", task: "Plan next week (15m)", done: false },
];
