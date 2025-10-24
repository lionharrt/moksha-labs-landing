import { BufferGeometry, Float32BufferAttribute } from 'three';

/**
 * Create Inner Petal Geometry
 * 
 * Based on the main petal but with adjusted parameters for inner petals:
 * - Shorter length
 * - Rounder/less pointed tip
 * - Wider relative to length
 */
export function createInnerPetalGeometry(
  uSegments: number = 20,
  vSegments: number = 10
): BufferGeometry {
  const geometry = new BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];
  const uvs: number[] = [];
  
  function innerPetalShape(u: number, v: number): [number, number, number] {
    // === 1. WIDTH PROFILE (XY outline) ===
    
    // Asymmetric Gaussian - WIDER peak for rounder shape
    const peak = 0.5;
    const sigma1 = 0.4; // Wider base (0.35 → 0.4)
    const sigma2 = 0.5; // MUCH wider tip side (0.4 → 0.5) = rounder
    
    let width;
    if (u < peak) {
      const t = (u - peak) / sigma1;
      width = 0.55 + 0.5 * Math.exp(-t * t);
    } else {
      const t = (u - peak) / sigma2;
      width = 1.05 * Math.exp(-t * t);
    }
    
    // ROUNDER tip taper - power of 4 instead of 6
    const tipTaper = 1 - Math.pow(u, 4);
    width *= tipTaper;
    
    // Heart-shaped base indent - same
    const baseIndent = Math.exp(-u * 8) * (v * v) * 0.15;
    width -= baseIndent;
    
    // === 2. POSITION - SHORTER ===
    const x = v * width;
    const y = (u - 0.5) * 2.8; // 3.5 → 2.8 (20% shorter)
    
    // === 3. DEPTH (Z curvature) - MORE CUPPED ===
    
    // Lengthwise bow - slightly less
    const lengthBow = Math.sin(u * Math.PI) * 0.4; // 0.45 → 0.4
    
    // Tip bend - same
    const tipBend = u > 0.8 ? Math.pow((u - 0.8) / 0.2, 2) * 0.3 : 0;
    
    // Cross-sectional cup - DEEPER for more cupped shape
    const crossCup = Math.pow(Math.abs(v), 2.2) * 0.42; // 0.35 → 0.42
    
    const z = -lengthBow + crossCup - tipBend;
    
    return [x, y, z];
  }
  
  // Generate vertices
  for (let i = 0; i <= uSegments; i++) {
    const u = i / uSegments;
    
    for (let j = 0; j <= vSegments; j++) {
      // Collapse v to 0 at tip (single point)
      const vBase = (j / vSegments) * 2 - 1;
      const vCollapse = 1 - Math.pow(u, 4);
      const v = vBase * vCollapse;
      
      const [x, y, z] = innerPetalShape(u, v);
      vertices.push(x, y, z);
      
      // UV coordinates for texturing
      uvs.push(j / vSegments, u);
    }
  }
  
  // Generate indices (triangles)
  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * (vSegments + 1) + j;
      const b = a + vSegments + 1;
      const c = a + 1;
      const d = b + 1;
      
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }
  
  geometry.setIndex(indices);
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  
  return geometry;
}
