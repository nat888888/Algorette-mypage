import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

// 旅行地点のデータ
const travelSpots = [
  {
    name: "Korea",
    year: "2025",
    position: [127.024612, 37.532600], // ソウルの座標
    image: "https://placehold.co/400x300/87CEEB/FFFFFF?text=Korea",
    description: "韓国旅行の思い出"
  },
  {
    name: "Guam",
    year: "2025",
    position: [144.793731, 13.444304], // グアムの座標
    image: "https://placehold.co/400x300/87CEEB/FFFFFF?text=Guam",
    description: "グアムでの休暇"
  },
  {
    name: "Turkey",
    year: "2024",
    position: [32.859741, 39.933363], // イスタンブールの座標
    image: "https://placehold.co/400x300/98FB98/FFFFFF?text=Turkey",
    description: "トルコの歴史探索"
  },
  {
    name: "Danang",
    year: "2024",
    position: [108.202167, 16.054407], // ダナンの座標
    image: "https://placehold.co/400x300/87CEEB/FFFFFF?text=Danang",
    description: "ベトナムの美しい海岸"
  }
];

// 座標を3D空間の位置に変換する関数
const latLongToVector3 = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const Marker = ({ position, data, onHover }) => {
  const [hovered, setHovered] = useState(false);
  const markerRef = useRef();

  return (
    <group position={position}>
      <mesh
        ref={markerRef}
        onPointerOver={() => {
          setHovered(true);
          onHover(data);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#FF4444" />
      </mesh>
      {hovered && (
        <Html position={[0, 0.15, 0]} center>
          <div className="bg-white p-4 rounded-lg shadow-xl w-72 transform -translate-x-1/2">
            <img src={data.image} alt={data.name} className="w-full h-40 object-cover rounded-lg mb-3" />
            <h3 className="font-bold text-lg text-gray-800">{data.name} ({data.year})</h3>
            <p className="text-sm text-gray-600 mt-2">{data.description}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

const Globe = () => {
  const globeRef = useRef();
  const [hoveredSpot, setHoveredSpot] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useFrame(() => {
    if (!isDragging && globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      <Sphere ref={globeRef} args={[1, 64, 64]}>
        <meshPhongMaterial
          map={new THREE.TextureLoader().load('/earth-texture.jpg')}
          bumpMap={new THREE.TextureLoader().load('/earth-bump.jpg')}
          bumpScale={0.05}
        />
      </Sphere>
      {travelSpots.map((spot, index) => (
        <Marker
          key={index}
          position={latLongToVector3(spot.position[1], spot.position[0], 1.05)}
          data={spot}
          onHover={setHoveredSpot}
        />
      ))}
    </group>
  );
};

export default Globe; 