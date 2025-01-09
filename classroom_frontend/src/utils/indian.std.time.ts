import dayjs from "dayjs"
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)
dayjs.extend(timezone)

export const convertToIST= ( date: string|Date):string=>{
   
    const stdTime =  new Date(date).toLocaleString('en-IN',{
        timeZone:'Asia/kolkata',
        hour:'2-digit',
        minute:'2-digit',
        day:'2-digit',
        month:'2-digit',
        year:'numeric',
        weekday:'short',
        hour12:true
    })

    return stdTime
}

export const ReadableDate = (date:string|Date):string=>{
   
    const formattedDate = new Date(date).toLocaleDateString('en-IN',{
        timeZone:'Asia/kolkata',
        month:'short',
        day:'numeric',
        year:'numeric'
    })
    const [day,month,year] = formattedDate.split(' ');
    return `${month}-${day}, ${year}`
}

export const convertToMilliseconds = (fullDate:string)=>{
    const [day,date,time] = fullDate.split(', ')
    console.log(day,date,time)
}

export const millisecondsInIST =()=>{
    return dayjs().tz('Asia/Kolkata').startOf('minute').valueOf();
}