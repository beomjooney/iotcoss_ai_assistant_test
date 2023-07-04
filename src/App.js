import React from 'react';
import AppRoutes from './routes/Routes';
import { AppProvider } from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';
import { QueryClient, QueryClientProvider } from 'react-query';
import '_App.css';
const queryClient = new QueryClient();

const App = () => {
  return (
    <AppProvider i18n={en}>
      <QueryClientProvider client={queryClient}>
        <div>
          <AppRoutes />
        </div>
      </QueryClientProvider>
    </AppProvider>
  );
};

export default App;
