// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles'; 

import { Navigate, useRoutes } from 'react-router-dom';
// components
/* import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart'; */

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
     {/*  <ScrollToTop /> */}
      <GlobalStyles />
     {/*  <BaseOptionChartStyle /> */}
     {/* <Navigate to="/dashboard/app" replace /> */}
      <Router />
    </ThemeConfig>
  );
}
