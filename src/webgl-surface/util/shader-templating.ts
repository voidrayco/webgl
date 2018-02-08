export function shaderTemplate(shader: string, options: {[key: string]: string}) {
  return shader.replace(/\$\{(\w+)\}/g, (x: string, match: string) => options[match]);
}
