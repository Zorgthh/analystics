import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, Container, Grid, Paper, Typography, Select, MenuItem, 
  Button, Card, CardContent, IconButton, FormControlLabel, Switch, Tooltip as MuiTooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [dateRange, setDateRange] = useState('week');
  const [showRealTime, setShowRealTime] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [data, setData] = useState([
    { 
      date: '2023-01-01', 
      temperature: 22.5, 
      humidity: 65, 
      energy_consumption: 280.5,
      air_quality: 95,
      solar_power: 4.2,
      wind_speed: 12
    },
    { date: '2023-01-02', temperature: 23.1, humidity: 68, energy_consumption: 295.2 },
    { date: '2023-01-03', temperature: 21.8, humidity: 70, energy_consumption: 310.7 }
  ]);

  const fetchData = async () => {
    try {
      const newData = [
        { 
          date: '2023-01-01', 
          temperature: Math.random() * 10 + 20,
          humidity: Math.random() * 20 + 50,
          energy_consumption: Math.random() * 100 + 200,
          air_quality: Math.random() * 20 + 80,
          solar_power: Math.random() * 5,
          wind_speed: Math.random() * 15
        },
        { 
          date: '2023-01-02', 
          temperature: Math.random() * 10 + 20,
          humidity: Math.random() * 20 + 50,
          energy_consumption: Math.random() * 100 + 200
        },
        { 
          date: '2023-01-03', 
          temperature: Math.random() * 10 + 20,
          humidity: Math.random() * 20 + 50,
          energy_consumption: Math.random() * 100 + 200
        }
      ];
      setData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    if (showRealTime) {
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [showRealTime]);

  const getStats = () => {
    const temps = data.map(d => d.temperature).filter(temp => temp !== undefined);
    const humidity = data.map(d => d.humidity).filter(hum => hum !== undefined);
    return {
      temperature: {
        avg: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
        max: Math.max(...temps),
        min: Math.min(...temps)
      },
      humidity: {
        avg: (humidity.reduce((a, b) => a + b, 0) / humidity.length).toFixed(1),
        max: Math.max(...humidity),
        min: Math.min(...humidity)
      }
    };
  };

  const QuickStatCard = ({ title, value, trend, unit }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>{title}</Typography>
        <Typography variant="h4" component="div">
          {value}{unit}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {trend > 0 ? 
            <TrendingUpIcon color="success" /> : 
            <TrendingDownIcon color="error" />}
          <Typography color={trend > 0 ? "success.main" : "error.main"}>
            {Math.abs(trend)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const lineChartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Temperature',
        data: data.map(d => d.temperature),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.1)'
      },
      {
        label: 'Humidity',
        data: data.map(d => d.humidity),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.1)'
      }
    ]
  };

  const barChartData = {
    labels: data.map(d => d.date),
    datasets: [{
      label: 'Energy Consumption',
      data: data.map(d => d.energy_consumption),
      backgroundColor: 'rgb(75, 192, 192)'
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Analytics Dashboard'
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4">Analytics Dashboard</Typography>
                <Typography color="textSecondary">Welcome, {currentUser?.email}</Typography>
              </Box>
              <Box>
                <FormControlLabel
                  control={<Switch checked={showRealTime} onChange={(e) => setShowRealTime(e.target.checked)} />}
                  label="Real-time Updates"
                />
                <Button variant="outlined" color="error" onClick={logout} sx={{ ml: 2 }}>
                  Logout
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="day">Last 24 Hours</MenuItem>
                    <MenuItem value="week">Last Week</MenuItem>
                    <MenuItem value="month">Last Month</MenuItem>
                  </Select>
                </Grid>
                <Grid item>
                  <Select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="all">All Metrics</MenuItem>
                    <MenuItem value="temperature">Temperature</MenuItem>
                    <MenuItem value="humidity">Humidity</MenuItem>
                    <MenuItem value="energy">Energy</MenuItem>
                  </Select>
                </Grid>
                <Grid item>
                  <MuiTooltip title="Refresh Data">
                    <IconButton onClick={fetchData}>
                      <RefreshIcon />
                    </IconButton>
                  </MuiTooltip>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <QuickStatCard 
              title="Average Temperature" 
              value={getStats().temperature.avg} 
              trend={2.5}
              unit="°C"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <QuickStatCard 
              title="Average Humidity" 
              value={getStats().humidity.avg} 
              trend={-1.2}
              unit="%"
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Temperature and Humidity Trends</Typography>
              <Line data={lineChartData} options={chartOptions} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Energy Distribution</Typography>
              <Bar data={barChartData} options={chartOptions} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;