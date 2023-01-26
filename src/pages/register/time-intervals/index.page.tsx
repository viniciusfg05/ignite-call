import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@ignite-ui/react";
import { useRouter } from "next/router";
import { ArrowArcRight, ArrowRight } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../lib/axios";
import { convertTimeStringToMinutes } from "../../../utils/convert-time-string-to-minutes";
import { getWeekDays } from "../../../utils/get-week-days";
import { Container, Header } from "../styles";
import {
  FormErros,
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
} from "./styles";

const timeIntervalFormsSchema = z.object({
  // Array com varios objetos - z.ojetect: indica que vada posição do array é um objeto
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7) // indica que sempre vamos receber 7 dias da semana
    //tranform recebe o array original a ser tranformado
    .transform((intervals) =>
      //filtrando desta forma será retornado apenas o intervals ativos
      intervals.filter((intervals) => intervals.enabled === true)
    )
    //refine trabalha da msm forma que tranform, mas ele retorna um true: valido, false: invalido
    .refine((intervals) => intervals.length > 0, {
      message: "Você precisa seleciona pelo menos um dia da semana",
    })
    .transform((intervals) => {
      // vamos sobrescrever o intervals para converter as horas em minutos, pois ficará muito facil de trabalhar
      return intervals.map((intervals) => {
        return {
          weekDay: intervals.weekDay,
          startTimeInMinute: convertTimeStringToMinutes(intervals.startTime),
          endTimeInMinute: convertTimeStringToMinutes(intervals.endTime),
        };
      });
    })
    .refine(
      (intervals) => {
        // every: se todos cumprem com a condição, diferente do some: que retorna se encontrar qualquer um
        return intervals.every(
          (interval) =>
            interval.endTimeInMinute - 60 >= interval.startTimeInMinute
        );
      },
      {
        message:
          "O horario de termino precisa ter um diferença de 1 hora distante do inicio",
      }
    ),
});

// type TimeIntervalsFormData = z.infer<typeof timeIntervalFormsSchema>;
type TimeIntervalsFormInput = z.input<typeof timeIntervalFormsSchema>;
type TimeIntervalsFormOutput = z.output<typeof timeIntervalFormsSchema>;

export default function TimeIntervals() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalFormsSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: "08:00", endTime: "18:00" },
        { weekDay: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 5, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
      ],
    },
  });

  const intervals = watch("intervals");

  const router = useRouter();

  const weekDays = getWeekDays();

  // pode interar uma array no formulario como o map
  const { fields } = useFieldArray({
    control, // para o useform saber que ele vai lidar com o campo acima "intervals"
    name: "intervals", // nome do campo no formulario
  });

  async function handleSetTimeIntervals(data: any) {
    // erro no data com ":TimeIntervalsFormOutput" estamos forçando a timagem
    const { intervals } = data as TimeIntervalsFormOutput;

    await api.post("/users/time-intervals", { intervals });

    await router.push("/register/update-profile");
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>

        <MultiStep size={4} currentStep={3}></MultiStep>

        <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
          <IntervalContainer>
            {fields.map((field, index) => (
              <IntervalItem key={field.id}>
                <IntervalDay>
                  {/* elemento que não são nativos do html*/}
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Checkbox
                          onCheckedChange={(checked) => {
                            field.onChange(checked === true);
                          }}
                          checked={field.value}
                        />
                      );
                    }}
                  />
                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.startTime`)}
                  ></TextInput>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.endTime`)}
                  ></TextInput>
                </IntervalInputs>
              </IntervalItem>
            ))}
          </IntervalContainer>

          {errors.intervals?.message && (
            <FormErros>{errors.intervals.message}</FormErros>
          )}

          <Button disabled={isSubmitting}>
            Proximo passo
            <ArrowRight />
          </Button>
        </IntervalBox>
      </Header>
    </Container>
  );
}
