document.addEventListener('DOMContentLoaded', () => {
    // --- Simulation UI Setup ---
    const velocitySlider = document.getElementById('velocity');
    const velocityValueDisplay = document.getElementById('velocity-value');
    const gammaDisplay = document.getElementById('gamma');
    const dilatedTimeDisplay = document.getElementById('dilated-time');
    const t0Display = document.getElementById('t0-display');
    const t0 = 1;
    t0Display.textContent = t0;

    function updateSimulation() {
        const v = parseFloat(velocitySlider.value);
        velocityValueDisplay.textContent = v.toFixed(0);

        fetch(`/simulate?v=${v}&t0=${t0}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    gammaDisplay.textContent = data.error;
                    dilatedTimeDisplay.textContent = data.error;
                } else {
                    gammaDisplay.textContent = data.gamma.toFixed(4);
                    dilatedTimeDisplay.textContent = data.dilated_time.toFixed(4);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    velocitySlider.addEventListener('input', updateSimulation);
    updateSimulation();

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Attach the renderer to our dedicated container
    document.getElementById('three-container').appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Create a Sun with MeshPhongMaterial to show rotation better
    const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFF00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Create a Planet
    const planetGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const planetMaterial = new THREE.MeshPhongMaterial({ color: 0x0000FF });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(3, 0, 0);
    scene.add(planet);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Position the camera so that all objects are in view
    camera.position.z = 7;

    function animate() {
        requestAnimationFrame(animate);

        // Increase rotation increments temporarily to see the effect
        sun.rotation.y += 0.05;
        planet.rotation.y += 0.1;

        renderer.render(scene, camera);
    }
    animate();
});