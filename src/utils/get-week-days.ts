interface getWeekDaysParms {
  short?: boolean;
}

export function getWeekDays({ short = false }: getWeekDaysParms = {}) {
  const formatted = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });

  return Array.from(Array(7).keys())
    .map((day) => formatted.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekday) => {
      if (short) {
        return weekday.substring(0, 3).toUpperCase();
      }

      return weekday
        .substring(0, 1)
        .toLocaleUpperCase()
        .concat(weekday.substring(1));
    });
}
