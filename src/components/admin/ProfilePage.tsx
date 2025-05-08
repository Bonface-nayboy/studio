import { Box, Typography } from '@mui/material'
import React from 'react'

export default function ProfilePage() {
  return (
    <Box>
        <Typography variant="h4" sx={{ mb: 2, color: '#fff' }}>
            Profile Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#fff' }}>
            This is the profile page where you can view and edit your profile information.
        </Typography>
        <Typography variant="body1" sx={{ color: '#fff' }}>
            You can also change your password and update your email address.
        </Typography>
        <Typography variant="body1" sx={{ color: '#fff' }}>
            If you have any questions, please contact support.
        </Typography>
    </Box>
  )
}
