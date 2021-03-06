import { WebGLSurface } from '../webgl-surface';

function getProgramInfo(gl: WebGLRenderingContext, program: any) {
  const result = {
    attributeCount: 0,
    attributes: new Array(),
    uniformCount: 0,
    uniforms: new Array(),
  },

  activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS),
  activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

  // Taken from the WebGl spec:
  // Http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14
  const enums: {[key: number]: string} = {
    0x8B50: 'FLOAT_VEC2',
    0x8B51: 'FLOAT_VEC3',
    0x8B52: 'FLOAT_VEC4',
    0x8B53: 'INT_VEC2',
    0x8B54: 'INT_VEC3',
    0x8B55: 'INT_VEC4',
    0x8B56: 'BOOL',
    0x8B57: 'BOOL_VEC2',
    0x8B58: 'BOOL_VEC3',
    0x8B59: 'BOOL_VEC4',
    0x8B5A: 'FLOAT_MAT2',
    0x8B5B: 'FLOAT_MAT3',
    0x8B5C: 'FLOAT_MAT4',
    0x8B5E: 'SAMPLER_2D',
    0x8B60: 'SAMPLER_CUBE',
    0x1400: 'BYTE',
    0x1401: 'UNSIGNED_BYTE',
    0x1402: 'SHORT',
    0x1403: 'UNSIGNED_SHORT',
    0x1404: 'INT',
    0x1405: 'UNSIGNED_INT',
    0x1406: 'FLOAT',
  };

  const blocks: {[key: number]: number} = {
    0x8B50: 1,
    0x8B51: 1,
    0x8B52: 1,
    0x8B53: 1,
    0x8B54: 1,
    0x8B55: 1,
    0x8B56: 1,
    0x8B57: 1,
    0x8B58: 1,
    0x8B59: 1,
    0x8B5A: 1,
    0x8B5B: 3,
    0x8B5C: 4,
    0x8B5E: 1,
    0x8B60: 1,
    0x1400: 1,
    0x1401: 1,
    0x1402: 1,
    0x1403: 1,
    0x1404: 1,
    0x1405: 1,
    0x1406: 1,
  };

  // Loop through active uniforms
  for (let i = 0; i < activeUniforms; ++i) {
    const uniform: any = gl.getActiveUniform(program, i);
    uniform.typeName = enums[uniform.type];
    result.uniforms.push(uniform);
    result.uniformCount += uniform.size;
    uniform.size = uniform.size * blocks[uniform.type];
  }

  // Loop through active attributes
  for (let i = 0; i < activeAttributes; i++) {
    const attribute: any = gl.getActiveAttrib(program, i);
    attribute.typeName = enums[attribute.type];
    result.attributes.push(attribute);
    result.attributeCount += attribute.size;
  }

  return result;
}

export class WebGLStat {
  static MAX_VERTEX_UNIFORMS = 0;
  static MAX_FRAGMENT_UNIFORMS = 0;
  static MAX_ATTRIBUTES = 0;
  static WEBGL_SUPPORTED: boolean = false;

  // TODO: This remains static until we have a qay to inject variable parameters into the shader
  //       Strings. 128 is the guaranteed saftey range for uniform sizes for WebGL. We could have
  //       Significantly higher numbers on most devices if we have dynamic field replacement for
  //       Shaders.
  static MAX_VERTEX_INSTANCE_DATA = 128 - 32;

  static printCurrentProgramInfo(debug: any, surface: WebGLSurface<any, any>) {
    if (surface.gl) {
      const info = getProgramInfo(surface.gl, surface.gl.getParameter(surface.gl.CURRENT_PROGRAM));
      const table = (window as any).table;

      if (table) {

        table(info.uniforms);
      }
    }

    else {
      debug('Attempted to printProgramInfo but the surface has not established its gl context yet');
    }
  }
}

function initStats() {
  // Let's perform some immediate operations to do some gl querying for useful information
  function getAContext() {
    try{
      const canvas = document.createElement('canvas');
      return (window as any).WebGLRenderingContext && (
        canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' )
      );
    }

    catch (e) {
      return false;
    }
  }

  // Attempt to retrieve a context for webgl
  const gl = getAContext();

  // If the context exists, then we know gl is supported and we can fill in some metrics
  if (gl) {
    WebGLStat.WEBGL_SUPPORTED = true;
    WebGLStat.MAX_VERTEX_UNIFORMS = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    WebGLStat.MAX_FRAGMENT_UNIFORMS = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
    WebGLStat.MAX_ATTRIBUTES = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

    // TODO: See TODO at declaration
    WebGLStat.MAX_VERTEX_INSTANCE_DATA = 128 - 32;
  }
}

initStats();
