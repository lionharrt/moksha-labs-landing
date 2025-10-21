#!/usr/bin/env node

/**
 * CLI Tool: Create Scene
 * 
 * Generates boilerplate for a new storyboard scene.
 * 
 * Usage:
 *   pnpm storyboard:create-scene "lotus-petal-unfurl"
 *   node cli/create-scene.ts "lotus-petal-unfurl"
 */

import * as fs from 'fs';
import * as path from 'path';

// Scene templates
const configTemplate = (sceneId: string, sceneName: string, order: number) => `/**
 * ${sceneName} Scene Configuration
 * 
 * Scene ${order}: [Add description here]
 */

import { SceneConfig } from '../../types/Scene.types';

export const ${toCamelCase(sceneId)}Config: SceneConfig = {
  id: '${sceneId}',
  name: '${sceneName}',
  order: ${order},
  duration: '100vh',
  
  phases: {
    intro: {
      start: 0,
      end: 0.15,
      ease: 'power2.out',
    },
    build: {
      start: 0.15,
      end: 0.6,
      ease: 'none',
    },
    hold: {
      start: 0.6,
      end: 0.85,
      ease: 'none',
    },
    outro: {
      start: 0.85,
      end: 1.0,
      ease: 'power2.in',
    },
  },
  
  elements: [
    // Add your elements here
  ],
  
  effects: [
    // Add your effects here
  ],
  
  pin: true,
  scrub: 1,
  
  metadata: {
    description: '[Add scene description]',
    tags: ['${sceneId}'],
  },
};
`;

const componentTemplate = (sceneId: string, sceneName: string) => `/**
 * ${sceneName} Scene Component
 * 
 * [Add scene description]
 */

'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useScene } from '../../hooks/useScene';
import { ${toCamelCase(sceneId)}Config } from './${toKebabCase(sceneName)}Scene.config';

export function ${toPascalCase(sceneName)}Scene() {
  const { sceneRef, progress, getPhaseProgress, isActive } = useScene(${toCamelCase(sceneId)}Config);
  
  const introProgress = getPhaseProgress('intro');
  const buildProgress = getPhaseProgress('build');
  const holdProgress = getPhaseProgress('hold');
  const outroProgress = getPhaseProgress('outro');
  
  return (
    <section
      ref={sceneRef}
      id={${toCamelCase(sceneId)}Config.id}
      className="relative h-screen bg-brand-teal-dark"
      data-scene={${toCamelCase(sceneId)}Config.id}
      data-active={isActive}
    >
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          {/* Add your 3D components here */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
        </Canvas>
      </div>
      
      {/* DOM Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Add your DOM content here */}
      </div>
    </section>
  );
}
`;

const readmeTemplate = (sceneName: string) => `# ${sceneName} Scene

## Description

[Add scene description here]

## Phases

- **Intro (0-15%)**: [What happens during intro]
- **Build (15-60%)**: [What happens during build]
- **Hold (60-85%)**: [What happens during hold]
- **Outro (85-100%)**: [What happens during outro]

## Elements

- [Element 1]: [Description]
- [Element 2]: [Description]

## Effects

- [Effect 1]: [Description]
- [Effect 2]: [Description]

## Notes

[Any implementation notes, references, or TODOs]
`;

// Utility functions
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Main function
function createScene(sceneName: string, order: number = 1) {
  const sceneId = toKebabCase(sceneName);
  const sceneDir = path.join(__dirname, '..', 'scenes', `${order.toString().padStart(2, '0')}-${sceneId}`);
  const componentsDir = path.join(sceneDir, 'components');
  
  // Create directories
  if (!fs.existsSync(sceneDir)) {
    fs.mkdirSync(sceneDir, { recursive: true });
  }
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  // Create files
  const configPath = path.join(sceneDir, `${toPascalCase(sceneName)}Scene.config.ts`);
  const componentPath = path.join(sceneDir, `${toPascalCase(sceneName)}Scene.tsx`);
  const readmePath = path.join(sceneDir, 'README.md');
  
  fs.writeFileSync(configPath, configTemplate(sceneId, sceneName, order));
  fs.writeFileSync(componentPath, componentTemplate(sceneId, sceneName));
  fs.writeFileSync(readmePath, readmeTemplate(sceneName));
  
  console.log(`✅ Scene created: ${sceneDir}`);
  console.log(`   - ${path.basename(configPath)}`);
  console.log(`   - ${path.basename(componentPath)}`);
  console.log(`   - ${path.basename(readmePath)}`);
  console.log(`   - components/ (empty directory for scene components)`);
  console.log('');
  console.log('Next steps:');
  console.log(`1. Edit ${configPath} to define phases and elements`);
  console.log(`2. Edit ${componentPath} to implement scene visuals`);
  console.log(`3. Create 3D components in ${componentsDir}/`);
  console.log(`4. Register scene in StoryboardManager`);
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: create-scene <scene-name> [order]');
    console.error('Example: create-scene "lotus-petal-unfurl" 2');
    process.exit(1);
  }
  
  const sceneName = args[0];
  const order = args[1] ? parseInt(args[1], 10) : 1;
  
  createScene(sceneName, order);
}

export { createScene };

