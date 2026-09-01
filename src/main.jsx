import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('NTA public app root element was not found.');
}

const staticJournalPage = rootElement.querySelector('[data-static-journal="true"]');

if (!staticJournalPage) {
  rootElement.querySelector('[data-prerendered="true"]')?.remove();

  ReactDOM.createRoot(rootElement).render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>,
  );
}

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:beforeUpdate' }, '*');
  });
  import.meta.hot.on('vite:afterUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:afterUpdate' }, '*');
  });
}



