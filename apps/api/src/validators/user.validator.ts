import { RegisterDto } from "../dto/user.dto";
import { getUserFromEmail, getUserFromUsername } from "src/database/crud/user.crud";
import * as userUtils from "../utils/user.utils";

export async function registerValidator(userRegister: RegisterDto) {
    if (!userUtils.validatePassword(userRegister.password)){
        throw userUtils.INVALID_PASSWORD_EXCEPTION;
    }

    if(!userUtils.isValidEmail(userRegister.email)){
        throw userUtils.INVALID_EMAIL_ADDRESS;
    }

    // Query username in use.
    const userFromUsername = await getUserFromUsername(userRegister.username);
    if(userFromUsername != null){
        throw userUtils.USERNAME_ALREADY_IN_USE;
    }
    
    // Query email in use.
    const userFromEmail = await getUserFromEmail(userRegister.email);
    if(userFromEmail != null){
        throw userUtils.EMAIL_ALREADY_IN_USE;
    }
    
    return true;
}
