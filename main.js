// Basic setup (same as before)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Create a 3D text mesh
let textMesh;
let loadedFont; // Declare a variable to store the loaded font

const loader = new THREE.FontLoader();
loader.load(
  'IBM_Plex_Mono_Bold.json', // Ensure this path is correct
  function (font) {
    console.log('Font loaded successfully:', font);
    loadedFont = font;

    // First text: PROHIBITED
    const geometry1 = new THREE.TextGeometry('PROHIBITED', {
      font: font,
      size: 1,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 5,
    });

    const material1 = new THREE.MeshPhongMaterial({
      color: 0x857972,
      transparent: true,
      opacity: 0, // Initially transparent
    });
    textMesh1 = new THREE.Mesh(geometry1, material1);

    textMesh1.position.set(-4, 0, -0.1); // Move "PROHIBITED" slightly backward

    // Second text: PERMITTED
    const geometry2 = new THREE.TextGeometry('PERMITTED', {
      font: font,
      size: 1,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 5,
    });

    const material2 = new THREE.MeshPhongMaterial({
      color: 0x857972,
      shininess: 50, // Adjust shininess
      specular: 0xaaaaaa, // Adjust specular highlights
      transparent: true,
      opacity: 1,
    });
    textMesh2 = new THREE.Mesh(geometry2, material2);

    textMesh2.position.set(-4, 0, 0.1);  // Move "PERMITTED" slightly forward

    // Add meshes and start the loop
    scene.add(textMesh1);
    scene.add(textMesh2);

    startLoop();
  },
  undefined,
  function (error) {
    console.error('Error loading font:', error);
  }
);

function scrambleText(mesh, finalText, callback) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let iterations = 0;
    let currentText = Array(finalText.length).fill('');
  
    const interval = setInterval(() => {
      for (let i = 0; i < finalText.length; i++) {
        if (currentText[i] !== finalText[i]) {
          currentText[i] =
            Math.random() > iterations / 20
              ? chars[Math.floor(Math.random() * chars.length)]
              : finalText[i];
        }
      }
  
      const scrambled = currentText.join('');
      const position = mesh.position.clone();
  
      mesh.geometry.dispose();
      mesh.geometry = new THREE.TextGeometry(scrambled, {
        font: loadedFont,
        size: 1,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 5,
      });
      mesh.geometry.needsUpdate = true;
      mesh.position.copy(position);
  
      iterations++;
      if (iterations > 20) {
        clearInterval(interval);
        if (callback) callback(); // Run the next step
      }
    }, 150);
  }
  

  function startLoop() {
    scrambleText(textMesh2, 'PERMITTED', () => {
      setTimeout(() => {
        console.log('Hiding PERMITTED, showing PROHIBITED');
        textMesh2.material.opacity = 0;
        textMesh1.material.opacity = 1;
  
        scrambleText(textMesh1, 'PROHIBITED', () => {
          setTimeout(() => {
            console.log('Hiding PROHIBITED, showing PERMITTED');
            textMesh1.material.opacity = 0;
            textMesh2.material.opacity = 1;
  
            // Restart the loop
            startLoop();
          }, 1000); // Wait after PROHIBITED scrambling
        });
      }, 1000); // Wait after PERMITTED scrambling
    });
  }
  

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
