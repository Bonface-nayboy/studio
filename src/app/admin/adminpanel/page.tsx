"use client";
import MainLayout from '@/app/(main)/layout'
import Dashboard from '@/components/admin/dashboard';
import { Box, Typography } from '@mui/material'
import React from 'react'

export default function AdminPanel() {
  return (
    <MainLayout>
    <Box>
       <Dashboard/>
    </Box>
    </MainLayout>
  )
}

//src/app/admin/adminpanel/page.tsx