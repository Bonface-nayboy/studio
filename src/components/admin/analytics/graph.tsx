import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell,
    LineChart, Line
} from 'recharts';

const salesData = [
    { name: 'Jan', sales: 30000 },
    { name: 'Feb', sales: 50000 },
    { name: 'Mar', sales: 40000 },
    { name: 'Apr', sales: 60000 },
    { name: 'May', sales: 70000 },
    { name: 'Jun', sales: 80000 },
    { name: 'Jul', sales: 90000 },
    { name: 'Aug', sales: 100000 },
    { name: 'Sep', sales: 110000 },
    { name: 'Oct', sales: 120000 },
    { name: 'Nov', sales: 130000 },
    { name: 'Dec', sales: 140000 },
];

const usersData = [
    { name: 'Admin', value: 5 },
    { name: 'Customers', value: 25 },
    { name: 'Guests', value: 10 },
    { name: 'Vendors', value: 15 },
    { name: 'Suppliers', value: 20 },
    { name: 'Employees', value: 25 },
    { name: 'Managers', value: 10 },
    { name: 'cashier', value: 12 },
];

const ordersData = [
    { name: 'Week 1', orders: 100 },
    { name: 'Week 2', orders: 200 },
    { name: 'Week 3', orders: 150 },
    { name: 'Week 4', orders: 250 },
    { name: 'Week 5', orders: 300 },
    { name: 'Week 6', orders: 350 },
    { name: 'Week 7', orders: 400 },
    { name: 'Week 8', orders: 450 },
    { name: 'Week 9', orders: 500 },
    { name: 'Week 10', orders: 550 },
    { name: 'Week 11', orders: 600 },
    { name: 'Week 12', orders: 650 },
];

const pieColors = ['#3b82f6', '#10b981', '#f59e0b'];

const GraphPage = () => {
    return (
        <Box sx={{ p: 0 ,mt:4}}>
          

            <Grid container spacing={4}>
                {/* Bar Chart for Sales */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Monthly Sales (Ksh)
                        </Typography>
                        <BarChart width={510} height={300} data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#3b82f6" />
                        </BarChart>
                    </Paper>
                </Grid>

                {/* Pie Chart for Users */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            User Distribution
                        </Typography>
                        <PieChart width={510} height={300}>
                            <Pie
                                data={usersData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={100}
                                dataKey="value"
                            >
                                {usersData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </Paper>
                </Grid>

                {/* Line Chart for Orders */}
                <Grid item xs={12} mb={2}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Weekly Orders
                        </Typography>
                        <LineChart width={1100} height={300} data={ordersData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default GraphPage;
