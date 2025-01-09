export interface I_CloudinaryService {
    uploadProfileImage(filePath: string): Promise<any>;
    uploadCourseThumbnail(filePath: string): Promise<any>;
    uploadCourseContent(filePath: string): Promise<any>;
    uploadSubmission(filePath: string): Promise<any>;
    uploadGeneric(filePath: string, folder: string): Promise<any>;
  }
  