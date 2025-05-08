import { Box, Typography } from '@mui/material'
import React from 'react'
import LoginAdminPage from '../../../components/admin/analytics/login'
import RegisterAdminPage from '@/components/admin/analytics/register'

export default function ReesAdminPage() {
    return (
        <Box>
           
            <LoginAdminPage/>
            <RegisterAdminPage/>
        </Box>
    )
}
