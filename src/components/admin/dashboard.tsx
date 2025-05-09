
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    ListItemButton
} from '@mui/material'
import React, { useState } from 'react'

import DashboardIcon from '@mui/icons-material/Dashboard'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import GroupIcon from '@mui/icons-material/Group'
import SettingsIcon from '@mui/icons-material/Settings'
import BarChartIcon from '@mui/icons-material/BarChart'
import NotificationsIcon from '@mui/icons-material/Notifications'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import CashierPage from '@/app/cashier/page'
import UsersPage from './Users'
import SettingsPage from './SettingsPage'
import ReportsPage from './ReportsPage'
import ProfilePage from './ProfilePage'
import OverviewPage from './OverviewPage'
import ProductPopupForm from '@/app/(main)/ecommerce/create/page'
import { useRouter } from 'next/navigation'

const AdminPanel = [
    { title: 'Overview', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { title: 'Products', icon: <Inventory2Icon />, path: '/admin/products' },
    { title: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/orders' },
    { title: 'Users', icon: <GroupIcon />, path: '/admin/users' },
    { title: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
    { title: 'Reports', icon: <BarChartIcon />, path: '/admin/reports' },
    { title: 'Profile', icon: <AccountCircleIcon />, path: '/admin/profile' },
    { title: 'Logout', icon: <LogoutIcon />, path: '/admin/logout' }
]

export default function Dashboard() {
    const [selected, setSelected] = useState('Overview');
    const router = useRouter();

    const renderPageContent = () => {
        switch (selected) {
            case 'Products':
                return <ProductPopupForm />
            case 'Orders':
                return <CashierPage />
            case 'Users':
                return <UsersPage />
            case 'Settings':
                return <SettingsPage />
            case 'Reports':
                return <ReportsPage />
            case 'Profile':
                return <ProfilePage />
            case 'Overview':
            default:
                return <OverviewPage />
        }
    }

    const handleLogout = () => {
        // Clear session data (localStorage, cookies, etc.)
        localStorage.removeItem('authToken'); // Example for token-based auth
        // Redirect to login page
        router.push('adminpanel/login');
        alert('Logged out');
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#111827', justifyContent: 'space-between' }}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: '280px',
                    height: '100vh',
                    backgroundColor: '#1f2937',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 2,
                    mt: 10,
                    position: 'fixed',         // stays in place
                    top: 0,
                    left: 0,
                    zIndex: 1000
                }}
            >
                {/* Branding */}
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Admin Dashboard
                </Typography>

                {/* Navigation List */}
                <List>
                    {AdminPanel.map((item, index) => (
                        <ListItemButton
                            key={index}
                            onClick={() => {
                                if (item.title === 'Logout') {
                                    handleLogout(); // Call handleLogout for Logout option
                                } else {
                                    setSelected(item.title); // Normal navigation for other items
                                }
                            }}
                            sx={{
                                borderRadius: '8px',
                                mb: 1,
                                backgroundColor: selected === item.title ? '#6366f1' : 'transparent',
                                color: selected === item.title ? '#fff' : '#cbd5e1',
                                '&:hover': {
                                    backgroundColor: '#374151'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    ))}

                </List>


                {/* Optional footer or promotion */}
                <Paper
                    variant="outlined"
                    sx={{
                        mt: 2,
                        p: 1,
                        backgroundColor: '#111827',
                        color: '#9ca3af',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="body2">
                        Need help? Contact support.
                    </Typography>
                </Paper>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: '#f3f4f6',
                    marginLeft: '280px',         // pushes main content to the right
                    width: 'calc(100% - 280px)', // optional: prevents overflow
                    minHeight: '100vh'           // ensures full height
                }}
            >

                {renderPageContent()}
            </Box>
        </Box>
    )
}
