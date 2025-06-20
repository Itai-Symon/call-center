import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Styles.css'
import App from './App.tsx'

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
