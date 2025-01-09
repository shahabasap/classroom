
import { promises as fs } from "fs";

import uploader from "../../infrastructure/config/cloudinary";
import { I_CloudinaryService } from "../../interface/service_interface/I_Cloudinary";

class CloudinaryService implements I_CloudinaryService {
  private uploader: any;

  constructor() {
    this.uploader = uploader;
  }

  async uploadProfileImage(filePath: string): Promise<any> {
    return this.uploadGeneric(filePath, "profile");
  }

  async uploadCourseThumbnail(filePath: string): Promise<any> {
    return this.uploadGeneric(filePath, "courseThumbnails");
  }

  async uploadCourseContent(filePath: string): Promise<any> {
    return this.uploadGeneric(filePath, "courseContent");
  }

  async uploadSubmission(filePath: string): Promise<any> {
    return this.uploadGeneric(filePath, "submissions");
  }

  async uploadGeneric(filePath: string, folder: string): Promise<any> {
    try {
      const result = await this.uploader.upload(filePath, {
        folder,
        resource_type: "auto", // Automatically detects the file type
      });
      await fs.unlink(filePath); // Remove the file from local storage after upload
      return result;
    } catch (error: any) {
      throw new Error(`Failed to upload file to ${folder}: ${error.message}`);
    }
  }
}

export default CloudinaryService;
