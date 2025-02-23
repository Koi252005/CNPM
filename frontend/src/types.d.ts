import { GridTypeMap } from '@mui/material';
import { ElementType } from 'react';

declare module '@mui/material/Grid' {
  interface GridProps {
    component?: ElementType;
  }
} 