
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_AUTH_CLIENT_ID } from "./constants/env";

import { store, persistor } from './store/store.ts'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { StyledEngineProvider } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles';
import theme from './utils/themes.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={GOOGLE_AUTH_CLIENT_ID}>
    {/* <React.StrictMode> */}
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    {/* </React.StrictMode> */}
  </GoogleOAuthProvider>
)
