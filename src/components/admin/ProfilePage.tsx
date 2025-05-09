// import { Box, Button, Card, TextField, Typography, Avatar } from '@mui/material';
import { Edit, Lock, Logout } from '@mui/icons-material';
import { Avatar, Box, Button, Card, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function AdminProfilePage() {
    const [userInfo, setUserInfo] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
        // profilePicture: 'https://www.w3schools.com/w3images/avatar2.png',
        profilePicture: 'https://gimgs2.nohat.cc/thumb/f/640/male-avatar-admin-profile--m2H7G6H7H7Z5G6m2.jpg',
        lastLogin: '2025-05-05 10:00:00',
    });

    const [editing, setEditing] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const router=useRouter();

    const handleChangePassword = () => {
        // Implement password change logic
        alert('Password changed');
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserInfo({ ...userInfo, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        setEditing(false);
        // Implement save logic for updated name or email
    };

    const handleLogout = () => {
        // Implement logout functionality
        localStorage.removeItem('authToken'); // Example for token-based auth
        // Redirect to login page
        router.push('adminpanel/login');
        alert('Logged out');
    };

    return (
        <Box sx={{ p: 4 }}>
            {/* Profile Header */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Avatar
                    alt="Profile Picture"
                    src={userInfo.profilePicture}
                    sx={{ width: 150, height: 150, mb: 2 }}
                />
                <Typography variant="h4" sx={{ mb: 1 }}>
                    {userInfo.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {userInfo.role}
                </Typography>
                <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    component="label"
                >
                    Change Profile Picture
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                    />
                </Button>
            </Box>

            {/* Account Information */}
            <Card sx={{ p: 3, mb: 3, backgroundColor: '#f9fafb', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Account Information
                </Typography>
                <TextField
                    label="Name"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    variant="outlined"
                    fullWidth
                    disabled={!editing}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    variant="outlined"
                    fullWidth
                    disabled={!editing}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Phone"
                    value="+1234567890"
                    variant="outlined"
                    fullWidth
                    disabled
                    sx={{ mb: 2 }}
                />
                <Box display="flex" justifyContent="space-between">
                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => setEditing(!editing)}
                    >
                        {editing ? 'Cancel' : 'Edit'}
                    </Button>
                    {editing && (
                        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                    )}
                </Box>
            </Card>

            {/* Change Password */}
            <Card sx={{ p: 3, mb: 3, backgroundColor: '#f9fafb', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Change Password
                </Typography>
                <TextField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Lock />}
                    onClick={handleChangePassword}
                >
                    Change Password
                </Button>
            </Card>

            {/* Account Activity */}
            <Card sx={{ p: 3, backgroundColor: '#f9fafb', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Account Activity
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Last Login:</strong> {userInfo.lastLogin}
                </Typography>
                <Typography variant="body1">
                    <strong>Recent Updates:</strong> Profile updated on {userInfo.lastLogin}
                </Typography>
            </Card>

            {/* Logout */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Logout />}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );
}
