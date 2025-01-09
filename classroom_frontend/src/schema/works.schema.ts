export interface WorksSchema {
    _id: string,
    classroom_id: string,
    
    work_type: string,
    work_file_url: string,
    work_file_type: string,
    deadline: string,
    max_marks: number,
    topic:string,
    description:string,
    submissions: Array<{
        _id:string
        student_id: string,
        student_name: string,
        submission_time: string,
        submitted_file_url: string,
        submitted_file_type: string,
        marks: number,
        valuated:boolean
    }>,
    createdAt:string,
}

export type WorkSubmissionType = WorksSchema['submissions'][number]