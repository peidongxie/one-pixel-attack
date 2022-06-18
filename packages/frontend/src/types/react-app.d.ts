declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare module '*.avif' {
  const src: string;
  export { src as default };
}

declare module '*.bmp' {
  const src: string;
  export { src as default };
}

declare module '*.gif' {
  const src: string;
  export { src as default };
}

declare module '*.jpg' {
  const src: string;
  export { src as default };
}

declare module '*.jpeg' {
  const src: string;
  export { src as default };
}

declare module '*.png' {
  const src: string;
  export { src as default };
}

declare module '*.webp' {
  const src: string;
  export { src as default };
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export { src as default };
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export { classes as default };
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export { classes as default };
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export { classes as default };
}

declare module '*.glsl' {
  const src: string;
  export { src as default };
}
