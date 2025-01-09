import {
    Route,
    createBrowserRouter,
    createRoutesFromElements
} from "react-router-dom";

//pages....
import Home from "../pages/Home";
import Signup from "../pages/Signup"
import Login from "../pages/Login";
import OTP from "../pages/OTP";
import DashboardHeader from "../components/DashboardHeader";

import { NotFound } from "../pages/NotFound";
import ProtectedRoutes from "./ProtectedRoutes";
import HomeRoutes from "./HomeRoutes";
import Header from "../components/Header";
import Dashboard from "../pages/Dashboard";
import ClassroomSummary from "../pages/ClassroomSummary";

import Error from "../pages/Error";
import ClassroomLayout from "../pages/ClassroomLayout";
import RoleProvider from "../context/RoleProvider";
import Profile from "../pages/Profile";
import ClassroomProfile from "../components/ClassroomProfile";
import ChatSpace from "../pages/ChatSpace";
import { SocketContextProvider } from "../context/SocketContext";
import Materials from "../pages/Materials";
import AdminLogin from "../components/admin/AdminLogin";

import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../components/admin/AdminDashboard";
import TeachersPage from "../components/admin/TeachersPage";
import StudentsPage from "../components/admin/StudentsPage";
import ClassroomsPage from "../components/admin/ClassroomsPage";
import TeacherProfile from "../components/admin/TeacherProfile";
import ClassroomInfo from "../components/admin/ClassroomInfo";
import Works from "../pages/Works";
import Exams from "../pages/Exams";
import AllExams from "../components/AllExams";
import ExamType from "../components/teacher/exam/ExamType";
import AddQuestions from "../components/teacher/exam/AddQuestions";
import NewExam from "../components/teacher/exam/NewExam";
import PreviewExam from "../components/teacher/exam/PreviewExam";
import ResetPassword from "../pages/ResetPassword";
import Announcements from "../pages/Announcements";
import StudentProfile from "../components/admin/StudentProfile";
import ViewExam from "../components/students/exam/ViewExam";
import AttendExam from "../components/students/exam/AttendExam";
import ReviewAnswers from "../components/students/exam/ReviewAnswers";
import ViewExamSubmission from "../components/teacher/exam/ViewExamSubmission";
import AnswerPaper from "../components/teacher/exam/AnswerPaper";
import ValuationSummary from "../components/teacher/exam/ValurationSummary";
import ZegoLiveClass from "../pages/LiveClass";
import AllLiveClasses from "../pages/AllLiveClasses";

const RouteTree = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Header />}>
                <Route index element={<Home />}></Route>
            </Route>

            <Route path="student" element={<RoleProvider role='student' />} >
                <Route element={<HomeRoutes />}>
                    <Route element={<Header />}>
                        <Route path="signup" element={<Signup />}></Route>
                        <Route path="login" element={<Login />}></Route>
                        <Route path="verify" element={<OTP />}></Route>
                        <Route path="resetPassword/:resetPasswordToken" element={<ResetPassword />}></Route>
                    </Route>
                </Route>
                <Route element={<ProtectedRoutes />}>
                    <Route element={<DashboardHeader />}>
                        <Route path="dashboard" element={<Dashboard />}></Route>
                        <Route element={<SocketContextProvider />}>
                            <Route path="classroom" element={<ClassroomLayout />}>
                                <Route path=":classroom_id/summary" element={<ClassroomSummary />} errorElement={<Error />} />
                                <Route path="chat" element={<ChatSpace />}></Route>
                                <Route path="materials" element={<Materials />}></Route>
                                <Route path="works" element={<Works />}></Route>
                                <Route path="exams" element={<Exams />}>
                                    <Route index element={<AllExams />}></Route>
                                    <Route path="view/:examId" element={<ViewExam />}></Route>
                                    <Route path="attend/:examId" element={<AttendExam />}></Route>
                                    <Route path="review" element={<ReviewAnswers />} />
                                </Route>
                                <Route path="live_class" element={<AllLiveClasses />}>
                                    <Route path="join" element={<ZegoLiveClass/>}></Route>
                                </Route>
                                <Route path="announcements" element={<Announcements />}></Route>
                            </Route>
                            <Route path="profile" element={<Profile />}></Route>
                        </Route>
                    </Route>
                </Route>
            </Route>

            <Route path="teacher" element={<RoleProvider role='teacher' />}>
                <Route element={<HomeRoutes />}>
                    <Route element={<Header />}>
                        <Route path="signup" element={<Signup />}></Route>
                        <Route path="login" element={<Login />}></Route>
                        <Route path="verify" element={<OTP />}></Route>
                        <Route path="resetPassword/:resetPasswordToken" element={<ResetPassword />}></Route>
                    </Route>
                </Route>
                <Route element={<ProtectedRoutes />}>
                    <Route element={<DashboardHeader />}>
                        <Route path="dashboard" element={<Dashboard />}></Route>
                        <Route element={<SocketContextProvider />}>
                            <Route path="classroom" element={<ClassroomLayout />}>
                                <Route path=":classroom_id/summary" element={<ClassroomSummary />} errorElement={<Error />} />
                                <Route path="chat" element={<ChatSpace />}></Route>
                                <Route path="materials" element={<Materials />}></Route>
                                <Route path="works" element={<Works />}></Route>
                                <Route path="exams" element={<Exams />}>
                                    <Route index element={<AllExams />}></Route>
                                    <Route path="new" element={<NewExam />}></Route>
                                    <Route path="method" element={<ExamType />} />
                                    <Route path="add_questions" element={<AddQuestions />} ></Route>
                                    <Route path="preview" element={<PreviewExam />} />
                                    <Route path="upload_questions"></Route>
                                    <Route path="view/:examId" element={<ViewExamSubmission />} ></Route>
                                    <Route path="answer_paper" element={<AnswerPaper />} />
                                    <Route path="valuation_summary" element={<ValuationSummary />} />
                                </Route>
                                <Route path="live_class" element={<AllLiveClasses />}>
                                    <Route path="join" element={<ZegoLiveClass/>}></Route>
                                </Route>
                                <Route path="announcements" element={<Announcements />}></Route>
                            </Route>
                            {/* <Route path="classroom/live_class/join">
                                <Route index element={<ZegoLiveClass />}></Route>
                            </Route> */}
                            <Route path="profile" element={<Profile />}></Route>
                            <Route path="student" >
                                <Route path="profile/:student_id" element={<ClassroomProfile />}></Route>
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Route>

            <Route path="admin">
                <Route path="login" element={<AdminLogin />} />
                <Route element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />}></Route>
                    <Route path="teachers" element={<TeachersPage />} />
                    <Route path="students" element={<StudentsPage />}></Route>
                    <Route path="classrooms" element={<ClassroomsPage />} />
                    <Route path="classroom/:classroomId" element={<ClassroomInfo />}></Route>
                    <Route path="teacher/:teacherId" element={<TeacherProfile />}></Route>
                    <Route path="student/:studentId" element={<StudentProfile />}></Route>
                </Route>
            </Route>

            <Route path="*" element={<NotFound />}></Route>
        </>
    )
)

export default RouteTree;