import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // 1) get user details from frontend
    // 2) not-empty fields validation
    // 3) check if user already exists: email, username
    // 4) check for images: Avatar (as it is required)
    // 5) upload images to cloudinary
    // 6) create user entry in database

    const { email, fullName, username, password } = req.body;

    if ([email, fullName, username, password].some((field) => !field || field?.trim() === "")) {
        throw new ApiError(400, "All Fields are required");
    }

    const isUserAlreadyRegistered = User.findOne({
        $or: [{ email }, { username }],
    });

    if (isUserAlreadyRegistered) {
        throw new ApiError(409, "User with corresponding username or email already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar File is required");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully") 
    )
});

export { registerUser };
