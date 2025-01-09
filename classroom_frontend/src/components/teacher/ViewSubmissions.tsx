import React, { useState } from 'react'
import { WorksSchema } from '../../schema/works.schema';
import CloseIcon from '@mui/icons-material/Close';

import { TextField } from '@mui/material';
import { convertToIST } from '../../utils/indian.std.time';
import { updateWorkMark } from '../../api/services/teacher.classroom.services';
import handleError from '../../utils/error.handler';
import { useAppDispatch } from '../../store/store';
import { updateWorkMarkRedux } from '../../store/slices/teacher.classroom.slice';
import toast from 'react-hot-toast';

type ViewSubmissionsPropsType = {
  closeSubmissions: (value: boolean) => void,
  work: WorksSchema
}


const ViewSubmissions: React.FC<ViewSubmissionsPropsType> = ({ work, closeSubmissions }) => {

  const [selectedSubmission, setSelectedSubmission] = useState('');
  const [enableSave, setEnableSave] = useState(true);
  const [mark, setMark] = useState('');
  const dispatch = useAppDispatch()


  const validateMark = (e: React.ChangeEvent<HTMLInputElement>, submissionId: string, mark: number) => {
    setSelectedSubmission(submissionId)
    const inputValue = e.target.value;

    if (/^[0-9]*$/.test(inputValue) && Number(inputValue) >= 0 && Number(inputValue) <= work.max_marks) {
      if (Number(inputValue) != mark) {
        setEnableSave(true)
        setMark(inputValue)
      } else {
        setEnableSave(false)
        setMark('')
      }
    } else {
      e.target.value = ''
    }
  }

  const updateMark = async (studentId: string) => {
    const data = {
      mark: Number(mark),
      studentId
    }
    try {
      const updateMark = await updateWorkMark(work._id, data);
      toast.success('Mark updated successfully!')
      dispatch(updateWorkMarkRedux(updateMark as WorksSchema))
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div className='fixed flex items-center   overflow-hidden inset-0 bg-black bg-opacity-30'>
      <div className='mx-auto bg-white max-h-[80vh]  overflow-auto flex flex-col rounded-lg p-5 w-full md:w-10/12  items-center'>
        <div className='flex justify-end w-full'>
          <div
            onClick={() => closeSubmissions(false)}
            className='border hover:border-2 cursor-pointer hover:border-gray-400 p-1 rounded-md'>
            <CloseIcon fontSize='medium' color='error' />
          </div>
        </div>
        <div className='text-costume-primary-color font-semibold text-lg mb-2'>{`SUBMISSIONS `}</div>
        <hr className='border-2 w-full  mb-3' />
        <div className='w-full  '>
          {work.submissions.length > 0 ?
            <table className='w-full'>
              <thead>
                <tr >
                  <th className='text-start pl-5'>#</th>
                  <th className='text-start'>Name</th>
                  <th className='text-start'>Submitted on</th>
                  <th className='text-start'>{`Marks (out of ${work.max_marks})`}</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className='space-y-10'>
                <tr>
                  <td colSpan={5} >
                    <hr className='my-3 border-white border-opacity-10 ' />
                  </td>
                </tr>

                {work.submissions.map(submission =>
                  <tr id={submission._id}
                    className='hover:bg-gray-100 ' >
                    <td className=' py-4 pl-5  text-start rounded-l-lg'>{1}</td>
                    <td >
                      <p>{submission.student_name}</p>
                    </td>
                    <td>{convertToIST(submission.submission_time)}</td>
                    <td>
                      <TextField
                        required
                        size='small'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => validateMark(e, submission._id, submission.marks)}
                        id="outlined-required"
                        label={`score`}
                        // value={}
                        defaultValue={`${submission.marks}`} />
                    </td>
                    <td >
                      <div className=' flex justify-center flex-col md:flex-row gap-3'>
                        <button
                          onClick={() => window.open(submission.submitted_file_url, '_blank')}
                          className='primary-btn'>open</button>
                        <button
                          disabled={!(selectedSubmission == submission._id && enableSave)}
                          onClick={() => updateMark(submission.student_id)}
                          className='success-btn disabled:bg-gray-500'>save</button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table> : ''}
        </div>
      </div>
    </div>
  )
}

export default ViewSubmissions