import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const username = String(req.query.username);

  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ message: "Year or month not specified" });
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User does not exists" });
  }

  const availableWeekdays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  });

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekdays.some(
      (availableWeekday) => availableWeekday.week_day === weekDay
    );
  });

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    -- sekecionar todos os schedules --
    SELECT 
      EXTRACT(DAY FROM S.date) AS date,
      COUNT(S.date) AS amount, -- Conta quanto horarios tem ocupados --
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) as size -- total de horarios disponiveis --

    FROM scheduling S

    -- total de horario disponivel no dia --
    LEFT JOIN user_time_intervals UTI
      on UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY)) -- INTERVAL 1 DAY: do mysql o dia da semana começa em 1, vamos add mais um a cada dia

    -- trazer os schedules dos usuario  --
    WHERE S.user_id = ${user.id}
      AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}

    -- agrupar os schedules pelo dia  --
    GROUP BY EXTRACT(DAY FROM S.date),
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

    -- retorna todos os registro que sobraram da listagem -
    HAVING amount >= size
  `;

  const blockedDates = blockedDatesRaw.map((iten) => iten.date);

  console.log(blockedDates);

  return res.json({ blockedWeekDays, blockedDates });
}
