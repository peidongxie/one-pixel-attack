const isPythonModule = (url) => {
  return url.startsWith('py://');
};

export const resolve = (specifier, context, nextResolve) => {
  const { parentURL = null } = context;
  if (isPythonModule(specifier)) {
    return {
      shortCircuit: true,
      url: specifier,
    };
  } else if (parentURL && isPythonModule(parentURL)) {
    return nextResolve(specifier, { parentURL: import.meta.url });
  }
  return nextResolve(specifier);
};

export const load = (url, context, nextLoad) => {
  if (isPythonModule(url)) {
    return {
      format: 'module',
      shortCircuit: true,
      source: `
        import boa from '@pipcook/boa';
        const moduleInstance = boa.import('${url.substring(5)}');
        export default moduleInstance;
      `,
    };
  }
  return nextLoad(url);
};
