import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Define interfaces for our custom object types
interface StarData {
  velocity: THREE.Vector3;
}

interface FloatingObjectData {
  velocity: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
}

/**
 * Astralis Component
 * A React component that creates an interactive 3D space scene using Three.js
 * Features include:
 * - Animated stars and planets
 * - Interactive background that responds to mouse movement
 * - Illuminated text with letter-by-letter animation
 * - Growing and fading central sphere
 */
const Astralis: React.FC = () => {
  // Reference to the container div for Three.js canvas
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State to track mouse position for parallax effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Skip initialization if container is not available
    if (!containerRef.current) return;

    // ==================== SETUP THREE.JS ENVIRONMENT ====================
    
    // Create the Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011); // Deep navy background
    
    // Create camera with perspective projection
    // Parameters: FOV, aspect ratio, near clipping plane, far clipping plane
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Create renderer with antialiasing for smoother edges
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // ==================== CREATE STARFIELD ====================
    
    // Array to store all star objects for animation
    const stars: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>[] = [];
    
    /**
     * Function to create a single star and add it to the scene
     * Each star has random properties for position, brightness, and movement
     */
    function addStar() {
      // Create sphere geometry for star with small radius
      const geometry = new THREE.SphereGeometry(0.1, 16, 16);
      
      // Random brightness between 0.5 and 1.0 for varied star appearance
      const brightness = 0.5 + Math.random() * 0.5;
      
      // Create material with white color and variable opacity
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        opacity: brightness,
        transparent: true
      });
      
      // Create mesh combining geometry and material
      const star = new THREE.Mesh(geometry, material);

      // Set random position within -50 to +50 range on all axes
      const [x, y, z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(100));
      star.position.set(x, y, z);
      
      // Add movement properties to star's userData
      star.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1, // Random x velocity
          (Math.random() - 0.5) * 0.1, // Random y velocity
          (Math.random() - 0.5) * 0.1  // Random z velocity
        )
      };
      
      // Add star to scene and to our tracking array
      scene.add(star);
      stars.push(star);
    }

    // Create 600 stars by calling addStar function repeatedly
    Array(600).fill(0).forEach(addStar);

    // ==================== CREATE FLOATING OBJECTS ====================
    
    // Array to store all floating objects (planets and asteroids)
    const floatingObjects: THREE.Mesh[] = [];

    /**
     * Function to create a planet with specified properties
     * @param color - The color of the planet
     * @param size - The radius of the planet
     * @param x - Initial x position
     * @param y - Initial y position
     * @param z - Initial z position
     * @returns The created planet mesh
     */
    function createFloatingPlanet(color: number, size: number, x: number, y: number, z: number): THREE.Mesh {
      // Create sphere geometry with higher detail than stars
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      
      // Create material with color and emissive properties for glow effect
      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,       // Color that the material emits
        emissiveIntensity: 0.2 // Strength of the emissive effect
      });
      
      // Create mesh combining geometry and material
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(x, y, z);
      
      // Add movement and rotation properties to planet's userData
      planet.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2, // Random x velocity
          (Math.random() - 0.5) * 0.2, // Random y velocity
          (Math.random() - 0.5) * 0.2  // Random z velocity
        ),
        rotationSpeed: new THREE.Vector3(
          Math.random() * 0.02, // Random x rotation speed
          Math.random() * 0.02, // Random y rotation speed
          Math.random() * 0.02  // Random z rotation speed
        )
      };
      
      // Add planet to scene and to our tracking array
      scene.add(planet);
      floatingObjects.push(planet);
      return planet;
    }

    /**
     * Function to create an asteroid with specified properties
     * @param size - The radius of the asteroid
     * @param x - Initial x position
     * @param y - Initial y position
     * @param z - Initial z position
     * @returns The created asteroid mesh
     */
    function createAsteroid(size: number, x: number, y: number, z: number): THREE.Mesh {
      // Create icosahedron geometry (looks like a faceted rock)
      const geometry = new THREE.IcosahedronGeometry(size, 0);
      
      // Create material with gray color and slight emissive properties
      const material = new THREE.MeshStandardMaterial({
        color: 0x555555,
        emissive: 0x222222,
        emissiveIntensity: 0.1
      });
      
      // Create mesh combining geometry and material
      const asteroid = new THREE.Mesh(geometry, material);
      asteroid.position.set(x, y, z);
      
      // Add movement and rotation properties to asteroid's userData
      // Asteroids move and rotate faster than planets
      asteroid.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3, // Random x velocity (faster than planets)
          (Math.random() - 0.5) * 0.3, // Random y velocity
          (Math.random() - 0.5) * 0.3  // Random z velocity
        ),
        rotationSpeed: new THREE.Vector3(
          Math.random() * 0.03, // Random x rotation speed
          Math.random() * 0.03, // Random y rotation speed
          Math.random() * 0.03  // Random z rotation speed
        )
      };
      
      // Add asteroid to scene and to our tracking array
      scene.add(asteroid);
      floatingObjects.push(asteroid);
      return asteroid;
    }

    // Create several planets with different colors, sizes, and positions
    const planets = [
      createFloatingPlanet(0x8A4FFF, 0.5, 30, 20, -50),  // Purple planet
      createFloatingPlanet(0xFF6B6B, 0.7, -40, -15, -70), // Red planet
      createFloatingPlanet(0x4ECDC4, 0.4, 50, -25, -60)  // Teal planet
    ];

    // Create several asteroids with different sizes and positions
    const asteroids = [
      createAsteroid(0.2, 20, -10, -40),
      createAsteroid(0.3, -30, 15, -55),
      createAsteroid(0.15, 40, -30, -35)
    ];

    // ==================== CREATE MAIN SPHERE (ASTRALIS) ====================
    
    // Create geometry for the main glowing sphere
    const sphereGeometry = new THREE.SphereGeometry(10, 64, 64);
    
    // Create shader material for advanced visual effects
    const sphereMaterial = new THREE.ShaderMaterial({
      // Pass colors to shader as uniforms
      uniforms: {
        color1: { value: new THREE.Color(0x1a237e) }, // Deep blue
        color2: { value: new THREE.Color(0x0d47a1) }  // Slightly lighter blue
      },
      // Vertex shader - calculates position and passes normals to fragment shader
      vertexShader: `
        varying vec3 vertexNormal;
        void main() {
          vertexNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      // Fragment shader - creates gradient color based on surface normals
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vertexNormal;
        void main() {
          float intensity = pow(0.5 * dot(vertexNormal, vec3(0.0, 0.0, 1.0)) + 0.5, 2.0);
          gl_FragColor = vec4(mix(color1, color2, intensity), 0.8);
        }
      `,
      transparent: true // Allow transparency for fading effect
    });
    
    // Create mesh combining geometry and material
    const glowingSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(glowingSphere);

    // Create outer glow effect by adding a slightly larger transparent sphere
    const glowGeometry = new THREE.SphereGeometry(10.8, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a6cf7,    // Light blue color
      transparent: true,  // Enable transparency
      opacity: 0.2        // Mostly transparent
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);

    // ==================== LIGHTING ====================
    
    // Add ambient light for base illumination of all objects
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft gray light
    scene.add(ambientLight);

    // Add backlight for the Astralis sphere
    const backLight = new THREE.PointLight(0x6d8eff, 2, 100); // Blue point light
    backLight.position.set(-15, 5, -10); // Position behind the sphere
    scene.add(backLight);

    // Add main front light
    const pointLight = new THREE.PointLight(0xffffff, 0.7, 100); // White point light 
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // ==================== CAMERA & CONTROLS ====================
    
    // Set camera position
    camera.position.z = 35;

    // Set up OrbitControls for interactive camera movement
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;     // Disable zooming
    controls.enablePan = true;       // Enable panning
    controls.enableRotate = true;    // Enable rotation
    controls.enableDamping = true;   // Add smooth damping
    controls.dampingFactor = 0.05;   // Set damping amount

    // ==================== ANIMATION VARIABLES ====================
    
    // Variables to control central sphere animation
    let animationStarted = false;     // Animation state flag
    let animationTimer = 0;           // Timer for animation progress
    const animationStartDelay = 1.7;  // Delay before animation starts (seconds)
    const animationDuration = 1.5;    // Duration of animation (seconds)
    let sphereVisible = true;         // Visibility state of sphere

    // ==================== MOUSE MOVEMENT HANDLER ====================
    
    /**
     * Event handler for mouse movement
     * Calculates normalized mouse position for parallax effects
     */
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate normalized mouse position (-1 to 1 range)
      const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -((event.clientY / window.innerHeight) * 2 - 1);
      
      // Update mouse position state
      setMousePosition({ x: normalizedX, y: normalizedY });
    };
    
    // Add mouse move event listener
    window.addEventListener('mousemove', handleMouseMove);

    // ==================== ANIMATION LOOP ====================
    
    /**
     * Main animation function that updates and renders the scene
     * Called recursively using requestAnimationFrame
     */
    function animate() {
      // Schedule the next frame
      requestAnimationFrame(animate);
      
      // ===== SPHERE ANIMATION =====
      
      // Check if animation should start
      if (!animationStarted && animationTimer >= animationStartDelay) {
        animationStarted = true;
      }
      
      // Update animation timer
      animationTimer += 1/60; // Assuming 60fps
      
      // Handle sphere enlargement and disappearance animation
      if (animationStarted && sphereVisible) {
        // Calculate animation progress (0 to 1)
        const progress = Math.min((animationTimer - animationStartDelay) / animationDuration, 1);
        
        if (progress < 1) {
          // Scale up the sphere during animation
          const scale = 1 + progress * 2; // Enlarge to 3x size
          glowingSphere.scale.set(scale, scale, scale);
          glowMesh.scale.set(scale, scale, scale);
          
          // Fade out the sphere
          if (sphereMaterial.opacity !== undefined) {
            sphereMaterial.opacity = 0.8 * (1 - progress);
          }
          glowMaterial.opacity = 0.2 * (1 - progress);
        } else {
          // Animation complete - remove the sphere
          scene.remove(glowingSphere);
          scene.remove(glowMesh);
          sphereVisible = false;
        }
      }

      // ===== MOUSE PARALLAX EFFECT =====
      
      // Apply mouse-based parallax effect to stars and objects
      if (mousePosition.x !== 0 || mousePosition.y !== 0) {
        // Set strength of the parallax effect
        const parallaxStrength = 0.1;
        
        // Apply parallax effect to stars
        stars.forEach((star, index) => {
          // Different parallax amount based on "depth" (using index as proxy)
          // This creates a sense of 3D depth with closer stars moving more
          const depthFactor = 0.5 + (index % 10) / 10;
          star.position.x += mousePosition.x * parallaxStrength * depthFactor * 0.02;
          star.position.y += mousePosition.y * parallaxStrength * depthFactor * 0.02;
        });
        
        // Apply parallax effect to floating objects
        floatingObjects.forEach((obj, index) => {
          const depthFactor = 0.7 + (index % 3) / 3;
          obj.position.x += mousePosition.x * parallaxStrength * depthFactor * 0.01;
          obj.position.y += mousePosition.y * parallaxStrength * depthFactor * 0.01;
        });
      }

      // ===== STAR MOVEMENT =====
      
      // Move stars according to their velocities
      stars.forEach(star => {
        const velocity = star.userData.velocity as THREE.Vector3;
        star.position.add(velocity);
        
        // Wrap around when stars go beyond bounds (creates infinite space effect)
        if (Math.abs(star.position.x) > 100) star.position.x *= -1;
        if (Math.abs(star.position.y) > 100) star.position.y *= -1;
        if (Math.abs(star.position.z) > 100) star.position.z *= -1;
      });

      // ===== FLOATING OBJECT MOVEMENT =====
      
      // Move and rotate floating objects
      floatingObjects.forEach(obj => {
        const userData = obj.userData as FloatingObjectData;
        
        // Move object according to its velocity
        obj.position.add(userData.velocity);
        
        // Rotate object according to its rotation speed
        obj.rotation.x += userData.rotationSpeed.x;
        obj.rotation.y += userData.rotationSpeed.y;
        obj.rotation.z += userData.rotationSpeed.z;
        
        // Wrap around when objects go beyond bounds
        if (Math.abs(obj.position.x) > 100) obj.position.x *= -1;
        if (Math.abs(obj.position.y) > 100) obj.position.y *= -1;
        if (Math.abs(obj.position.z) > 100) obj.position.z *= -1;
      });

      // ===== SPHERE ROTATION =====
      
      // Rotate the central sphere while it's visible
      if (sphereVisible) {
        glowingSphere.rotation.y += 0.005;
        glowMesh.rotation.y += 0.005;
      }
      
      // Update orbit controls in animation loop (for smooth damping)
      controls.update();

      // Render the scene
      renderer.render(scene, camera);
    }
    
    // Start the animation loop
    animate();

    // ==================== RESPONSIVE DESIGN ====================
    
    /**
     * Handle window resize events to keep scene responsive
     */
    const handleResize = () => {
      // Update camera aspect ratio
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      // Update renderer size
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // ==================== CLEANUP FUNCTION ====================
    
    // Return cleanup function to remove event listeners and DOM elements
    return () => {
      // Remove Three.js canvas from DOM
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // ==================== CSS STYLES ====================
  
  // CSS styles for UI elements
  const styles = {
    // Main container for the entire component
    container: {
      width: '100%',
      height: '100vh',
      margin: 0,
      overflow: 'hidden',
      background: 'black',
      position: 'relative' as 'relative'
    },
    
    // Container for UI elements that overlay the 3D scene
    uiContainer: {
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontFamily: "'Inter', sans-serif",
      pointerEvents: 'none' as 'none' // Allow clicks to pass through to canvas
    },
    
    // Container for title and subtitle
    titleContainer: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      textAlign: 'center' as 'center',
      maxWidth: '80%',
      perspective: '500px' // Adds 3D perspective for potential effects
    },
    
    // Style for the main "Astralis" title
    astralisTitle: {
      color: 'white',
      fontSize: '4rem',
      position: 'relative' as 'relative',
      marginBottom: '10px',
      letterSpacing: '2px',
      textShadow: '0 0 15px rgba(74, 108, 247, 0.5), 0 0 25px rgba(74, 108, 247, 0.3)'
    },
    
    // Style for the subtitle text
    subtitle: {
      fontSize: '1.3rem',
      color: 'rgba(255, 255, 255, 0.8)',
      textShadow: '0 0 4px rgba(74, 108, 247, 0.2)',
      animation: 'subtle-pulse 5s infinite'
    },
    
    // Style for the "Start Your Journey" button
    // Shifted upward with marginTop: '10px' (changed from '30px')
    button: {
      marginTop: '10px', // Reduced from 30px to shift button upward
      padding: '12px 24px',
      background: 'rgba(74, 108, 247, 0.15)',
      border: '2px solid rgba(74, 108, 247, 0.4)',
      borderRadius: '30px',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      pointerEvents: 'auto' as 'auto', // Make button clickable
      position: 'relative' as 'relative',
      overflow: 'hidden',
      boxShadow: '0 0 8px rgba(74, 108, 247, 0.2)'
    }
  };

  // ==================== CSS ANIMATIONS ====================
  
  // CSS keyframe animations for text effects
  const keyframes = `
    /* Animation for letter illumination effect */
    @keyframes letter-illumination {
      0% { 
        color: rgba(255, 255, 255, 0.9);
        text-shadow: 0 0 10px rgba(74, 108, 247, 0.4), 0 0 20px rgba(74, 108, 247, 0.2);
      }
      50% { 
        color: rgba(255, 255, 255, 1);
        text-shadow: 0 0 15px rgba(74, 108, 247, 0.7), 0 0 30px rgba(74, 108, 247, 0.5), 0 0 45px rgba(74, 108, 247, 0.3);
      }
      100% { 
        color: rgba(255, 255, 255, 0.9);
        text-shadow: 0 0 10px rgba(74, 108, 247, 0.4), 0 0 20px rgba(74, 108, 247, 0.2);
      }
    }

    /* Animation for subtle opacity changes in subtitle */
    @keyframes subtle-pulse {
      0% { opacity: 0.75; }
      50% { opacity: 0.9; }
      100% { opacity: 0.75; }
    }
  `;

  /**
   * Function to create illuminated letter elements with staggered animations
   * @param text - The text to be illuminated
   * @returns Array of span elements, one for each letter
   */
  const createIlluminatedTitle = (text: string) => {
    return text.split('').map((letter, index) => {
      // Calculate delay based on letter position for wave-like effect
      const delay = index * 0.15;
      
      return (
        <span 
          key={index} 
          style={{
            display: 'inline-block',
            animation: `letter-illumination 3s infinite ease-in-out ${delay}s`,
            willChange: 'text-shadow' // Performance optimization hint for browsers
          }}
        >
          {letter}
        </span>
      );
    });
  };

  /**
   * Event handler for button hover
   * Increases glow and background opacity
   */
  const handleButtonHover = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = 'rgba(74, 108, 247, 0.25)'; // Brighter background
    e.currentTarget.style.boxShadow = '0 0 12px rgba(74, 108, 247, 0.3)'; // Stronger glow
  };

  /**
   * Event handler for button mouse leave
   * Returns button to normal state
   */
  const handleButtonLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = 'rgba(74, 108, 247, 0.15)'; // Normal background
    e.currentTarget.style.boxShadow = '0 0 8px rgba(74, 108, 247, 0.2)'; // Normal glow
  };

  /**
   * Event handler for button click
   * Navigates to planets page
   */
  const handleButtonClick = () => {
    window.location.href = '/landing';
  };

  // ==================== COMPONENT RENDER ====================
  
  return (
    <div style={styles.container}>
      {/* Animation keyframes - injected into page */}
      <style>{keyframes}</style>
      
      {/* Three.js container - canvas will be appended here */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      
      {/* UI Elements overlay */}
      <div style={styles.uiContainer}>
        <div style={styles.titleContainer}>
          <div>
            {/* Title with illuminated letters */}
            <h1 style={styles.astralisTitle}>
              {createIlluminatedTitle('Astralis')}
            </h1>
            {/* Subtitle with subtle pulsing animation */}
            <p style={styles.subtitle}>Explore the Infinite Universe</p>
          </div>
          {/* Interactive button with hover effects */}
          <div 
            style={styles.button}
            onMouseOver={handleButtonHover}
            onMouseOut={handleButtonLeave}
            onClick={handleButtonClick}
          >
            Start Your Journey
          </div>
        </div>
      </div>
    </div>
  );
};

export default Astralis