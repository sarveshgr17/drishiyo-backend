import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config();

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null;
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        // file has been uploaded successfully
        console.log("File is successfully uploaded on cloudinary", response.url);
        return response;
    } catch (error) {
        fs.unlink(localFilePath)
        // remove the locally saved temp file as the upload operation got failed
    }
}

export {uploadOnCloudinary} 