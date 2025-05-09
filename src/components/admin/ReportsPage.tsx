import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState('weekly');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-01-07',
  });

  const handlePeriodChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setReportPeriod(e.target.value as string);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const dummyData = [
    { date: '2025-01-01', sales: 400 },
    { date: '2025-01-02', sales: 450 },
    { date: '2025-01-03', sales: 470 },
    { date: '2025-01-04', sales: 500 },
    { date: '2025-01-05', sales: 550 },
    { date: '2025-01-06', sales: 600 },
    { date: '2025-01-07', sales: 650 },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, color: 'black' }}>
        Reports Dashboard
      </Typography>

      {/* Date Filter Section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Report Period</InputLabel>
            <Select value={reportPeriod} onChange={handlePeriodChange} label="Report Period">
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Date Picker Section */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Start Date"
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="End Date"
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>

      {/* Report Data */}
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Sales Report (from {dateRange.startDate} to {dateRange.endDate})
        </Typography>

        {/* Sales Line Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dummyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2}/>
          </LineChart>
        </ResponsiveContainer>

        {/* Buttons */}
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={() => alert('Export to PDF')}>
            Export PDF
          </Button>
          <Button variant="outlined" sx={{ ml: 2 }} onClick={() => alert('Export to CSV')}>
            Export CSV
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
