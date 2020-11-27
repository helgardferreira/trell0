import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";

type Nullable<T> = T | null;

const vertexShader = `
  attribute vec2 aVertexPosition;
  attribute vec2 aUv;

  uniform vec2 uScalingFactor;
  varying vec2 vUv;

  void main() {
    vUv = aUv;

    gl_Position = vec4(aVertexPosition * uScalingFactor, 0.0, 1.0);
  }
`;

const fragmentShader = `
  #ifdef GL_ES
    precision highp float;
  #endif

  uniform float uTime;
  varying vec2 vUv;

  // Description : Array and textureless GLSL 2D/3D/4D simplex
  //               noise functions.
  //      Author : Ian McEwan, Ashima Arts.
  //     License : Distributed under the MIT License. See LICENSE file:
  //               https://github.com/ashima/webgl-noise

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0) ;
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy; // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i);
    vec4 p = permute(
      permute(
        permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0)
      )
      + i.x + vec4(0.0, i1.x, i2.x, 1.0)
    );

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(
      m*m,
      vec4(
        dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)
      )
    );
  }

  float hue2rgb(float f1, float f2, float hue) {
      if (hue < 0.0)
          hue += 1.0;
      else if (hue > 1.0)
          hue -= 1.0;
      float res;
      if ((6.0 * hue) < 1.0)
          res = f1 + (f2 - f1) * 6.0 * hue;
      else if ((2.0 * hue) < 1.0)
          res = f2;
      else if ((3.0 * hue) < 2.0)
          res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
      else
          res = f1;
      return res;
  }

  // Credit to Jam3: https://github.com/Jam3/glsl-hsl2rgb
  vec3 hsl2rgb(vec3 hsl) {
      vec3 rgb;

      if (hsl.y == 0.0) {
          rgb = vec3(hsl.z); // Luminance
      } else {
          float f2;

          if (hsl.z < 0.5)
              f2 = hsl.z * (1.0 + hsl.y);
          else
              f2 = hsl.z + hsl.y - hsl.y * hsl.z;

          float f1 = 2.0 * hsl.z - f2;

          rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
          rgb.g = hue2rgb(f1, f2, hsl.x);
          rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
      }
      return rgb;
  }

  vec3 hsl2rgb(float h, float s, float l) {
      return hsl2rgb(vec3(h, s, l));
  }

  void main() {
    // Use 3D simplex noise and pass it vUv's x and y coords as well as time
    // to create "distortion" animation effect
    float distortion = snoise(vec3(vUv.xy, uTime / 2400.0) / 2.0);

    // hsl2rgb(hue: number, saturation: number, light: number)
    // All values are normalized
    vec3 color = hsl2rgb(
      // Modification to standard sin function to output values in certain hue range
      sin(distortion * 5.0) * 0.19 + 0.63,
      0.8,
      0.5
    );

    // centerDiff is the vector "between" vUv and the center vector (0.5, 0.5)
    vec2 centerDiff = vUv - vec2(0.5, 0.5);

    // Use the built-in length() function to calculate the distance between
    // current vUv and center vector
    float distance = length(centerDiff);

    // Use the built-in smoothstep() function and pass it the center distance
    // as well as two cut-off points to create a simple anti-aliasing effect
    float alpha = smoothstep(0.355, 0.345, distance);

    // gl_FragColor => final pixel color
    gl_FragColor = vec4(color, alpha);
  }
`;

interface ShaderInfo {
  type: number;
  code: string;
}

const DimCircle: FunctionComponent = () => {
  const glCanvas = useRef<HTMLCanvasElement>(null);

  const compileShader = useCallback(
    (
      glContext: WebGLRenderingContext,
      code: string,
      type: number
    ): WebGLShader => {
      if (glContext === null) throw new Error("No rendering context found");
      const shader = glContext.createShader(type);

      if (shader === null || code === null || code === undefined)
        throw new Error("Invalid shader");

      glContext.shaderSource(shader, code);
      glContext.compileShader(shader);

      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.warn(
          `Error compiling ${
            type === glContext.VERTEX_SHADER ? "vertex" : "fragment"
          } shader:`
        );
        console.warn(glContext.getShaderInfoLog(shader));
      }

      return shader;
    },
    []
  );

  const buildShaderProgram = useCallback(
    (
      glContext: WebGLRenderingContext,
      shaderSet: ShaderInfo[]
    ): WebGLProgram => {
      if (glContext === null) throw new Error("No rendering context found");
      const program = glContext.createProgram();

      shaderSet.forEach((desc) => {
        const shader = compileShader(glContext, desc.code, desc.type);

        if (shader && glContext && program) {
          glContext.attachShader(program, shader);
        }
      });

      if (program === null) throw new Error("Invalid WebGL program");

      glContext.linkProgram(program);

      if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
        console.warn("Error linking shader program:");
        console.warn(glContext.getProgramInfoLog(program));
      }

      return program;
    },
    [compileShader]
  );

  useEffect(() => {
    let glContext: Nullable<WebGLRenderingContext> = null;

    function startup() {
      if (!glCanvas.current) return;
      glContext = glCanvas.current.getContext("webgl");

      if (glContext === null) throw new Error("No rendering context found");

      const shaderSet: ShaderInfo[] = [
        {
          type: glContext.VERTEX_SHADER,
          code: vertexShader,
        },
        {
          type: glContext.FRAGMENT_SHADER,
          code: fragmentShader,
        },
      ];

      const shaderProgram = buildShaderProgram(glContext, shaderSet);

      // Three 2D vertices per triangle (2 triangles total)
      /*
        -0.5, 0.5,
        0.5, 0.5,
        0.5, -0.5,
        -0.5, 0.5,
        0.5, -0.5,
        -0.5, -0.5,
      */
      const vertexArray = new Float32Array([
        -0.5,
        0.5,
        0.5,
        0.5,
        0.5,
        -0.5,
        -0.5,
        0.5,
        0.5,
        -0.5,
        -0.5,
        -0.5,
      ]);

      const uvs = vertexArray.map((val) => val + 0.5);

      const vertexNumComponents = 2;

      /* Bind buffer for vertex position attribute */
      const aVertexPosition = glContext.getAttribLocation(
        shaderProgram,
        "aVertexPosition"
      );

      const vertexBuffer = glContext.createBuffer();
      glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
      glContext.bufferData(
        glContext.ARRAY_BUFFER,
        vertexArray,
        glContext.STATIC_DRAW
      );

      glContext.vertexAttribPointer(
        aVertexPosition,
        vertexNumComponents,
        glContext.FLOAT,
        false,
        0,
        0
      );
      glContext.enableVertexAttribArray(aVertexPosition);
      /*  */

      /* Bind buffer for uv coordinates attribute */
      const aUv = glContext.getAttribLocation(shaderProgram, "aUv");

      const uvBuffer = glContext.createBuffer();
      glContext.bindBuffer(glContext.ARRAY_BUFFER, uvBuffer);
      glContext.bufferData(glContext.ARRAY_BUFFER, uvs, glContext.STATIC_DRAW);

      glContext.vertexAttribPointer(aUv, 2, glContext.FLOAT, false, 0, 0);
      glContext.enableVertexAttribArray(aUv);
      /*  */

      const vertexCount = vertexArray.length / vertexNumComponents;

      // Set background color
      glContext.clearColor(0, 0, 0, 0);
      glContext.clear(glContext.COLOR_BUFFER_BIT);

      // Use shader program
      glContext.useProgram(shaderProgram);

      function animateScene(currentTime = 0) {
        if (glContext === null) throw new Error("No rendering context found");
        if (glCanvas.current === null) return;

        const aspectRatio = glCanvas.current.width / glCanvas.current.height;
        const currentScale = [1.0, aspectRatio];

        // Set uScalingFactor & uTime uniforms to newest values
        const uScalingFactor = glContext.getUniformLocation(
          shaderProgram,
          "uScalingFactor"
        );
        glContext.uniform2fv(uScalingFactor, currentScale);

        const uTime = glContext.getUniformLocation(shaderProgram, "uTime");
        glContext.uniform1f(uTime, currentTime);

        // Set WebGL viewport to canvas viewport every frame in case dimensions change
        glContext.viewport(
          0,
          0,
          glCanvas.current.width,
          glCanvas.current.height
        );
        glContext.drawArrays(glContext.TRIANGLES, 0, vertexCount);

        window.requestAnimationFrame((time) => {
          animateScene(time);
        });
      }

      animateScene();
    }

    window.addEventListener("load", startup, false);

    return () => {};
  }, [buildShaderProgram]);

  return (
    <canvas ref={glCanvas} width={600} height={460}>
      Oh no! Your browser doesn&apos;t support canvas!
    </canvas>
  );
};

export default DimCircle;
