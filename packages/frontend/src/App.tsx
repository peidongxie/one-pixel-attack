import type { FC } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Button color='primary' variant='contained'>
        {'Hello World'}
      </Button>
    </ThemeProvider>
  );
};

export default App;
