import { StrictMode } from 'react';
import { render } from 'react-dom';
import { register } from './utils/registration';
import App from './app';

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);

register();
