import { Tabs, Tab, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const SectionTabs = ({ tabs }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const current = tabs.find((t) => location.pathname.startsWith(t.to))?.to || tabs[0].to;

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2 }}>
        <Tabs value={current} onChange={(e, value) => navigate(value)}>
          {tabs.map((t) => (
            <Tab key={t.to} label={t.label} value={t.to} />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};

export default SectionTabs;
