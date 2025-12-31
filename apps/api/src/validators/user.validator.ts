import { LoginDTO, RegisterDTO } from "../dto/user.dto";
import { getUserFromEmail, getUserFromUsername, getUserFromUsernameOrEmail } from "src/database/crud/user.crud";
import * as userUtils from "../utils/user.utils";

export async function registerValidator(registerData: RegisterDTO) {
    if (!userUtils.validatePassword(registerData.password)){
        throw userUtils.INVALID_PASSWORD_EXCEPTION;
    }

    if(!userUtils.isValidEmail(registerData.email)){
        throw userUtils.INVALID_EMAIL_ADDRESS;
    }

    // Query username in use.
    const userFromUsername = await getUserFromUsername(registerData.username);
    if(userFromUsername != null){
        throw userUtils.USERNAME_ALREADY_IN_USE;
    }
    
    // Query email in use.
    const userFromEmail = await getUserFromEmail(registerData.email);
    if(userFromEmail != null){
        throw userUtils.EMAIL_ALREADY_IN_USE;
    }
    
    return true;
}

export async function loginValidator(loginData: LoginDTO){
    const user = await getUserFromUsernameOrEmail(loginData.usernameOrEmail);

    if(!user) {
        throw userUtils.INEXISTENT_USER;
    }

    const validPassword = await userUtils.verifyPassword(loginData.password, user.hashedPassword);

    if(!validPassword) {
        throw userUtils.INVALID_CREDENTIALS;
    }
}