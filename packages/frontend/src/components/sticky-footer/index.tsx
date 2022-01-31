import {
  Container,
  Typography,
  styled,
  type ContainerProps,
} from '@material-ui/core';
import { type FC } from 'react';
import Copyright from '../copyright';
import AuthorLink from '../author-link';

interface StickyFooterProps {
  [key: string]: never;
}

const StyledContainer = styled((props: ContainerProps) => (
  <Container component={'footer'} {...props} />
))(({ theme }) => ({
  padding: theme.spacing(3, 2),
  backgroundColor: theme.palette.grey[100],
  textAlign: 'center',
}));

const StickyFooter: FC<StickyFooterProps> = () => {
  return (
    <StyledContainer maxWidth={false}>
      <Typography variant={'body2'} color={'textSecondary'}>
        <Copyright startYear={2019} /> <AuthorLink />
      </Typography>
    </StyledContainer>
  );
};

export { StickyFooter as default };
