import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import PageControl from './PageControl';
import ButtonControl from './ButtonControl';
import Layout from '../../layout/Layout';

const TabIndex = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {/* Tabs Component */}
        <Tabs value={tabValue} onChange={handleChange} aria-label="Management Tabs">
          <Tab label="Pages" />
          <Tab label="Buttons" />
        </Tabs>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <PageControl />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ButtonControl />
        </TabPanel>
      </div>
    </Layout>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default TabIndex;
