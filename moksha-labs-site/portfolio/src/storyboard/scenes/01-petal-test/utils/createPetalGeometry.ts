import { BufferGeometry, Float32BufferAttribute } from 'three';

/**
 * Create Petal Geometry with LOD Support
 * 
 * Based on research: PMC7549838 - Water lily morphological model
 * Emphasizes gradual transitions of tepal forms in 3D space
 * 
 * @param uSegments - Length resolution (base to tip)
 * @param vSegments - Width resolution (left to right)
 * @returns BufferGeometry for a single lotus petal
 */
export function createPetalGeometry(
  uSegments: number = 20,
  vSegments: number = 10
): BufferGeometry {
  const geometry = new BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  
  /**
   * Petal Shape Function
   * 
   * Creates anatomically accurate lotus petal based on botanical measurements:
   * - Lanceolate outline (wider at middle, tapered at ends)
   * - Heart-shaped base indent
   * - Smooth pointed tip
   * - Natural 3D curvature (lengthwise bow + cross-sectional cup)
   * 
   * @param u - 0 to 1 (base to tip)
   * @param v - -1 to 1 (left edge to right edge)
   * @returns [x, y, z] coordinates
   */
  function petalShape(u: number, v: number): [number, number, number] {
    // === 1. WIDTH PROFILE (XY outline) ===
    
    // Asymmetric Gaussian for lanceolate shape
    const peak = 0.5; // Widest at 50%
    const sigma1 = 0.35; // Base side width
    const sigma2 = 0.4; // Tip side width
    
    let width;
    if (u < peak) {
      const t = (u - peak) / sigma1;
      width = 0.55 + 0.5 * Math.exp(-t * t);
    } else {
      const t = (u - peak) / sigma2;
      width = 1.05 * Math.exp(-t * t);
    }
    
    // Taper to point at tip
    const tipTaper = 1 - Math.pow(u, 6);
    width *= tipTaper;
    
    // Heart-shaped base indent
    const baseIndent = Math.exp(-u * 8) * (v * v) * 0.15;
    width -= baseIndent;
    
    // === 2. POSITION ===
    const x = v * width;
    const y = (u - 0.5) * 3.5;
    
    // === 3. DEPTH (Z curvature) ===
    
    // Lengthwise bow (curves backward)
    const lengthBow = Math.sin(u * Math.PI) * 0.45;
    
    // Tip bend (bends away at end)
    const tipBend = u > 0.8 ? Math.pow((u - 0.8) / 0.2, 2) * 0.3 : 0;
    
    // Cross-sectional cup (edges curve up)
    const crossCup = Math.pow(Math.abs(v), 2.2) * 0.35;
    
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
      
      const [x, y, z] = petalShape(u, v);
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
  geometry.computeVertexNormals(); // Calculate smooth normals
  
  return geometry;
}

/**
 * LOD Levels for Performance
 * Based on research: Level of Detail rendering best practices
 */
export const PETAL_LOD = {
  /** High detail for close-up inspection (820 vertices) */
  HIGH: { u: 40, v: 20 },
  
  /** Medium detail for formations (210 vertices) */
  MEDIUM: { u: 20, v: 10 },
  
  /** Low detail for distant/numerous petals (60 vertices) */
  LOW: { u: 10, v: 5 },
} as const;

