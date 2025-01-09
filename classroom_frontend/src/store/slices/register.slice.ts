import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface RegisterUser{
    email:string | null | undefined,
    id:string | null | undefined,
    role: string | null | undefined
}

export type RegisterUserType = RegisterUser | null;


const initialState : RegisterUserType = {
    email: null,
    id: null,
    role:null
}

export const RegisterSlice = createSlice({
    name: "userRegistry",
    initialState,
    reducers:{
        registerUser:(state,action:PayloadAction<RegisterUserType>)=>{
            state.email = action?.payload?.email,
            state.id = action?.payload?.id
        }
    }
})

export default RegisterSlice.reducer;

export const{registerUser} = RegisterSlice.actions