import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Auth0ProviderWithNavigate from './auth/Auth0ProviderWithNavigate';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from './components/ui/sonner';
import { Provider } from 'react-redux';
import { store, persistor } from './statemgmt/store';
import { GlobalAnimation } from './animotion/GlobalAnimation';
import { PersistGate } from 'redux-persist/integration/react';

const queryClient = new QueryClient({
  defaultOptions:{
    queries: {
      refetchOnWindowFocus: false,
    },
  }
})


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <QueryClientProvider client={queryClient}>
            <Auth0ProviderWithNavigate>
              <GlobalAnimation>
                <AppRoutes />
              </GlobalAnimation>
            <Toaster visibleToasts={1} position='top-right' richColors/>
            </Auth0ProviderWithNavigate>
          </QueryClientProvider>
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
