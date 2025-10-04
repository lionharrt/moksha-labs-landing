'use client';

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#6366f1" />
    </>
  );
}

