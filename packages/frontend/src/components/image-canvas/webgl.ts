type AttributeValue =
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

interface AttributeOption {
  buffer: WebGLBuffer;
  size?: number;
  type?: number;
  normalized?: boolean;
  stride?: number;
  offset?: number;
}

type AttributeSetter = (attribute: AttributeValue | AttributeOption) => void;

type UniformValue =
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

interface UniformOption {
  texture: WebGLTexture;
  unit?: number;
}

type UniformSetter = (uniform: UniformValue | UniformOption) => void;

const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_coordinate;
  uniform vec2 u_resolution;
  varying vec2 v_coordinate;
  void main() {
    gl_Position = vec4(((a_position / u_resolution) * 2.0 - 1.0) * vec2(1, -1), 0, 1);
    v_coordinate = a_coordinate;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_coordinate;
  void main() {
    gl_FragColor = texture2D(u_image, v_coordinate);
  }
`;

const createAndCompileShader = (
  context: WebGLRenderingContext,
  type: GLenum,
  source: string,
): WebGLShader => {
  const shader = context.createShader(type);
  if (!shader) throw 'cannot create shader';
  context.shaderSource(shader, source);
  context.compileShader(shader);
  const success = context.getShaderParameter(shader, context.COMPILE_STATUS);
  if (!success) throw context.getShaderInfoLog(shader);
  return shader;
};

const createAndLinkProgram = (
  context: WebGLRenderingContext,
  vertex: string | WebGLShader,
  fragment: string | WebGLShader,
): WebGLProgram => {
  const program = context.createProgram();
  if (!program) throw 'cannot create program';
  const vertexShader =
    typeof vertex === 'string'
      ? createAndCompileShader(context, context.VERTEX_SHADER, vertex)
      : vertex;
  const fragmentShader =
    typeof fragment === 'string'
      ? createAndCompileShader(context, context.FRAGMENT_SHADER, fragment)
      : fragment;
  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);
  const success = context.getProgramParameter(program, context.LINK_STATUS);
  if (!success) throw context.getProgramInfoLog(program);
  return program;
};

const createAttributeSetters = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
): Record<string, AttributeSetter> => {
  const setters: Record<string, AttributeSetter> = {};
  const n = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < n; i++) {
    const activeInfo = context.getActiveAttrib(program, i);
    if (activeInfo) {
      const name = activeInfo.name;
      const key = name;
      const location = context.getAttribLocation(program, name);
      setters[key] = (attribute) => {
        if (Array.isArray(attribute)) {
          context.disableVertexAttribArray(location);
          const method: `vertexAttrib${typeof attribute.length}fv` = `vertexAttrib${attribute.length}fv`;
          context[method](location, attribute);
        } else {
          context.enableVertexAttribArray(location);
          context.bindBuffer(context.ARRAY_BUFFER, attribute.buffer);
          context.vertexAttribPointer(
            location,
            attribute.size || 0,
            attribute.type || context.FLOAT,
            attribute.normalized || false,
            attribute.stride || 0,
            attribute.offset || 0,
          );
        }
      };
    }
  }
  return setters;
};

const createUniformSetters = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
): Record<string, UniformSetter> => {
  const setters: Record<string, UniformSetter> = {};
  const n = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const activeInfo = context.getActiveUniform(program, i);
    if (activeInfo) {
      const name = activeInfo.name;
      const key =
        name.substring(name.length - 3) === '[0]'
          ? name.substring(0, name.length - 3)
          : name;
      const location = context.getUniformLocation(program, name);
      setters[key] = (uniform) => {
        if (Array.isArray(uniform)) {
          const method: `uniform${typeof uniform.length}fv` = `uniform${uniform.length}fv`;
          context[method](location, uniform);
        } else {
          context.activeTexture(context.TEXTURE0 + (uniform.unit || 0));
          context.bindTexture(context.TEXTURE_2D, uniform.texture);
          context.uniform1i(location, uniform.unit || 0);
        }
      };
    }
  }
  return setters;
};

const createAndBindBuffer = (
  context: WebGLRenderingContext,
  data: number[],
): WebGLBuffer => {
  const buffer = context.createBuffer();
  if (!buffer) throw 'cannot create buffer';
  context.bindBuffer(context.ARRAY_BUFFER, buffer);
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array(data),
    context.STATIC_DRAW,
  );
  return buffer;
};

const createAndSetupTexture = (
  gl: WebGLRenderingContext,
  image: ImageData,
): WebGLTexture => {
  const texture = gl.createTexture();
  if (!texture) throw 'cannot create texture';
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  return texture;
};

const setAttributes = (
  setters: Record<string, AttributeSetter>,
  attributes: Record<string, AttributeValue | AttributeOption>,
) => {
  for (const key in attributes) {
    setters[key]?.(attributes[key]);
  }
};

const setUniforms = (
  setters: Record<string, UniformSetter>,
  uniforms: Record<string, UniformValue | UniformOption>,
) => {
  for (const key in uniforms) {
    setters[key]?.(uniforms[key]);
  }
};

const webglDraw = (context: WebGLRenderingContext, image: ImageData): void => {
  const { width, height } = image;
  const program = createAndLinkProgram(
    context,
    vertexShaderSource,
    fragmentShaderSource,
  );
  const attributeSetters = createAttributeSetters(context, program);
  const uniformSetters = createUniformSetters(context, program);
  context.useProgram(program);
  setAttributes(attributeSetters, {
    a_position: {
      buffer: createAndBindBuffer(context, [
        0,
        0,
        width,
        0,
        0,
        height,
        0,
        height,
        width,
        0,
        width,
        height,
      ]),
      size: 2,
    },
    a_coordinate: {
      buffer: createAndBindBuffer(
        context,
        [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0],
      ),
      size: 2,
    },
  });
  setUniforms(uniformSetters, {
    u_resolution: [width, height],
    u_image: {
      texture: createAndSetupTexture(context, image),
    },
  });
  context.drawArrays(context.TRIANGLES, 0, 6);
};

export { webglDraw as default };
