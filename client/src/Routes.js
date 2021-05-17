import Dashboard from './pages/dashboard';
import AddEvents from './pages/addevents';
import ViewEvents from './pages/viewevents';
import FavEvents from './pages/favevents';
import ToDo from './pages/todo';
import ForgotPassword from './auth/forgot-password';
import ResetPassword from './auth/reset-password';
import VerifyMail from './auth/verifyMail';
import PageNotFound from './pages/pagenotfound';
import HomePage from './pages/homepage';
import { FaHome } from 'react-icons/fa';
import { BiAddToQueue } from 'react-icons/bi';
import { IoEyeSharp } from 'react-icons/io5';

export const header = [
    {
        name:"Dashboard",
        path:"/user",
        icon: FaHome,
        component:Dashboard
    },
    {
        name:"Add Events",
        path:"/user/addevents",
        icon: BiAddToQueue,
        component:AddEvents
    },
    {
        name:"View Events",
        path:"/user/viewevents",
        icon: IoEyeSharp,
        component:ViewEvents
    },
];

export const others = [
    {
        path:"/",
        component:HomePage
    },
    {
        path:"/user/starred",
        component:FavEvents
    },
    {
        path:"/user/todos",
        component:ToDo
    },
    {
        path:"/user/forgot-password",
        component:ForgotPassword
    },
    {
        path:"/user/reset-password/:id/:token",
        component:ResetPassword
    },
    {
        path:"/user/first-set-password/verify/:password/:token",
        component:VerifyMail
    },
    {
        path:"*",
        component:PageNotFound
    },
];