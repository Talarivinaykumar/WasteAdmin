import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useMockData } from '../../context/MockDataContext';
import Badge from '@mui/material/Badge';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'; // Products
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'; // Seller Verification
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded'; // Reports
import WebRoundedIcon from '@mui/icons-material/WebRounded'; // CMS
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'; // Dot for sub-items

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <HomeRoundedIcon />, path: '/dashboard' },
  {
    text: 'User Management',
    icon: <PeopleRoundedIcon />,
    children: [
      { text: 'All Users', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/users/all' },
      { text: 'Buyers', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/users/buyers' },
      { text: 'Sellers', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/users/sellers' },
      { text: 'Blocked Users', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/users/blocked' },
    ],
  },
  {
    text: 'Category Management',
    icon: <CategoryRoundedIcon />,
    children: [
      { text: 'Main Categories', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/categories/main' },
      { text: 'Sub Categories', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/categories/sub' },
      { text: 'Spec Master', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/categories/specs' },
    ],
  },
  {
    text: 'Product Management',
    icon: <Inventory2RoundedIcon />,
    children: [
      { text: 'Pending', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/products/pending' },
      { text: 'Approved', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/products/approved' },
      { text: 'Rejected', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/products/rejected' },
      { text: 'Blocked', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/products/blocked' },
    ],
  },
  {
    text: 'Seller Verification',
    icon: <VerifiedUserRoundedIcon />,
    children: [
      { text: 'Pending', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/verification/pending' },
      { text: 'Approved', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/verification/approved' },
      { text: 'Rejected', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/verification/rejected' },
    ],
  },
  {
    text: 'Reports & Complaints',
    icon: <ReportProblemRoundedIcon />,
    children: [
      { text: 'Reported Products', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/reports/products' },
      { text: 'Reported Users', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/reports/users' },
    ],
  },
  {
    text: 'CMS Management',
    icon: <WebRoundedIcon />,
    children: [
      { text: 'Banners', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/cms/banners' },
      { text: 'Featured Products', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/cms/featured' },
      { text: 'Static Pages', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/cms/static' },
      { text: 'Ads Management', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/cms/ads' },
    ],
  },
  {
    text: 'Notifications',
    icon: <NotificationsRoundedIcon />,
    children: [
      { text: 'Send Notification', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/notifications/send' },
      { text: 'History', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/notifications/history' },
    ],
  },
  {
    text: 'Locations',
    icon: <LocationOnRoundedIcon />,
    children: [
      { text: 'States', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/locations/states' },
      { text: 'Cities', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/locations/cities' },
    ],
  },
  {
    text: 'Analytics',
    icon: <AnalyticsRoundedIcon />,
    children: [
      { text: 'Activity Logs', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/analytics/activity' },
      { text: 'Approval Logs', icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, path: '/dashboard/analytics/approvals' },
    ],
  },
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/dashboard/settings' },
];

export default function MenuContent({ mini = false }: { mini?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats } = useMockData();
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});

  const handleToggle = (text: string) => {
    if (mini) return; // Don't toggle sections in mini mode
    setOpenSections((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={item.path ? location.pathname === item.path : false}
                onClick={() => item.children ? handleToggle(item.text) : handleNavigation(item.path!)}
                sx={{ justifyContent: mini ? 'center' : 'initial', px: mini ? 1 : 2.5 }}
              >
                <ListItemIcon sx={{ minWidth: mini ? 0 : 40, justifyContent: 'center' }}>
                  {item.text === 'Product Management' && stats.pendingApprovals > 0 && !mini ? (
                    <Badge badgeContent={stats.pendingApprovals} color="error" sx={{ mr: 2 }}>
                       {item.icon}
                    </Badge>
                  ) : item.text === 'Seller Verification' && stats.pendingApprovals > 0 && !mini ? ( // Assuming reused for now or add specific stat
                    <Badge variant="dot" color="primary" sx={{ mr: 2 }}>
                       {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {!mini && <ListItemText primary={item.text} />}
                {!mini && item.children ? (openSections[item.text] ? <ExpandLess /> : <ExpandMore />) : null}
              </ListItemButton>
            </ListItem>

            {!mini && item.children && (
              <Collapse in={openSections[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child, childIndex) => (
                    <ListItemButton
                      key={childIndex}
                      sx={{ pl: 4 }}
                      selected={location.pathname === child.path}
                      onClick={() => handleNavigation(child.path!)}
                    >
                      <ListItemIcon sx={{ minWidth: 24 }}>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Stack>
  );
}
