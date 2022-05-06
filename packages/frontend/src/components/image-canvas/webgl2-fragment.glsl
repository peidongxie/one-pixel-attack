#version 300 es
precision highp float;
uniform sampler2D u_image;
in vec2 v_coordinate;
out vec4 o_color;
void main() {
  o_color = texture(u_image, v_coordinate);
}