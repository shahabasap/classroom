import { NavLink } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import Sidebar from './Sidebar'
import SchoolIcon from '@mui/icons-material/School';
import ChatIcon from '@mui/icons-material/Chat';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CampaignIcon from '@mui/icons-material/Campaign';

import { SidebarItem } from './Sidebar'
import { useAppSelector } from '../store/store';
import useRole from '../hooks/useRole';
import toast from 'react-hot-toast';


const ClassroomNavBar = () => {
  const role = useRole()
  const [activeLink, setActiveLink] = useState('null');
  const [newAnnouncement, setNewAnnouncement] = useState(false)

  const classrood_id = useAppSelector(state => role == 'student' ?
    state.persistedData.studentDatas?.classroom_id :
    state.persistedData.teacherDatas?.classroom_id);

  const announcements = useAppSelector(state => role == 'student' ?
    state.studentClassroom.announcements :
    state.teacherClassroom.announcements);

  const prevAnnouncementLenref = useRef(announcements.length)

  useEffect(() => {
    if (announcements.length > prevAnnouncementLenref.current) {
      setNewAnnouncement(true)
      toast.success(`${announcements[0].content}`, {
        style: {
          border: '1px solid #007bff',
          padding: '16px',
          color: '#007bff',
          backgroundColor: '#E0F7FF',
        },
        iconTheme: {
          primary: '#007bff',
          secondary: '#E0F7FF',
        },
        duration: 5000
      })
    }
    prevAnnouncementLenref.current = announcements.length
  }, [announcements])

  const handleAnnouncementClick = () => {
    setActiveLink('announcements')
    setNewAnnouncement(false)
  }

  return (
    <>
      <Sidebar >
        <NavLink to={`${classrood_id}/summary`} onClick={() => setActiveLink('summary')}>
          <SidebarItem icon={<SchoolIcon />} text={"Summary"} active={activeLink === 'summary'} alert={false} />
        </NavLink>
        <NavLink to="chat" onClick={() => setActiveLink('chat')}>
          <SidebarItem icon={<ChatIcon />} text={"Chat Space"} active={activeLink === 'chat'} alert={false} />
        </NavLink>
        <NavLink to="live_class" onClick={() => setActiveLink('liveclass')}>
          <SidebarItem icon={<VideoCameraFrontIcon />} text={"Live Class"} active={activeLink === 'liveclass'} alert={false} />
        </NavLink>
        <NavLink to="exams" onClick={() => setActiveLink('exams')}>
          <SidebarItem icon={<NoteAltIcon />} text={"Exams"} alert={false} active={activeLink === 'exams'} />
        </NavLink>
        <NavLink to="materials" onClick={() => setActiveLink('materials')}>
          <SidebarItem icon={<AutoStoriesIcon />} text={"Materials"} alert={false} active={activeLink === 'materials'} />
        </NavLink>
        <NavLink to="works" onClick={() => setActiveLink('works')}>
          <SidebarItem icon={<AssignmentIcon />} text={"Works"} alert={false} active={activeLink === 'works'} />
        </NavLink>
        <NavLink to="announcements" onClick={handleAnnouncementClick}>
          <SidebarItem icon={<CampaignIcon />} text={"Announcements"} alert={newAnnouncement} active={activeLink === 'announcements'} />
        </NavLink>
      </Sidebar>
    </>
  )
}

export default ClassroomNavBar