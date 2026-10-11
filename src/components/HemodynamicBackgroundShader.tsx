import React, { useEffect, useRef } from 'react';

export const HemodynamicBackgroundShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    let animationFrameId: number;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.35;

        // Cardiac pulse wave
        float heartbeat = sin(u_time * 3.4);
        float pulse = pow(max(0.0, heartbeat), 5.0) * 0.8 + pow(max(0.0, sin((u_time * 3.4) + 0.45)), 4.0) * 0.4;

        // Multi-layered hemodynamic noise
        float n1 = snoise(p * 1.618 + vec2(t * 0.2, -t * 0.15));
        float n2 = snoise(p * 3.236 - vec2(t * 0.12, t * 0.25));
        float n3 = snoise(p * 5.236 + vec2(-t * 0.3, t * 0.1));
        float flow = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;

        float lineFlow1 = sin(p.y * 8.0 + flow * 3.0 + t * 1.5);
        float lineGlow1 = smoothstep(0.85, 1.0, lineFlow1) * 0.35;

        float lineFlow2 = cos(p.x * 6.0 - flow * 2.5 + t * 1.2);
        float lineGlow2 = smoothstep(0.88, 1.0, lineFlow2) * 0.3;

        // Biometric grid coordinate mesh
        vec2 gridCoord = fract(uv * vec2(48.0, 29.66));
        float grid = (step(0.965, gridCoord.x) + step(0.965, gridCoord.y)) * 0.045;

        // Deep anatomical palette
        vec3 backgroundBlack = vec3(0.02, 0.045, 0.09);
        vec3 deepIndigo = vec3(0.04, 0.08, 0.16);
        vec3 cyanLuminescence = vec3(0.0, 0.85, 1.0);
        vec3 magentaStenosis = vec3(1.0, 0.05, 0.35);

        vec3 color = mix(backgroundBlack, deepIndigo, uv.y + flow * 0.25);
        color += cyanLuminescence * (max(0.0, flow * 0.32) + lineGlow1 * 0.6);
        color += magentaStenosis * (pulse * 0.18 * (1.2 - uv.y) + lineGlow2 * 0.45);
        color += vec3(grid * 0.4, grid * 0.75, grid * 1.0);

        float vig = uv.x * (1.0 - uv.x) * uv.y * (1.0 - uv.y) * 16.0;
        vig = clamp(pow(vig, 0.32), 0.0, 1.0);
        color *= (0.65 + 0.35 * vig);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, src: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, src);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const handleResize = () => {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = Math.floor(w / 1.5); // Performance-optimized resolution
        canvas.height = Math.floor(h / 1.5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * canvas.width;
      mouse.y = (1.0 - e.clientY / window.innerHeight) * canvas.height;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = (time: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block opacity-75" />
    </div>
  );
};
