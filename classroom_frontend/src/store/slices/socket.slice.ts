import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface SocketSliceInterface{
    onlineUsers:string[];
}

export type OnlineUsersType={
    onlineUsers:string[]
}

const initialState:SocketSliceInterface = {
    onlineUsers:[]
}



export const socketSlice = createSlice({
    name:'socket',
    initialState,
    reducers:{
        setOnlineUsers:(state,action:PayloadAction<OnlineUsersType>)=>{
            state.onlineUsers = action.payload.onlineUsers
        }
    }
});

export const {
    setOnlineUsers
} = socketSlice.actions;

export default socketSlice.reducer;