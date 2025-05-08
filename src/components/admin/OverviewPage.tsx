import dynamic from 'next/dynamic';
import { Box, Card, Typography } from '@mui/material'
import { AccountBalance, TrendingUp, TrendingDown, Person, Message, ShoppingCartCheckout } from '@mui/icons-material'
import React from 'react'


const GraphPage = dynamic(() => import('./analytics/graph'), { ssr: false });

export default function OverviewPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 2, color: 'black' }}>
                Hi, Welcome back
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {/* Sales Summary */}
                <Card sx={{
                    p: 2, width: 260, backgroundColor: 'white', borderRadius: 2, boxShadow: 3, transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: 6,
                        cursor: 'pointer'
                    }
                }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <AccountBalance sx={{ fontSize: 40, color: '#3b82f6', mr: 1 }} />
                        <Typography variant="h6">Sales Summary</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography color="text.secondary">Weekly Sales</Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <TrendingUp sx={{ color: 'green' }} />
                            <Typography color="green">Ksh 50,000</Typography>
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">Monthly Sales</Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <TrendingDown sx={{ color: 'red' }} />
                            <Typography color="red">Ksh 200,000</Typography>
                        </Box>
                    </Box>
                </Card>

                {/* Purchased Orders */}
                <Card sx={{
                    p: 2, width: 260, backgroundColor: 'white', borderRadius: 2, boxShadow: 3, transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: 6,
                        cursor: 'pointer'
                    }
                }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <ShoppingCartCheckout sx={{ fontSize: 40, color: '#3b82f6', mr: 1 }} />
                        <Typography variant="h6">Purchased Orders</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography color="text.secondary">Weekly Orders</Typography>
                        <Typography color="green">120</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">Monthly Orders</Typography>
                        <Typography color="green">480</Typography>
                    </Box>
                </Card>

                {/* Users */}
                <Card sx={{
                    p: 2, width: 270, backgroundColor: 'white', borderRadius: 2, boxShadow: 3, transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: 6,
                        cursor: 'pointer'
                    }
                }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Person sx={{ fontSize: 40, color: '#3b82f6', mr: 1 }} />
                        <Typography variant="h6">Users</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography color="text.secondary">New This Week</Typography>
                        <Typography color="#10b981">35</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">Total Users</Typography>
                        <Typography color="#0ea5e9">1,245</Typography>
                    </Box>
                </Card>

                {/* Messages */}
                <Card sx={{
                    p: 2, width: 260, backgroundColor: 'white', borderRadius: 2, boxShadow: 3, transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: 6,
                        cursor: 'pointer'
                    }
                }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Message sx={{ fontSize: 40, color: '#3b82f6', mr: 1 }} />
                        <Typography variant="h6">Messages</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography color="text.secondary">Unread</Typography>
                        <Typography color="red">15</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">Total Messages</Typography>
                        <Typography color="#6366f1">650</Typography>
                    </Box>
                </Card>
            </Box>
            <GraphPage />
        </Box>
    )
}
