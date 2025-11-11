"use client";

import { useRef, useEffect } from "react";
import type React from "react";
import { LightingState } from "@/hooks/useLighting";

interface AtmosphericEffectsWebGLProps {
  lightingState: LightingState; // For React components that need re-renders
  lightingStateRef?: React.MutableRefObject<LightingState | null>; // For synchronous reads in render loop
  width?: number;
  height?: number;
  renderRef?: React.MutableRefObject<(() => void) | null>;
}

// Vertex shader - simple full-screen quad
const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    // Convert from clip space (-1 to 1) to UV space (0 to 1)
    v_uv = (a_position + 1.0) * 0.5;
    // Flip Y axis to match canvas coordinates
    v_uv.y = 1.0 - v_uv.y;
  }
`;

// Fragment shader - volumetric god rays, lens flare, and atmospheric glow
// Improved version with better positioning and visual quality
const fragmentShaderSource = `
  precision mediump float;
  
  uniform vec2 u_resolution;
  uniform vec2 u_lightPos;
  uniform float u_time;
  uniform float u_godRaysIntensity;
  uniform float u_lensFlareIntensity;
  uniform float u_atmosphericGlowIntensity;
  uniform bool u_isDaytime;
  
  varying vec2 v_uv;
  
  // Convert UV to pixel coordinates
  vec2 uvToPixel(vec2 uv) {
    return uv * u_resolution;
  }
  
  // Convert pixel coordinates to UV
  // CRITICAL: Canvas coordinates have Y=0 at top, Y increases downward
  // Vertex shader flips Y so v_uv.y=0 is at top, v_uv.y=1 is at bottom
  // So pixel Y coordinate maps directly: pixel.y / resolution.y = UV.y (no flip needed)
  vec2 pixelToUV(vec2 pixel) {
    vec2 uv = pixel / u_resolution;
    // Y is already correct (v_uv.y=0 is top, matching canvas Y=0 at top)
    return uv;
  }
  
  // Smooth noise function for volumetric rays
  float smoothNoise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  // Improved noise with multiple octaves
  float multiOctaveNoise(vec2 p) {
    float n = smoothNoise(p);
    n += smoothNoise(p * 2.0) * 0.5;
    n += smoothNoise(p * 4.0) * 0.25;
    return n / 1.75;
  }
  
  // Volumetric god rays - improved with better ray definition
  float calculateGodRays(vec2 uv, vec2 lightPosPixels) {
    if (u_godRaysIntensity <= 0.0) return 0.0;
    
    // CRITICAL: Convert light position from pixels to UV coordinates
    // lightPosPixels is the CENTER of the sun/moon in viewport pixels
    // DayNightCycle positions SVG with: left = sunPosition.x - 200
    // So sunPosition.x/y IS the center (SVG centerX=200, centerY=200)
    vec2 lightUV = pixelToUV(lightPosPixels);
    
    // Vector from light to current pixel (in UV space)
    vec2 toLight = uv - lightUV;
    float dist = length(toLight);
    
    // Early exit if too far
    if (dist > 0.8) return 0.0;
    
    // Calculate angle from light center
    float angle = atan(toLight.y, toLight.x);
    
    // Create 12 distinct rays (matching Canvas 2D version)
    float numRays = 12.0;
    float rayAngle = mod(angle + u_time * 0.15, 6.28318); // Rotate over time
    float rayIndex = floor(rayAngle / (6.28318 / numRays));
    float rayPhase = mod(rayAngle, 6.28318 / numRays);
    
    // Ray visibility - sharper, more defined rays
    float rayCenter = (6.28318 / numRays) * 0.5;
    float rayDeviation = abs(rayPhase - rayCenter);
    float rayVisibility = 1.0 - rayDeviation / (6.28318 / numRays / 2.0);
    rayVisibility = max(0.0, rayVisibility);
    rayVisibility = pow(rayVisibility, 3.0); // Sharper falloff
    
    // Volumetric sampling along ray (8 samples for better quality)
    float rayIntensity = 0.0;
    float samples = 8.0;
    
    // Unroll loop for WebGL 1.0 compatibility
    float t0 = 0.0 / samples;
    vec2 samplePos0 = lightUV + toLight * t0;
    float noise0 = multiOctaveNoise(samplePos0 * 12.0 + u_time * 0.1);
    float falloff0 = pow(1.0 - t0, 1.5);
    rayIntensity += noise0 * falloff0 / samples;
    
    float t1 = 1.0 / samples;
    vec2 samplePos1 = lightUV + toLight * t1;
    float noise1 = multiOctaveNoise(samplePos1 * 12.0 + u_time * 0.1);
    float falloff1 = pow(1.0 - t1, 1.5);
    rayIntensity += noise1 * falloff1 / samples;
    
    float t2 = 2.0 / samples;
    vec2 samplePos2 = lightUV + toLight * t2;
    float noise2 = multiOctaveNoise(samplePos2 * 12.0 + u_time * 0.1);
    float falloff2 = pow(1.0 - t2, 1.5);
    rayIntensity += noise2 * falloff2 / samples;
    
    float t3 = 3.0 / samples;
    vec2 samplePos3 = lightUV + toLight * t3;
    float noise3 = multiOctaveNoise(samplePos3 * 12.0 + u_time * 0.1);
    float falloff3 = pow(1.0 - t3, 1.5);
    rayIntensity += noise3 * falloff3 / samples;
    
    float t4 = 4.0 / samples;
    vec2 samplePos4 = lightUV + toLight * t4;
    float noise4 = multiOctaveNoise(samplePos4 * 12.0 + u_time * 0.1);
    float falloff4 = pow(1.0 - t4, 1.5);
    rayIntensity += noise4 * falloff4 / samples;
    
    float t5 = 5.0 / samples;
    vec2 samplePos5 = lightUV + toLight * t5;
    float noise5 = multiOctaveNoise(samplePos5 * 12.0 + u_time * 0.1);
    float falloff5 = pow(1.0 - t5, 1.5);
    rayIntensity += noise5 * falloff5 / samples;
    
    float t6 = 6.0 / samples;
    vec2 samplePos6 = lightUV + toLight * t6;
    float noise6 = multiOctaveNoise(samplePos6 * 12.0 + u_time * 0.1);
    float falloff6 = pow(1.0 - t6, 1.5);
    rayIntensity += noise6 * falloff6 / samples;
    
    float t7 = 7.0 / samples;
    vec2 samplePos7 = lightUV + toLight * t7;
    float noise7 = multiOctaveNoise(samplePos7 * 12.0 + u_time * 0.1);
    float falloff7 = pow(1.0 - t7, 1.5);
    rayIntensity += noise7 * falloff7 / samples;
    
    // Distance falloff from light center
    float distanceFalloff = 1.0 / (1.0 + dist * 3.0);
    distanceFalloff = pow(distanceFalloff, 0.8);
    
    return rayIntensity * rayVisibility * distanceFalloff * u_godRaysIntensity * 2.0;
  }
  
  // Improved lens flare effect
  float calculateLensFlare(vec2 uv, vec2 lightPosPixels) {
    if (u_lensFlareIntensity <= 0.0) return 0.0;
    
    // Convert light position from pixels to UV coordinates
    vec2 lightUV = pixelToUV(lightPosPixels);
    
    // Calculate distance in pixels
    vec2 pixelPos = uvToPixel(uv);
    vec2 lightPixelPos = lightPosPixels;
    float distPixels = distance(pixelPos, lightPixelPos);
    
    // Main flare - radial gradient with smooth falloff
    float flareRadius = 150.0;
    float mainFlare = 1.0 - smoothstep(0.0, flareRadius, distPixels);
    mainFlare = pow(mainFlare, 1.5); // Softer falloff
    mainFlare *= u_lensFlareIntensity * 2.0;
    
    // Inner bright core
    float coreRadius = 50.0;
    float core = 1.0 - smoothstep(0.0, coreRadius, distPixels);
    core = pow(core, 2.0);
    mainFlare += core * u_lensFlareIntensity * 0.5;
    
    // Secondary flares along line to screen center
    vec2 centerUV = vec2(0.5, 0.5);
    vec2 centerPixels = uvToPixel(centerUV);
    vec2 toCenter = normalize(centerPixels - lightPixelPos);
    vec2 toPixel = normalize(pixelPos - lightPixelPos);
    float alignment = dot(toCenter, toPixel);
    
    float secondaryFlare = 0.0;
    if (alignment > 0.6) {
      // Draw 2-3 secondary flares along the line (unrolled for WebGL 1.0)
      float t1 = 0.25;
      vec2 flarePos1 = lightPixelPos + toCenter * t1 * distance(lightPixelPos, centerPixels);
      float flareDist1 = distance(pixelPos, flarePos1);
      float flareSize1 = 40.0 + 1.0 * 20.0;
      float flareOpacity1 = (1.0 - smoothstep(0.0, flareSize1, flareDist1)) * (0.4 - 1.0 * 0.1);
      secondaryFlare += flareOpacity1;
      
      float t2 = 0.5;
      vec2 flarePos2 = lightPixelPos + toCenter * t2 * distance(lightPixelPos, centerPixels);
      float flareDist2 = distance(pixelPos, flarePos2);
      float flareSize2 = 40.0 + 2.0 * 20.0;
      float flareOpacity2 = (1.0 - smoothstep(0.0, flareSize2, flareDist2)) * (0.4 - 2.0 * 0.1);
      secondaryFlare += flareOpacity2;
      
      float t3 = 0.75;
      vec2 flarePos3 = lightPixelPos + toCenter * t3 * distance(lightPixelPos, centerPixels);
      float flareDist3 = distance(pixelPos, flarePos3);
      float flareSize3 = 40.0 + 3.0 * 20.0;
      float flareOpacity3 = (1.0 - smoothstep(0.0, flareSize3, flareDist3)) * (0.4 - 3.0 * 0.1);
      secondaryFlare += flareOpacity3;
    }
    
    return mainFlare + secondaryFlare * u_lensFlareIntensity;
  }
  
  // Improved atmospheric glow
  float calculateAtmosphericGlow(vec2 uv, vec2 lightPosPixels) {
    if (u_atmosphericGlowIntensity <= 0.0) return 0.0;
    
    // Convert light position from pixels to UV coordinates
    vec2 lightUV = pixelToUV(lightPosPixels);
    
    // Calculate distance in pixels
    vec2 pixelPos = uvToPixel(uv);
    vec2 lightPixelPos = lightPosPixels;
    float distPixels = distance(pixelPos, lightPixelPos);
    
    // Larger, softer glow radius
    float glowRadius = min(u_resolution.x, u_resolution.y) * 0.5;
    float glow = 1.0 - smoothstep(0.0, glowRadius, distPixels);
    glow = pow(glow, 2.0); // Softer falloff
    
    return glow * u_atmosphericGlowIntensity * (u_isDaytime ? 0.15 : 0.1);
  }
  
  void main() {
    // Calculate effects using pixel coordinates for accuracy
    float godRays = calculateGodRays(v_uv, u_lightPos);
    float lensFlare = calculateLensFlare(v_uv, u_lightPos);
    float atmosphericGlow = calculateAtmosphericGlow(v_uv, u_lightPos);
    
    // Combine effects
    vec3 color = vec3(0.0);
    
    // God rays - EXACT colors from Canvas 2D version
    // Canvas uses: rgba(255, 230, 150), rgba(255, 240, 200), rgba(255, 250, 220)
    if (godRays > 0.0) {
      vec3 rayColor = u_isDaytime 
        ? vec3(1.0, 0.902, 0.588)  // RGB(255, 230, 150) / 255
        : vec3(0.784, 0.863, 1.0) * 0.7; // Cool blue-white for moon
      color += rayColor * godRays;
    }
    
    // Lens flare - EXACT colors from Canvas 2D version
    // Canvas uses: rgba(255, 220, 150) for day, rgba(200, 220, 255) for night
    if (lensFlare > 0.0) {
      vec3 flareColor = u_isDaytime 
        ? vec3(1.0, 0.863, 0.588)  // RGB(255, 220, 150) / 255
        : vec3(0.784, 0.863, 1.0) * 0.6; // RGB(200, 220, 255) / 255
      color += flareColor * lensFlare;
    }
    
    // Atmospheric glow - EXACT colors from Canvas 2D version
    // Canvas uses: rgba(255, 240, 200) for day
    if (atmosphericGlow > 0.0) {
      vec3 glowColor = u_isDaytime
        ? vec3(1.0, 0.941, 0.784)  // RGB(255, 240, 200) / 255
        : vec3(0.784, 0.863, 1.0);  // Cool blue-white
      color += glowColor * atmosphericGlow;
    }
    
    // Output with proper alpha blending
    // Canvas 2D uses screen blend mode for lens flare, so we need higher alpha
    float alpha = max(godRays * 0.8, max(lensFlare * 0.9, atmosphericGlow * 0.6));
    gl_FragColor = vec4(color, alpha);
  }
`;

function AtmosphericEffectsWebGL({
  lightingState,
  lightingStateRef: externalLightingStateRef,
  width,
  height,
  renderRef,
}: AtmosphericEffectsWebGLProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Use external ref if provided (from useLighting hook), otherwise fallback to local ref
  const localLightingStateRef = useRef<LightingState>(lightingState);
  const lightingStateRef = externalLightingStateRef || localLightingStateRef;
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const timeRef = useRef(0);

  // CRITICAL: If using external ref, it's updated synchronously in useLighting
  // If using local ref, update it synchronously from prop
  if (!externalLightingStateRef) {
    localLightingStateRef.current = lightingState;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("AtmosphericEffectsWebGL: Canvas ref is null");
      return;
    }

    // Get WebGL context with better error handling
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false,
        antialias: false, // Disable for performance
      }) as WebGLRenderingContext | null;

      if (!gl) {
        // Try WebGL2
        gl = canvas.getContext("webgl2", {
          alpha: true,
          premultipliedAlpha: false,
          antialias: false,
        }) as WebGLRenderingContext | null;
      }
    } catch (e) {
      console.error(
        "AtmosphericEffectsWebGL: Error creating WebGL context:",
        e
      );
    }

    if (!gl) {
      console.error(
        "AtmosphericEffectsWebGL: WebGL not supported or failed to initialize"
      );
      return; // No fallback, as per user request
    }

    console.log("AtmosphericEffectsWebGL: WebGL context created successfully");
    glRef.current = gl;

    // Set canvas size - MUST match viewport exactly for coordinate sync
    const resizeCanvas = () => {
      const w = width || window.innerWidth;
      const h = height || window.innerHeight;

      // CRITICAL: Canvas dimensions must match viewport exactly (no DPR scaling)
      // This ensures lightXPixels/lightYPixels map directly to canvas coordinates
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      if (gl) {
        gl.viewport(0, 0, w, h);
      }

      console.log("AtmosphericEffectsWebGL: Canvas resized to", w, h);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Compile shader with better error reporting
    const compileShader = (
      source: string,
      type: number
    ): WebGLShader | null => {
      if (!gl) return null;

      const shader = gl.createShader(type);
      if (!shader) {
        console.error(
          `Failed to create ${
            type === gl.VERTEX_SHADER ? "vertex" : "fragment"
          } shader`
        );
        return null;
      }

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const shaderType = type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT";
        const errorLog = gl.getShaderInfoLog(shader);
        console.error(
          `AtmosphericEffectsWebGL: ${shaderType} shader compilation error:`,
          errorLog
        );
        console.error(
          "Shader source:",
          source
            .split("\n")
            .map((line, i) => `${i + 1}: ${line}`)
            .join("\n")
        );
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    // Create shader program
    if (!gl) {
      console.error("AtmosphericEffectsWebGL: GL context lost");
      return;
    }

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );

    if (!vertexShader || !fragmentShader) {
      console.error("AtmosphericEffectsWebGL: Failed to compile shaders");
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      console.error("AtmosphericEffectsWebGL: Failed to create program");
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const errorLog = gl.getProgramInfoLog(program);
      console.error(
        "AtmosphericEffectsWebGL: Program linking error:",
        errorLog
      );
      return;
    }

    programRef.current = program;
    console.log(
      "AtmosphericEffectsWebGL: Shaders compiled and linked successfully"
    );

    // Create full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1,
        -1, // Bottom left
        1,
        -1, // Bottom right
        -1,
        1, // Top left
        1,
        1, // Top right
      ]),
      gl.STATIC_DRAW
    );

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const lightPosLocation = gl.getUniformLocation(program, "u_lightPos");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const godRaysIntensityLocation = gl.getUniformLocation(
      program,
      "u_godRaysIntensity"
    );
    const lensFlareIntensityLocation = gl.getUniformLocation(
      program,
      "u_lensFlareIntensity"
    );
    const atmosphericGlowIntensityLocation = gl.getUniformLocation(
      program,
      "u_atmosphericGlowIntensity"
    );
    const isDaytimeLocation = gl.getUniformLocation(program, "u_isDaytime");

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const render = () => {
      if (!gl || !program) return;

      const currentLightingState = lightingStateRef.current;
      if (!currentLightingState) {
        timeRef.current += 0.016;
        return;
      }

      // Clear canvas
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Skip rendering if no effects (no test render as per user request)
      if (
        currentLightingState.godRaysIntensity <= 0 &&
        currentLightingState.lensFlareIntensity <= 0
      ) {
        timeRef.current += 0.016;
        return;
      }

      // Use shader program
      gl.useProgram(program);

      // Set up geometry
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Set uniforms
      // CRITICAL: Use actual canvas dimensions (should match viewport)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      // Pass light position in pixel coordinates (matches DayNightCycle exactly)
      // lightXPixels/lightYPixels are the CENTER of the sun/moon in viewport pixels
      // These values come directly from calculateLightPosition() which is the single source of truth
      // FIX: Apply offset to compensate for coordinate system mismatch
      const lightX = currentLightingState.lightXPixels - 50;
      const lightY = currentLightingState.lightYPixels - 50;

      // Pass pixel coordinates directly to shader
      // Shader will convert to UV coordinates internally
      if (!lightPosLocation) {
        console.error("AtmosphericEffectsWebGL: lightPosLocation is null");
        return;
      }

      gl.uniform2f(lightPosLocation, lightX, lightY);

      gl.uniform1f(timeLocation, timeRef.current);

      // Only render god rays during daytime
      const godRaysIntensity =
        currentLightingState.isDaytime && currentLightingState.godRaysIntensity
          ? currentLightingState.godRaysIntensity
          : 0;

      gl.uniform1f(godRaysIntensityLocation, godRaysIntensity);
      gl.uniform1f(
        lensFlareIntensityLocation,
        currentLightingState.lensFlareIntensity
      );

      // Calculate atmospheric glow intensity
      const atmosphericGlowIntensity =
        godRaysIntensity > 0.3 || currentLightingState.lensFlareIntensity > 0.2
          ? Math.max(godRaysIntensity, currentLightingState.lensFlareIntensity)
          : 0;

      gl.uniform1f(atmosphericGlowIntensityLocation, atmosphericGlowIntensity);
      gl.uniform1i(isDaytimeLocation, currentLightingState.isDaytime ? 1 : 0);

      // Draw full-screen quad
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Update time
      timeRef.current += 0.016;
    };

    // Expose render function via ref for unified RAF loop
    if (renderRef) {
      renderRef.current = render;
    }

    // Initial render
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (renderRef) {
        renderRef.current = null;
      }
    };
  }, [width, height, renderRef, lightingStateRef]); // lightingStateRef is stable, but include for completeness

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", // CRITICAL: Match DayNightCycle's fixed positioning
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
        willChange: "transform",
      }}
    />
  );
}

// Don't memoize - we need to re-render when lightingState changes to update the ref synchronously
export default AtmosphericEffectsWebGL;
