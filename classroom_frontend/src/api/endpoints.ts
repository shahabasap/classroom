
export const adminEndpoints = {
    login:'admin/login',
    logout:'admin/logout',
    teachers:(rows:number,page:number)=>`admin/teachers?page=${page}&rows=${rows}`,
    students:(rows:number,page:number)=>`admin/students?page=${page}&rows=${rows}`,
    classrooms:(rows:number,page:number)=>`admin/classrooms?page=${page}&rows=${rows}`,
    teacher:(teacherId:string)=>`admin/teacher/${teacherId}`,
    student:(studentId:string)=>`admin/student/${studentId}`,
    classroom:(classroomId:string)=>`admin/classroom/${classroomId}`
}

export const studentEndpoints = {
    authenticate:'student/auth',
    register: "student/register",
    verify: "student/verify",
    login:"student/login",
    logout:"student/logout",
    resendOTP:"student/resend_otp",
    googleLogin:"student/google_login",
    updateProfileImage:'student/profile/image',
    forgotPassword:'student/forgotPassword',
    resetPassword:(token:string)=>`student/resetPassword/${token}`
}

export const teacherEndpoints={
    authenticate:'teacher/auth',
    register: "teacher/register",
    verify: "teacher/verify",
    login:"teacher/login",
    logout:"teacher/logout",
    resendOTP:"teacher/resend_otp",
    googleLogin:"teacher/google_login",
    updateProfileImage:'teacher/profile/image',
    forgotPassword:'teacher/forgotPassword',
    resetPassword:(token:string)=>`teacher/resetPassword/${token}`,
    
}

export const teacherClassroomEndpoints={
    create:`teacher/classroom`,
    allClassrooms:`teacher/classroom/all`,
    classroom:(classroom_id:string):string =>`teacher/classroom/summary/${classroom_id}`,
    acceptRequest:`teacher/classroom/requests/accept`,
    rejectRequest:`teacher/classroom/requests/reject`,
    studentProfile:(student_id:string)=>`teacher/classroom/student/profile/${student_id}`,
    removeStudent:(student_id:string)=>`teacher/classroom/student/remove/${student_id}`,
    blockOrUnblockStudent:(student_id:string)=>`teacher/classroom/student/manage_access/${student_id}`,
    chatEndpoint:'teacher/classroom/chat',
    privateChat:(receiverId:string)=>`teacher/classroom/chat/${receiverId}`,
    materials:'teacher/classroom/materials',
    deleteMaterial:(materialId:string)=>`teacher/classroom/materials?materialId=${materialId}`,
    works:'teacher/classroom/works',
    work:(workId:string)=>`teacher/classroom/work/${workId}`,
    exams:`teacher/classroom/exams`,
    announcements:'teacher/classroom/announcements',
    exam:(examId:string)=>`teacher/classroom/exam/${examId}`,
    liveClass:`teacher/classroom/liveClass`
}

export const studentClassroonEndpoints = {
    allClassrooms:`student/classroom/all`,
    searchClassroom:(classroom_id:string):string=>`student/classroom/search/${classroom_id}`,
    requestToJoinClassroom:(classroom_id:string):string=>`student/classroom/search/${classroom_id}`,
    classroomDetails:(classroom_id:string)=>`student/classroom/summary/${classroom_id}`,
    chatEndpoint:'student/classroom/chat',
    privateChat:(receiverId:string)=>`student/classroom/chat/${receiverId}`,
    materials:'student/classroom/materials',
    works:'student/classroom/works',
    work:(workId:string)=>`student/classroom/work?workId=${workId}`,
    announcements:'student/classroom/announcements',
    exams:`student/classroom/exams`,
    exam:(examId:string)=>`student/classroom/exam/${examId}`,
    liveClass:`student/classroom/liveClass`
}



 
