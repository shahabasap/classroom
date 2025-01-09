
import express from "express"
import _ from "lodash";
import { customAlphabet } from "nanoid";
import { RequestHandler } from "express";
import { UniqueIDGenerator } from "../../application/service/unique.id";

import { createClassroomSchema } from "../../schema/create.classroom.schema";

import validate from "../middleware/validate.req.data.middleware";
import { TeacherClassroomGateway } from "../gateway/teacher.classroom.gateway";
import { TeacherClassroomInteractor } from "../../application/interactor/teacher.classroom.interactor";
import { TeacherClassroomRepo } from "../../infrastructure/repositories/teacher.classroom.repo";
import { JWT } from "../../application/service/jwtService/jwt";
import { ClasroomAuthInteractor } from "../../application/interactor/classroom.auth.interactor";
import { StudentClassroomRepo } from "../../infrastructure/repositories/student.classroom.repo";
import { ClassroomAuthMiddleware } from "../middleware/classroom.auth.middleware";
import { studentIdBodySchema, studentIdParamsSchema } from "../../schema/remove.student.schema";
import { StudentRepo } from "../../infrastructure/repositories/student.repo";
import { TeacherRepo } from "../../infrastructure/repositories/teacher.repo";
import { saveMessageSchema } from "../../schema/saveMessageSchema";
import { SocketServices } from "../../application/service/socket.service";
import { sendPrivateMessage } from "../../schema/send.private.message.schema";
import { deleteMaterialSchema, uploadMaterilaSchema } from "../../schema/upload.material.schema";
import multer from "multer";
import { createWorkSchema, updateWorkMarkSchema } from "../../schema/work.schema";
import { DayJS } from "../../application/service/day.js";
import { createExamSchema, publishExamSchema } from "../../schema/exam.schema";
import { ZegoCloud } from "../../application/service/zegocloude";
import { startLiveClassSchema } from "../../schema/live.class.schema";
import CloudinaryService from "../../application/service/cloudinary";

const router = express.Router();


const storage = multer.memoryStorage()
const upload = multer({ storage });


//services
const uniqueIdGenerator = new UniqueIDGenerator(customAlphabet);
const jwt = new JWT();
const socket = new SocketServices();
const cloudinary = new CloudinaryService();
const dayJS = new DayJS();
const zegoCloud = new ZegoCloud()

//repos
const studentRepo = new StudentRepo();
const teacherRepo = new TeacherRepo()
const teacherClassroomRepo = new TeacherClassroomRepo();
const studentClassroomRepo = new StudentClassroomRepo()

const classroomInteractor = new TeacherClassroomInteractor(
    teacherClassroomRepo,
    studentRepo,
    teacherRepo,
    uniqueIdGenerator,
    jwt,
    socket,
    cloudinary,
    dayJS,
    zegoCloud);

const classroomAuthInteractor = new ClasroomAuthInteractor(
    teacherClassroomRepo,
    studentClassroomRepo,
    jwt
)

const classroomAuth = new ClassroomAuthMiddleware(classroomAuthInteractor)
const teacherClassroomGateway = new TeacherClassroomGateway(classroomInteractor);

router.route('/')
    .post(validate(createClassroomSchema),
        teacherClassroomGateway.onCreateClassroom.bind(teacherClassroomGateway) as RequestHandler)
    .get()

router.route('/summary/:classroom_id')
    .get(
        teacherClassroomGateway.onGetTeacherClassroom.bind(teacherClassroomGateway) as RequestHandler);

//protected routes.....................
router.use(classroomAuth.teacherClassroomGatekeeper.bind(classroomAuth) as RequestHandler)

router.route('/requests/accept')
    .patch(validate(studentIdBodySchema),
        teacherClassroomGateway.onAcceptJoiningRequest.bind(teacherClassroomGateway) as RequestHandler)

router.route('/requests/reject')
    .patch(teacherClassroomGateway.onRejectJoinRequest.bind(teacherClassroomGateway) as RequestHandler)

router.route('/student/profile/:student_id')
    .get(validate(studentIdParamsSchema),
        teacherClassroomGateway.onGetStudentProfile.bind(teacherClassroomGateway) as RequestHandler)

router.route('/student/remove/:student_id')
    .patch(validate(studentIdParamsSchema),
        teacherClassroomGateway.onRemoveStudent.bind(teacherClassroomGateway) as RequestHandler);

router.route('/student/manage_access/:student_id')
    .patch(validate(studentIdParamsSchema),
        teacherClassroomGateway.onBlockOrUnblockStudent.bind(teacherClassroomGateway) as RequestHandler
    )

router.route('/chat')
    .get(teacherClassroomGateway.onGetClassroomMessages.bind(teacherClassroomGateway) as RequestHandler)
    .post(validate(saveMessageSchema),
        teacherClassroomGateway.onSendClassroomMessage.bind(teacherClassroomGateway) as RequestHandler)


router.route('/chat/:receiverId')
    .get(teacherClassroomGateway.onGetPrivateMessages.bind(teacherClassroomGateway) as RequestHandler)
    .post(validate(sendPrivateMessage),
        teacherClassroomGateway.onSendPrivateMessage.bind(teacherClassroomGateway) as RequestHandler)

router.route('/materials/')
    .get(teacherClassroomGateway.onGetMaterials.bind(teacherClassroomGateway) as RequestHandler)
    .post(upload.single('material'),
        validate(uploadMaterilaSchema),
        teacherClassroomGateway.onMaterilalUpload.bind(teacherClassroomGateway) as RequestHandler)
    .delete(validate(deleteMaterialSchema),
        teacherClassroomGateway.onDeleteMaterial.bind(teacherClassroomGateway) as RequestHandler)

router.route('/works')
    .get(teacherClassroomGateway.onGetAllWorks.bind(teacherClassroomGateway) as RequestHandler)
    .post(upload.single('work'),
        validate(createWorkSchema),
        teacherClassroomGateway.onCreateWork.bind(teacherClassroomGateway) as RequestHandler)

router.route('/work/:workId')
    .get()
    .patch(validate(updateWorkMarkSchema),
        teacherClassroomGateway.onUpdateWorkMark.bind(teacherClassroomGateway) as RequestHandler)

router.route('/exams')
    .get(teacherClassroomGateway.onGetAllExams.bind(teacherClassroomGateway) as RequestHandler)
    .post(validate(createExamSchema),
        teacherClassroomGateway.onCreateExam.bind(teacherClassroomGateway) as RequestHandler);
router.route('/exam/:examId')
    .patch(
        validate(publishExamSchema),
        teacherClassroomGateway.onPublishExamResult.bind(teacherClassroomGateway) as RequestHandler)

router.route('/announcements')
    .get(teacherClassroomGateway.onGetAnnouncements.bind(teacherClassroomGateway) as RequestHandler)

router.route('/liveClass')
    .get(teacherClassroomGateway.onGetLiveClassToken.bind(teacherClassroomGateway) as RequestHandler)
    .post(validate(startLiveClassSchema),
        teacherClassroomGateway.onStartLiveClass.bind(teacherClassroomGateway) as RequestHandler)
    .patch()
export default router  