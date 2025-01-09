interface EmailValidator {
    (email: string|undefined): boolean;
  }

export const validEmail:EmailValidator = (email:string|undefined)=>{
    const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ;
    if(email && emailRegex.test(email)) return false;
    return true;
}

export const validName = (name:string|undefined)=>{
    if(!name || name.length<3 ) return true
    return false
}


export const validPassword = (password:string|undefined)=>{
    const passwordRegex= new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@$&])[a-zA-Z\d!@$&]{6,}$/)
    if(!password || password.length<6 || !passwordRegex.test(password)) return true;
    return false;
}

export const passwordMatch = (password:string|undefined,confirmPassword:string|undefined) =>{
    return password!==confirmPassword;
}