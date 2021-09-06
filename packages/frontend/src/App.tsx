import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import type { FC } from 'react';
import TopBar from './components/top-bar';
import theme from './utils/theme';

interface AppProps {
  [key: string]: never;
}

const App: FC<AppProps> = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar />
    </ThemeProvider>
  );
};

export default App;
