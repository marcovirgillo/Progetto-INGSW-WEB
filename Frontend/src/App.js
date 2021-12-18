import React from 'react'

import { Sidebar, Smallcomponent } from './components';

import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <>
      {/* <div className="sidebar">
        <Sidebar />
      </div> */}
      <div className="test-dark-mode-toggle">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Sidebar />
        </ThemeProvider>
      </div>
    </>
  )
}

export default App
