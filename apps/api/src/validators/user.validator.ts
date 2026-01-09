import { LoginDTO, RegisterDTO, TokenData, UpdatePasswordDTO, UpdateUserProfileDTO } from "../dto/user.dto";
import { getUserFromEmail, getUserFromUsername, getUserFromUsernameOrEmail } from "src/database/crud/user.crud";
import * as userUtils from "../utils/user.utils";

export async function registerValidator(registerData: RegisterDTO) {
    if (!userUtils.validatePassword(registerData.password)) {
        throw userUtils.INVALID_PASSWORD_EXCEPTION;
    }

    if(!userUtils.isValidEmail(registerData.email)) {
        throw userUtils.INVALID_EMAIL_ADDRESS;
    }

    if(!userUtils.validUserPicture(registerData.picture)) {
        throw userUtils.USER_PICTURE_FORMAT_NOT_VALID;
    }

    if(registerData.username.includes('@')) {
        throw userUtils.INVALID_USERNAME;
    }

    // Query username in use.
    const userFromUsername = await getUserFromUsername(registerData.username);
    if(userFromUsername != null) {
        throw userUtils.USERNAME_ALREADY_IN_USE;
    }
    
    // Query email in use.
    const userFromEmail = await getUserFromEmail(registerData.email);
    if(userFromEmail != null) {
        throw userUtils.EMAIL_ALREADY_IN_USE;
    }
    
    return true;
}

export async function loginValidator(loginData: LoginDTO){
    const user = await getUserFromUsernameOrEmail(loginData.usernameOrEmail);

    if(!user) {
        throw userUtils.INVALID_CREDENTIALS;
    }

    const validPassword = await userUtils.verifyPassword(loginData.password, user.hashedPassword);

    if(!validPassword) {
        throw userUtils.INVALID_CREDENTIALS;
    }
}

export async function updateUserValidator(userData: TokenData, userChanges: UpdateUserProfileDTO) {
    if(!userUtils.validUserPicture(userChanges.picture)) {
        throw userUtils.USER_PICTURE_FORMAT_NOT_VALID;
    }
}

export async function updatePasswordValidator(userData: TokenData, updatePasswordData: UpdatePasswordDTO) {
    const user = await getUserFromUsername(userData.username);

    const validOldPassword = await userUtils.verifyPassword(updatePasswordData.oldPassword, user.hashedPassword);

    if(!validOldPassword) {
        throw userUtils.INVALID_CREDENTIALS;
    }

    if (!userUtils.validatePassword(updatePasswordData.newPassword)) {
        throw userUtils.INVALID_PASSWORD_EXCEPTION;
    }
}