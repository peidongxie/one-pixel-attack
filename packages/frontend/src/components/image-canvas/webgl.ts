const createAndCompileShader = (
  gl: WebGLRenderingContext,
  type: GLenum,
  source: string,
): WebGLShader => {
  const shader = gl.createShader(type);
  if (!shader) throw 'cannot create shader';
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) throw gl.getShaderInfoLog(shader);
  return shader;
};

const createAndLinkProgram = (
  gl: WebGLRenderingContext,
  vertex: string | WebGLShader,
  fragment: string | WebGLShader,
) => {
  const program = gl.createProgram();
  if (!program) throw 'cannot create program';
  const vertexShader =
    typeof vertex === 'string'
      ? createAndCompileShader(gl, gl.VERTEX_SHADER, vertex)
      : vertex;
  const fragmentShader =
    typeof fragment === 'string'
      ? createAndCompileShader(gl, gl.FRAGMENT_SHADER, fragment)
      : fragment;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) throw gl.getProgramInfoLog(program);
  return program;
};

export { createAndCompileShader, createAndLinkProgram };
