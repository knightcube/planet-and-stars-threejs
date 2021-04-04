import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GeometryUtils } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const starTexture = textureLoader.load('/textures/particles/1.png')
const myTex2 =  textureLoader.load('/textures/particles/2.png')
const myTex3 =  textureLoader.load('/textures/particles/3.png')
const myTex4 =  textureLoader.load('/textures/particles/4.png')
const myTex5 =  textureLoader.load('/textures/particles/5.png')
const myTex6 =  textureLoader.load('/textures/particles/6.png')
const myTex7 =  textureLoader.load('/textures/particles/7.png')

/**
 * Particles
 */
const particlesGeometry = new THREE.SphereBufferGeometry(0.5,32,32)
var particlesMaterial = new THREE.PointsMaterial({
    size:0.02,
    sizeAttenuation: true,
    color:'#8bf4f7'
})
const particles = new THREE.Points(particlesGeometry,particlesMaterial)

// Cube
const cubeGeometry = new THREE.TorusGeometry( 0.6, 0.01, 5,100);
const cubeMat = new THREE.MeshBasicMaterial({
    color:'#8bf4f7'
})
// cubeMat.transparent = true
// cubeMat.opacity = 0.5
const cubeMesh = new THREE.Mesh(cubeGeometry,cubeMat)
const cubeMesh2 = new THREE.Mesh(cubeGeometry,cubeMat)
const cubeMesh3 = new THREE.Mesh(cubeGeometry,cubeMat)
const cubeMesh4 = new THREE.Mesh(cubeGeometry,cubeMat)
 
// scene.add(cubeMesh)
// scene.add(cubeMesh2)
// scene.add(cubeMesh3)
// scene.add(cubeMesh4)
cubeMesh.rotation.x = Math.PI/4
cubeMesh2.rotation.x= 3*Math.PI/4
cubeMesh3.rotation.x = Math.PI/2

// Sphere
const sphereGeometry = new THREE.SphereBufferGeometry(0.3,32,32)
const sphereTexture = textureLoader.load('tex1.jpg')
const sphereMat = new THREE.MeshBasicMaterial({
    color:'#8bf4f7',
    map: sphereTexture
})
const sphereMesh = new THREE.Mesh(sphereGeometry,sphereMat)

const planet = new THREE.Group();
planet.add(particles)
planet.add(sphereMesh)
planet.add(cubeMesh);
planet.add(cubeMesh2);
planet.add(cubeMesh3);
planet.add(cubeMesh4);
scene.add(planet)



/**
 * Particles with custom Geometry
 */
const particlesCustomGeometry = new THREE.BufferGeometry()
const count = 2000

const vertices = new Float32Array(count*3)
for(let i= 0; i<count*3;i++){
    vertices[i] = (Math.random()-0.5) * 10
}

particlesCustomGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(vertices,3)
)
const particleCustommaterial = new THREE.PointsMaterial({
    color:'#00f7d8',
    map:starTexture
})
particleCustommaterial.size = 0.1
particleCustommaterial.sizeAttenuation = true
particleCustommaterial.transparent = true
particleCustommaterial.alphaMap = starTexture
particleCustommaterial.alphaTest = 0.001
// const mesh = new THREE.Mesh(particlesCustomGeometry,material)
const customParticles = new THREE.Points(
    particlesCustomGeometry,
    particleCustommaterial
)
scene.add(customParticles)
// scene.add(mesh)

/**
 * Test cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime() 
    // customParticles.position.z = (Math.sin(elapsedTime) -0.5) * 0.001
    // customParticles.position.y= (Math.sin(2*Math.PI*elapsedTime) -0.5) *0.0001
    // customParticles.position.x = (Math.cos(elapsedTime) -0.5) * 0.0001
    
    customParticles.position.x = Math.sin(elapsedTime) * 0.1
    customParticles.position.z = -Math.cos(elapsedTime) * 0.1

    planet.position.x = Math.sin(elapsedTime) * 2
    planet.position.z = -Math.cos(elapsedTime) * 2

    sphereMesh.rotation.y = -elapsedTime

    // particles.position.x = Math.sin(elapsedTime) * 2
    // particles.position.z = -Math.cos(elapsedTime) * 2

    // sphereMesh.position.x = particles.position.x
    // sphereMesh.position.z = particles.position.z

    cubeMesh.rotation.x = elapsedTime
    cubeMesh2.rotation.y = elapsedTime
    cubeMesh3.rotation.y = -elapsedTime
    cubeMesh4.rotation.x = -elapsedTime


    particlesMaterial.size = Math.sin(elapsedTime) * 0.01
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()