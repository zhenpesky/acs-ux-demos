import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@patternfly/react-core/dist/styles/base.css'
import './styles/style.css'
import './styles/light.theme.css'
import './styles/dark.theme.css'
import './styles/acs.css'
import './styles/trumps.css'
import './styles/platform-navigation.css'
import './styles/typography-parity.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
