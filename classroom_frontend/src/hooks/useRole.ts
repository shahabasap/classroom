import React from "react";
import { RoleContext } from "../context/RoleProvider";

function useRole(){
    const context = React.useContext(RoleContext);
    if(context==undefined){
        throw new Error('User role must be used within a RoleProvider')
    }

    return context;
}

export default useRole;