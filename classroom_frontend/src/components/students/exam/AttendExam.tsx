import { useEffect, useState } from 'react'
import { useAppSelector } from '../../../store/store'
import { ExamQuestionType } from '../../../schema/exams.schema';
import AnswerDesctiptive from './AnswerDesctiptive';
import AnswerMCQ from './AnswerMCQ';
import TimerIcon from '@mui/icons-material/Timer';
import { useNavigate } from 'react-router-dom';


const QuestionType = (
  question: ExamQuestionType,
  index: number) => {
  switch (question.type) {
    case 'mcq':
      return <AnswerMCQ options={question.options} index={index} />;
    case 'descriptive':
      return <AnswerDesctiptive index={index} />
    default:
      return
  }
}

const formatTime = (time: number): string => {
  const hour = Math.floor(time / (60 * 60))
  const minute = Math.floor((time % 3600) / 60)
  const seconds = time % 60;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const AttendExam = () => {
 
  const navigate = useNavigate()
  const [questionIndex, setQuestionIndex] = useState(0);
  const exam = useAppSelector(state => state.persistedData.onGOingExam);
  const [clockTime, setClockTime] = useState<number>(() => {
    const totalSeconds = exam.duration * 60;
    const elapsedSeconds = Math.floor((Date.now() - new Date(exam.startedAt!).getTime()) / 1000);
    return Math.max(totalSeconds - elapsedSeconds, 0);
    // return 5;
  });
  const questions = exam.questionPaper;
  const attended = useAppSelector(state => state.persistedData.onGOingExam.studentAnswers.reduce((acc, curr) => acc += curr != '' ? 1 : 0, 0));
  const onSubmit = () => {
    navigate('../review')
  }



  if (clockTime == 0) {
    onSubmit()
  }

  useEffect(() => {
    if (Date.now() > new Date(exam.lastTimeToStart).getTime()) {
      return navigate('../')
    }
    const timer = setInterval(() => {
      setClockTime(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0
        }
        return prevTime - 1;
      })
    }, 1000)

    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  const handleNext = () => {
    if (questionIndex == questions.length - 1) return;
    setQuestionIndex(questionIndex + 1)
  }
  const handlePrev = () => {
    if (questionIndex == 0) return
    setQuestionIndex(questionIndex - 1)
  }
  return (
    <div className='w-full flex flex-col h-full justify-between'>
      <div className='w-full flex justify-between items-center bg-gray-100 p-5'>
        <h1 className='text-lg font-bold uppercase'>{exam.title}</h1>
        <div className='flex text-red-600 items-center gap-2'>
          <TimerIcon />
          <p className='font-bold'>{formatTime(clockTime)}</p>
        </div>
        <div>
          <p className='font-bold'>{`Answered: ${attended}/${questions.length}`}</p>
        </div>
      </div>
      <div className="flex flex-grow">
        <div className='flex w-full flex-col p-5'>
          <div className='border-2 w-full h-full flex flex-col p-3 rounded-md bg-blue-100'>
            <div className='p-3 px-5 flex justify-between'>
              <h3 className='font-semibold'>Question {questionIndex + 1}</h3>
              <h2 className='font-semibold'>{`Max marks: ${questions[questionIndex].mark}`}</h2>
            </div>
            <hr className='w-full border-neutral-400 border' />
            <div className='w-full p-3 mt-3  bg-white rounded-md '>
              <h1 className='font-semibold'>{questions[questionIndex].question}</h1>
            </div>
            <div>
              {QuestionType(questions[questionIndex], questionIndex)}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center gap-4 p-3 ">
        {questionIndex !== 0 &&
          <button
            onClick={handlePrev}
            className='warning-btn'>Prev</button>}
        {(questionIndex == questions.length - 1) ?
          <button
            onClick={onSubmit}
            className='success-btn'>
            Submit
          </button> :
          <button
            onClick={handleNext}
            className='primary-btn'>Next</button>}
      </div>
    </div>
  )
}

export default AttendExam