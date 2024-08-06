import dayjs from 'dayjs';
import 'dayjs/locale/pt'

dayjs.locale('pt')

const getDaysOfWeek = () => {
  const today = dayjs(new Date());
  const year = today.year();
  const month = today.month();
  const tdDay = today.day()

  const startDate = dayjs().year(year).month(month).day(tdDay)
  const daysOfWeek = [];

  for (let i = 0; i < 7; i++) {
    const date = startDate.add(i, 'day');
    const day = date.format('DD');
    const weekday = date.format('dddd'); // Nomes dos dias da semana em inglês

    daysOfWeek.push({
      date: new Date(date.locale('pt').format('YYYY-MM-DD')),
      day,
      weekday,
      weekDayId: date.day(),
      today: parseInt(day) === today.date()
    });
  }

  return daysOfWeek;
};

export const getWeekDayName = (weekDay: string) => {
  switch(weekDay) {
    case 'domingo':
      return 'Domingo'
    case 'segunda':
      return 'Segunda'
    case 'terca': 
      return 'Terça'
    case 'quarta':
      return 'Quarta'
    case 'quinta':
      return 'Quinta'
    case 'sexta':
      return 'Sexta'
    case 'sabado':
      return 'Sabádo'
    default: return ''
  }
} 

export default getDaysOfWeek
