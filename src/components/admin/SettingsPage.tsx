import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function SettingsPage() {
  const [themeMode, setThemeMode] = useState(true);
  const [language, setLanguage] = useState('en');
  const [siteTitle, setSiteTitle] = useState('ReesShop');
  const [notifications, setNotifications] = useState(true);
  const [username, setUsername] = useState('admin');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [twoFA, setTwoFA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(15);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);

  const handleSave = () => {
    alert('Settings saved!');
  };

  const isAdmin = true; // You can replace this with actual role check

  return (
    <Box>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>General Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Site Title"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Language</InputLabel>
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch checked={themeMode} onChange={() => setThemeMode(!themeMode)} />}
            label="Dark Mode"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Account Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Change Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={<Switch checked={notifications} onChange={() => setNotifications(!notifications)} />}
            label="Enable Notifications"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Security Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={<Switch checked={twoFA} onChange={() => setTwoFA(!twoFA)} />}
            label="Enable Two-Factor Authentication"
          />
          <TextField
            label="Session Timeout (minutes)"
            type="number"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(Number(e.target.value))}
            fullWidth
            sx={{ mt: 2 }}
          />
          {/* Simulate Active Sessions Display */}
          <Typography sx={{ mt: 2 }}>
            Active Sessions: 2 (Current device + Chrome on Windows)
          </Typography>
        </AccordionDetails>
      </Accordion>

      {isAdmin && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Admin Controls</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Switch
                  checked={registrationEnabled}
                  onChange={() => setRegistrationEnabled(!registrationEnabled)}
                />
              }
              label="Enable New User Registration"
            />
            <Button variant="outlined" sx={{ mt: 2, mr: 2 }} onClick={() => alert('System reset!')}>
              Reset System Defaults
            </Button>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => alert('Database export started!')}>
              Export Database Backup
            </Button>
          </AccordionDetails>
        </Accordion>
      )}

      <Button variant="contained" sx={{ mt: 4 }} onClick={handleSave}>
        Save Changes
      </Button>
    </Box>
  );
}
