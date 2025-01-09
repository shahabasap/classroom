import { useState } from 'react'
import NewMaterial from '../components/teacher/NewMaterial';
import { useAppSelector } from '../store/store';
import useRole from '../hooks/useRole';
import { convertToIST } from '../utils/indian.std.time';
import useGetMaterials from '../hooks/useGetMaterials';


const Materials = () => {

    useGetMaterials();
    const [openUploadMaterial, setOpenUploadMaterial] = useState(false);
    const role = useRole();

    const materials = useAppSelector(state => role == 'teacher' ?
        state.teacherClassroom.classroom?.materials :
        state.studentClassroom.classroom?.materials);

    return (
        <div className=' h-full flex  flex-col   rounded-lg border-2 shadow-md border-gray-200 w-full'>
            {role == 'teacher' &&
                <div className='w-full  flex py-5 justify-center'>
                    <button
                        onClick={() => setOpenUploadMaterial(true)}
                        className='primary-btn py-2'> New material</button>
                </div>}
            <hr className='border mx-2' />
            <div className='w-full flex-grow flex-1  p-4  '>
                {materials && materials.map(material =>
                    <div
                        key={material._id}
                        className='w-full border-2 mb-4 md:flex justify-between items-center shadow-sm p-3 px-6 rounded-lg'>
                        <div className='space-y-1 flex-grow flex-1 mr-2'>
                            <h2 className='text-xl font-semibold text-costume-primary-color'>{material.title}</h2>
                            <h4 className='text-lg'>{material.description}</h4>
                            <h5 className='text-gray-400 text-sm'>{convertToIST(material.created_at)}</h5>
                        </div>
                        <div className='flex flex-col gap-3 lg:flex-row'>
                            <button onClick={() => window.open(material.url, '_blank')}
                                className='primary-btn'>Open</button>
                            {/* {role == 'teacher' && <button
                                onClick={()=>handleDeletion(material._id)}
                                className='danger-btn'>Delete</button>} */}
                        </div>
                    </div>
                )}
            </div>
            {openUploadMaterial && <NewMaterial closeModal={setOpenUploadMaterial} />}
        </div>
    )
}

export default Materials