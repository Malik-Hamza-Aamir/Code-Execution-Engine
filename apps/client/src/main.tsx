import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { routerInstance } from './routes/router';
import { BrowserRouter } from 'react-router-dom'
import App from './app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <App router={routerInstance} />
    </BrowserRouter>
  </StrictMode>
);
