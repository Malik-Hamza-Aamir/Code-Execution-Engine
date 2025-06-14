import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { routerInstance } from './routes/router';

import App from './app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
      <App router={routerInstance} />
  </StrictMode>
);
