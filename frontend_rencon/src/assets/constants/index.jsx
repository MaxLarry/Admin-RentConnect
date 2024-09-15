import { MdSpaceDashboard, MdHomeWork, MdPeople, MdSecurity, MdMail, MdHistory } from "react-icons/md";
import { GrCompliance } from "react-icons/gr";
import { RiSettings3Fill } from "react-icons/ri";
import { IoHelpCircle } from "react-icons/io5";
import withAuth from '../../assets/components/auth/withAuth';
import ListingManagement from '../../assets/components/routes/listmanagement/listingManagement';
import ActivityLogs from '../../assets/components/routes/activitylogs/ActivityLogs';

const ProtectedListManage = withAuth(ListingManagement);

export const links = [
    {
        to: "/dashboard",
        icon: MdSpaceDashboard,
        text: "Dashboard"
    },
    {
        to: "/listing-management",
        icon: MdHomeWork,
        text: "Listing Management"
    },
    {
        to: "/user-management",
        icon: MdPeople,
        text: "User Management"
    },
    {
        to: "/compliance-safety",
        icon: GrCompliance,
        text: "Compliance & Safety"
    },
    {
        to: "/inbox",
        icon: MdMail,
        text: "Inbox"
    },
    {
        to: "/activity-logs",
        icon: MdHistory,
        text: "Activity Logs"
    },
];


export const support = [
    {
        to: "#",
        icon: RiSettings3Fill,
        text: "Setting"
    },
    {
        to: "#",
        icon: IoHelpCircle,
        text: "Help"
    },
];
