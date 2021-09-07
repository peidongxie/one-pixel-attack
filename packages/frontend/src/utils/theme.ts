import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import type { ThemeOptions } from '@material-ui/core/styles';

const fonts = [
  '-apple-system',
  'BlinkMacSystemFont',
  'PingFang SC',
  'Source Han Sans',
  'Segoe UI',
  'Microsoft Yahei',
  'WenQuanYi Micro Hei',
  'San Francisco',
  'Helvetica Neue',
  'Tahoma',
  'Aria',
  'sans-serif',
];

const themeOptions: ThemeOptions = {
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          width: '100%',
          height: '100%',
        },
        body: {
          width: '100%',
          height: '100%',
          fontFamily: fonts.join(', '),
        },
        '#root': {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        },
      },
    },
  },
};

const theme = responsiveFontSizes(createTheme(themeOptions));

export default theme;
