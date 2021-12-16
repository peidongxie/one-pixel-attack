import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import type { FC } from 'react';
import { RecoilRoot } from 'recoil';
import MainBody from './components/main-body';
import StickyFooter from './components/sticky-footer';
import TopBar from './components/top-bar';
import theme from './utils/theme';

interface AppProps {
  [key: string]: never;
}

const App: FC<AppProps> = () => {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar />
        <MainBody />
        <StickyFooter />
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;