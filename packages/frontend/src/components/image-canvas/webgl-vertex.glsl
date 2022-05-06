uniform vec2 u_resolution;
attribute vec2 a_position;
attribute vec2 a_coordinate;
varying vec2 v_coordinate;
void main() {
  gl_Position = vec4(((a_position / u_resolution) * 2.0 - 1.0) * vec2(1, -1), 0, 1);
  v_coordinate = a_coordinate;
}