
import  { useEffect, useRef } from 'react'
import QuestionCard from './QuestionCard';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { saveQuestionPaperType } from '../../../store/slices/persist.slice';
import { QuestionPaperEnum } from '../../../store/slices/persist.slice';
import ViewMCQ from './ViewMCQ';
import ViewDescriptive from './ViewDescriptive';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const AddQuestions = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const savedQuestions = useAppSelector(state => state.persistedData.createExam?.questions);
  const questionCardRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    dispatch(saveQuestionPaperType(QuestionPaperEnum.ADD));
    if (questionCardRef.current) {
      questionCardRef.current.scrollIntoView()
    }
  }, [savedQuestions,dispatch]);

  const handlePreview = () => {
    if (!savedQuestions || savedQuestions?.length < 1) {
      return toast.error('There should be atleast one question for the exam')
    }
    navigate('/teacher/classroom/exams/new')
  }

  return (

    <div className='w-full h-screen overflow-auto flex flex-col justify-between bg-white'>
      <div className='w-full flex py-5 px-10 rounded-md bg-gray-50 justify-between items-center shadow-md'>
        <h1 className='text-xl font-bold uppercase text-costume-primary-color'>{'ADD QUESTIONS'}</h1>
        <div className='font-semibold'>
          <h5 >{`Total questions: ${savedQuestions?.length}`}</h5>
          <h5>{`Total Marks: ${savedQuestions?.reduce((acc, curr) => { return acc += Number(curr.mark) }, 0)}`}</h5>
        </div>
      </div>
      <div className='w-full  h-full flex flex-col items-center  overflow-auto'>
        <div className='md:w-3/4 mt-4 p-5'>
          {savedQuestions && savedQuestions.map((question, index) =>
            question.type === 'mcq' ? <ViewMCQ count={index} question={question} /> :
              question.type === 'descriptive' ? <ViewDescriptive count={index} question={question} /> : '')}

          <div className='mt-3' ref={questionCardRef}>
            <QuestionCard questionCount={savedQuestions ? savedQuestions.length + 1 : 1} />
          </div>
        </div>
      </div>
      <div className='w-full flex justify-center gap-5 p-5  bg-gray-50'
        style={{
          boxShadow: "0 -4px 6px 0 rgba(0, 0, 0, 0.1)",
        }}>
        <button
          onClick={handlePreview}
          className='primary-btn'>Preview</button>
      </div>
    </div>
  )
}

export default AddQuestions