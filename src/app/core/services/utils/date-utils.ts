// export function getTodayUtcRange() {
//   const now = new Date();

//   const startOfDay = new Date(
//     Date.UTC(
//       now.getUTCFullYear(),
//       now.getUTCMonth(),
//       now.getUTCDate(),
//       0, 0, 0
//     )
//   );

//   return {
//     fromUtc: startOfDay.getTime(),
//     toUtc: now.getTime()
//   };
// }


import * as moment from 'moment-timezone';

export function getDayRangeUtc(
  timezone: string,
  day: 'today' | 'yesterday'
) {
  const base = moment().tz(timezone);

  const start =
    day === 'today'
      ? base.clone().startOf('day')
      : base.clone().subtract(1, 'day').startOf('day');

  const end =
    day === 'today'
      ? base.clone().endOf('day')
      : base.clone().subtract(1, 'day').endOf('day');

  return {
    fromUtc: start.valueOf(),
    toUtc: end.valueOf()
  };
}
