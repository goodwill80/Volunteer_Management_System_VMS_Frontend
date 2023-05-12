import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from '@mui/material/styles';
import App from './App';
import AuthContextProvider from './Context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const root: any = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Initialise createTheme
const theme = createTheme({
  components: {
    MuiPopover: {
      defaultProps: {
        container: root,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: root,
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
          {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
