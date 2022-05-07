import fragmentShaderSourceV1 from './webgl-fragment.glsl';
import vertexShaderSourceV1 from './webgl-vertex.glsl';
import fragmentShaderSourceV2 from './webgl2-fragment.glsl';
import vertexShaderSourceV2 from './webgl2-vertex.glsl';

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

type CacheOfWebGL = [
  Record<string, AttributeSetter>,
  Record<string, UniformSetter>,
];

const getShaderSource = (
  context: WebGLRenderingContext | WebGL2RenderingContext,
): [string, string] => {
  if (context instanceof WebGLRenderingContext) {
    return [vertexShaderSourceV1, fragmentShaderSourceV1];
  }
  if (context instanceof WebGL2RenderingContext) {
    return [vertexShaderSourceV2, fragmentShaderSourceV2];
  }
  return ['', ''];
};

const createAndCompileShader = (
  context: WebGLRenderingContext | WebGL2RenderingContext,
  type: GLenum,
  source: string,
): WebGLShader => {
  const shader = context.createShader(type);
  if (!shader) throw 'cannot create shader';
  context.shaderSource(shader, source);
  context.compileShader(shader);
  const success = context.getShaderParameter(shader, context.COMPILE_STATUS);
  if (!success) {
    const log = context.getShaderInfoLog(shader);
    context.deleteShader(shader);
    throw log;
  }
  return shader;
};

const createAndLinkProgram = (
  context: WebGLRenderingContext | WebGL2RenderingContext,
): WebGLProgram => {
  const program = context.createProgram();
  if (!program) throw 'cannot create program';
  const [vertexShaderSource, fragmentShaderSource] = getShaderSource(context);
  const vertexShader = createAndCompileShader(
    context,
    context.VERTEX_SHADER,
    vertexShaderSource,
  );
  const fragmentShader = createAndCompileShader(
    context,
    context.FRAGMENT_SHADER,
    fragmentShaderSource,
  );
  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);
  const success = context.getProgramParameter(program, context.LINK_STATUS);
  if (!success) {
    const log = context.getProgramInfoLog(program);
    context.deleteProgram(program);
    throw log;
  }
  return program;
};

const createAttributeSetters = (
  context: WebGLRenderingContext | WebGL2RenderingContext,
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
  context: WebGLRenderingContext | WebGL2RenderingContext,
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
  context: WebGLRenderingContext | WebGL2RenderingContext,
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
  context: WebGLRenderingContext | WebGL2RenderingContext,
  image: ImageData,
): WebGLTexture => {
  const texture = context.createTexture();
  if (!texture) throw 'cannot create texture';
  context.bindTexture(context.TEXTURE_2D, texture);
  context.texParameteri(
    context.TEXTURE_2D,
    context.TEXTURE_WRAP_S,
    context.CLAMP_TO_EDGE,
  );
  context.texParameteri(
    context.TEXTURE_2D,
    context.TEXTURE_WRAP_T,
    context.CLAMP_TO_EDGE,
  );
  context.texParameteri(
    context.TEXTURE_2D,
    context.TEXTURE_MIN_FILTER,
    context.NEAREST,
  );
  context.texParameteri(
    context.TEXTURE_2D,
    context.TEXTURE_MAG_FILTER,
    context.NEAREST,
  );
  context.texImage2D(
    context.TEXTURE_2D,
    0,
    context.RGBA,
    context.RGBA,
    context.UNSIGNED_BYTE,
    image,
  );
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

const drawWithWebGL = (
  context: WebGLRenderingContext | WebGL2RenderingContext,
  image: ImageData,
  cache?:
    | [Record<string, AttributeSetter>, Record<string, UniformSetter>]
    | undefined,
): [Record<string, AttributeSetter>, Record<string, UniformSetter>] => {
  const { width, height } = image;
  const currentProgram = context.getParameter(context.CURRENT_PROGRAM);
  const currentAttributeSetters = cache?.[0];
  const currentUniformSetters = cache?.[1];
  const program: WebGLProgram = currentProgram || createAndLinkProgram(context);
  const attributeSetters =
    (currentProgram && currentAttributeSetters) ||
    createAttributeSetters(context, program);
  const uniformSetters =
    (currentProgram && currentUniformSetters) ||
    createUniformSetters(context, program);
  if (!currentProgram) context.useProgram(program);
  context.viewport(0, 0, width, height);
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
  return [attributeSetters, uniformSetters];
};

export { drawWithWebGL as default, type CacheOfWebGL };
