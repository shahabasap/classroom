import { Request, Response, NextFunction } from "express";
import { I_AdminInteractor } from "../../interface/admin_interface/I_adminInteractor";
import { accessTokenExpirationTime } from '../../infrastructure/constants/appConstants'
import { NODE_ENV } from "../../infrastructure/constants/env";
export class AdminGateway {
    private interactor: I_AdminInteractor;
    constructor(interactor: I_AdminInteractor) {
        this.interactor = interactor;
    }

    async onLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            const data = await this.interactor.login(body);
            res.cookie('adminAccessToken', data.adminAccessToken, {
                maxAge: accessTokenExpirationTime,
                httpOnly: true,
                secure : NODE_ENV === 'production',
                sameSite:'none'
            })
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

    async onLogout(req: Request, res: Response, next: NextFunction) {
        try {
            res.cookie('adminAccessToken', '', {
                maxAge: 0,
                httpOnly: true,
                secure : NODE_ENV === 'production',
                sameSite:'none'
            })
            res.status(200).json({ message: 'loged out successfully' })
        } catch (error) {
            next(error)
        }
    }

    async onGetTeachers(req: Request<{},{},{},{page:number,rows:number}>, res: Response, next: NextFunction) {
        try {
            const {query} = req
            const teachers = await this.interactor.getTeachers(query);

            res.status(200).json(teachers)
        } catch (error) {
            next(error)
        }
    }

    async onGetStudents(req: Request<{},{},{},{page:number,rows:number}>, res: Response, next: NextFunction) {
        try {
            const {query} = req
            const students = await this.interactor.getStudents(query);

            res.status(200).json(students)
        } catch (error) {
            next(error)
        }
    }

    async onGetClassrooms(req: Request<{},{},{},{page:number,rows:number}>, res: Response, next: NextFunction) {
        try {
            const {query} = req
            const classrooms = await this.interactor.getClassrooms(query);
            res.status(200).json(classrooms)
        } catch (error) {
            next(error)
        }
    }

    async onGetTeacherInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params as { teacherId: string };

            const teacher = await this.interactor.getTeacherInfo(params);

            res.status(200).json(teacher)
        } catch (error) {
            next(error)
        }
    }

    async onBLockTeacher(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as {reason:string}
            const params = req.params as { teacherId: string }
            await this.interactor.blockOrUnblockTeacher(params,body)
            res.status(200).json({blocked:true})
        } catch (error) {
            next(error)
        }
    }

    async onGetStudentInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params as { studentId: string }
            const student = await this.interactor.getStudentInfo(params)
            res.status(200).json(student)
        } catch (error) {
            next(error)
        }
    }

    async onGetClassroomInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params as { classroomId: string };
            const classroom = await this.interactor.getClassroomInfo(params);


            res.status(200).json(classroom)
        } catch (error) {
            next(error)
        }
    }

    async onBanOrUnbanClassroom(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as {reason:string}
            const params = req.params as {classroomId:string}
            await this.interactor.banOrUnbanClassroom(params,body)
            res.status(200).json('classroom')
        } catch (error) {
            next(error)
        }
    }

    async onBlockOrUnblockStudent(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as {reason:string}
            const params = req.params as {studentId:string}
            await this.interactor.blockOrUnblockStudent(params,body)
            res.status(200).json('classroom')
        } catch (error) {
            next(error)
        }
    }
}