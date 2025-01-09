import React, { createContext, useContext, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import useRole from '../hooks/useRole';
import { useAppSelector } from '../store/store';

interface SidebarContextType {
    expanded: boolean;
}

interface SidebarProps {
    children: React.ReactNode;
}

const SidebarContext = createContext<SidebarContextType>({
    expanded: true
})

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    const [expanded, setExpanded] = useState(true);
    const role = useRole();
    const classroom =
        useAppSelector(state => role == 'student' ?
            state.studentClassroom.classroom :
            state.teacherClassroom.classroom)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setExpanded(false)
            } else {
                setExpanded(true)
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.addEventListener('resize', handleResize)
        }
    }, [])

    return (
        <>
            <aside className={`h-auto left-0 inline-block  transition-all   ${expanded ? "p-2" : "w-16"}`}>
                <nav className="h-full flex flex-col  rounded-md  border-2 border-gray-200 shadow-lg ">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <h1 className={`overflow-hidden transition-all uppercase text-costume-primary-color text-xl font-extrabold 
                        ${expanded ? "w-full" : "w-0"}`}>{classroom?.subject}</h1>
                        <button
                            onClick={() => setExpanded((curr) => !curr)}
                            className="p-1.5 rounded-lg  hover:bg-gray-100 text-costume-primary-color">
                            {expanded ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex flex-col  flex-1 px-3">{children}</ul>
                    </SidebarContext.Provider>
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;



interface SidebarItemProps {
    icon: React.ReactNode;
    text: string;
    active?: boolean;
    alert?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, active, alert }) => {

    const { expanded } = useContext(SidebarContext)

    return (
        <>
            <li className={`relative flex items-center py-2 px-2 my-1 font-md rounded-md cursor-pointer transition-colors group
            ${active ? "bg-costume-primary-color text-costume-secondary-color"
                    : "hover:bg-indigo-50 text-gray-600"}`}>
                {icon}
                <span className={` overflow-hidden whitespace-nowrap transition-all
                ${expanded ? " ml-3" : "w-0 ml-0"}`}>{text}</span>
                {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-red-500
                ${expanded ? "" : "top-2 "}`}></div>}
                {!expanded &&
                    <div className={`absolute left-full rounded-md px-2 py-1 ml-6
                bg-indigo-100 text-indigo-800 text-sm
                invisible opacity-20 -translate-x-3 transition-all group-hover:visible 
                group-hover:opacity-100 group-hover:translate-x-0`}>{text}</div>}
            </li>

        </>
    )
}

