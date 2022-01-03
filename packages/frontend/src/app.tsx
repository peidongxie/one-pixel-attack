import { CssBaseline } from '@material-ui/core';
import { type FC } from 'react';
import { RecoilRoot } from 'recoil';
import MainBody from './components/main-body';
import StickyFooter from './components/sticky-footer';
import TopBar from './components/top-bar';
import ThemeProvider from './utils/theme';

interface AppProps {
  [key: string]: never;
}

const App: FC<AppProps> = () => {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <CssBaseline />
        <TopBar />
        <MainBody />
        <StickyFooter />
      </ThemeProvider>
    </RecoilRoot>
  );
};

export { App as default };
