import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const comparisonExamples = {
  knight: {
    prompt: "A stylized knight character with a hexagonal helmet with a horizontal eye slit, rigid armor plates, a rectangular shield, and a sword arranged in a combat-ready pose.",
    image: "assets/images/comparison_knight_results.jpg",
    alt: "Qualitative comparison for the knight prompt"
  },
  dog: {
    prompt: "A small dog figurine in a sitting pose with upward-facing triangular ears, eyes, nose, and colorful splashes on feet, body, and collar.",
    image: "assets/images/comparison_dog_results.jpg",
    alt: "Qualitative comparison for the dog prompt"
  },
  buddha: {
    prompt: "A rigid Buddha bust with a slender neck, broad shoulders, elongated ears, spiral curls, and a tapered base.",
    image: "assets/images/comparison_buddha_results.jpg",
    alt: "Qualitative comparison for the Buddha prompt"
  },
  gazebo: {
    prompt: "An octagonal gazebo with a conical roof with a finial, eight vertical support columns, a perimeter railing with vertical balusters, and a slightly elevated flat base with an entry opening.",
    image: "assets/images/comparison_gazebo_results.jpg",
    alt: "Qualitative comparison for the gazebo prompt"
  },
  shoe: {
    prompt: "A high-top athletic shoe with a rigid upper, perforated toe box, and a multi-part midsole and outsole arranged in a layered configuration.",
    image: "assets/images/comparison_shoe_results.jpg",
    alt: "Qualitative comparison for the shoe prompt"
  }
};

const methodFigures = {
  concept: {
    src: "assets/images/concept.png",
    alt: "Conceptual comparison between autoregressive generation, diffusion, and Block3D",
    caption: "Block3D retains causal structure across blocks while enabling parallel, bidirectional denoising within each active block."
  },
  pipeline: {
    src: "assets/images/pipeline.jpg",
    alt: "Block3D training and inference pipeline",
    caption: "Training uses a block-causal visibility pattern; inference alternates masked-token recovery with confidence-guided token correction."
  }
};

const refreshIcons = () => window.lucide?.createIcons({ attrs: { "stroke-width": 1.8 } });
refreshIcons();

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navToggle.setAttribute("title", isOpen ? "Open navigation" : "Close navigation");
  nav.classList.toggle("is-open", !isOpen);
  navToggle.innerHTML = `<i data-lucide="${isOpen ? "menu" : "x"}" aria-hidden="true"></i>`;
  refreshIcons();
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  navToggle.setAttribute("title", "Open navigation");
  navToggle.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
  nav.classList.remove("is-open");
  refreshIcons();
}));

const video = document.querySelector("#project-video");
const chapters = [...document.querySelectorAll(".chapter")];

chapters.forEach((chapter) => {
  chapter.addEventListener("click", async () => {
    const seek = () => {
      video.currentTime = Number(chapter.dataset.time);
      video.play().catch(() => {});
    };

    chapters.forEach((item) => item.classList.toggle("is-active", item === chapter));
    if (video.readyState >= 1) seek();
    else video.addEventListener("loadedmetadata", seek, { once: true });
  });
});

video.addEventListener("timeupdate", () => {
  const active = [...chapters].reverse().find((chapter) => video.currentTime >= Number(chapter.dataset.time));
  if (active) chapters.forEach((chapter) => chapter.classList.toggle("is-active", chapter === active));
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    const example = comparisonExamples[button.dataset.example];
    document.querySelectorAll("[data-example]").forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    const image = document.querySelector("#comparison-image");
    const figure = image.closest("[data-zoom-src]");
    image.src = example.image;
    image.alt = example.alt;
    figure.dataset.zoomSrc = example.image;
    figure.dataset.zoomAlt = example.alt;
    document.querySelector("#comparison-prompt").textContent = example.prompt;
  });
});

document.querySelectorAll("[data-method]").forEach((button) => {
  button.addEventListener("click", () => {
    const figureData = methodFigures[button.dataset.method];
    document.querySelectorAll("[data-method]").forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    const image = document.querySelector("#method-image");
    const figure = image.closest("[data-zoom-src]");
    image.src = figureData.src;
    image.alt = figureData.alt;
    figure.dataset.zoomSrc = figureData.src;
    figure.dataset.zoomAlt = figureData.alt;
    document.querySelector("#method-caption").textContent = figureData.caption;
  });
});

const modal = document.querySelector(".image-modal");
const modalImage = modal.querySelector("img");
const modalCaption = modal.querySelector("p");

document.querySelectorAll("[data-zoom-src]").forEach((button) => {
  button.addEventListener("click", () => {
    modalImage.src = button.dataset.zoomSrc;
    modalImage.alt = button.dataset.zoomAlt || "Full-size figure";
    modalCaption.textContent = button.dataset.zoomAlt || "";
    modal.showModal();
    document.body.classList.add("modal-open");
  });
});

const closeModal = () => {
  modal.close();
  document.body.classList.remove("modal-open");
};
modal.querySelector(".modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
modal.addEventListener("close", () => document.body.classList.remove("modal-open"));

document.querySelector("[data-copy]").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(document.querySelector("#bibtex").innerText);
    button.innerHTML = '<i data-lucide="check" aria-hidden="true"></i><span>Copied</span>';
    refreshIcons();
    setTimeout(() => {
      button.innerHTML = '<i data-lucide="copy" aria-hidden="true"></i><span>Copy</span>';
      refreshIcons();
    }, 1800);
  } catch (_) {
    button.querySelector("span").textContent = "Select text";
  }
});

const meshStage = document.querySelector("#mesh-stage");
const meshPreview = document.querySelector("#mesh-preview");
const meshPoster = document.querySelector("#mesh-poster");
const meshTitle = document.querySelector("#mesh-title");
const meshStatus = document.querySelector("[data-mesh-status]");
const meshLoadButton = document.querySelector("[data-load-mesh]");
const modelButtons = [...document.querySelectorAll("[data-model]")];
const autoRotateButton = document.querySelector("[data-auto-rotate]");
const resetCameraButton = document.querySelector("[data-reset-camera]");
const viewModeButtons = [...document.querySelectorAll("[data-view-mode]")];

let renderer;
let scene;
let camera;
let controls;
let activeModel;
let activeModelKey;
let activeRequest = 0;
let isLoading = false;
let autoRotate = true;
let wireframe = false;
let resizeObserver;
let meshFloor;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const selectedModelButton = () => document.querySelector("[data-model].is-active");

function initMeshViewer() {
  if (renderer) return;

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  meshStage.prepend(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c100e);

  camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
  camera.position.set(3.2, 2.2, 4.2);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = 1.35;
  controls.minDistance = 1.4;
  controls.maxDistance = 9;
  controls.target.set(0, 0, 0);

  const hemisphere = new THREE.HemisphereLight(0xdff9ed, 0x1a201d, 2.3);
  scene.add(hemisphere);

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
  keyLight.position.set(4, 7, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xf08869, 2.2);
  rimLight.position.set(-5, 2, -4);
  scene.add(rimLight);

  meshFloor = new THREE.Mesh(
    new THREE.CircleGeometry(3.1, 72),
    new THREE.MeshStandardMaterial({ color: 0x151b18, roughness: .92, metalness: 0 })
  );
  meshFloor.rotation.x = -Math.PI / 2;
  meshFloor.position.y = -1.28;
  meshFloor.receiveShadow = true;
  scene.add(meshFloor);

  resizeObserver = new ResizeObserver(resizeMeshViewer);
  resizeObserver.observe(meshStage);
  resizeMeshViewer();
  renderer.setAnimationLoop(renderMeshViewer);
}

function resizeMeshViewer() {
  if (!renderer) return;
  const width = Math.max(meshStage.clientWidth, 1);
  const height = Math.max(meshStage.clientHeight, 1);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function renderMeshViewer() {
  if (!renderer) return;
  controls.update();
  renderer.render(scene, camera);
}

function disposeActiveModel() {
  if (!activeModel) return;
  scene.remove(activeModel);
  activeModel.traverse((child) => {
    if (!child.isMesh) return;
    child.geometry?.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => material?.dispose());
  });
  activeModel = null;
}

function resetCamera() {
  if (!camera || !controls) return;
  camera.position.set(3.2, 2.2, 4.2);
  controls.target.set(0, 0, 0);
  controls.update();
}

function showMeshPreview() {
  meshPreview.hidden = false;
  meshPoster.hidden = true;
  meshLoadButton.hidden = false;
}

function showPosterFallback() {
  meshPreview.hidden = true;
  meshPoster.hidden = false;
  meshLoadButton.hidden = false;
}

meshPreview.addEventListener("error", showPosterFallback);

function updateModelMaterials() {
  if (!activeModel) return;
  activeModel.traverse((child) => {
    if (child.isMesh && child.material) child.material.wireframe = wireframe;
  });
}

async function loadSelectedModel() {
  if (isLoading) return;
  initMeshViewer();

  const button = selectedModelButton();
  const requestId = ++activeRequest;
  isLoading = true;
  meshLoadButton.disabled = true;
  meshLoadButton.querySelector("span").textContent = "Loading";
  meshStatus.textContent = `Loading ${button.dataset.title}`;

  try {
    const gltf = await gltfLoader.loadAsync(button.dataset.src);
    if (requestId !== activeRequest) return;

    disposeActiveModel();
    activeModel = gltf.scene;
    activeModelKey = button.dataset.model;

    activeModel.traverse((child) => {
      if (!child.isMesh) return;
      child.geometry.computeVertexNormals();
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(button.dataset.color || "#b9c9c0"),
        roughness: .56,
        metalness: .06,
        side: THREE.DoubleSide,
        wireframe
      });
    });

    const initialBounds = new THREE.Box3().setFromObject(activeModel);
    const initialSize = initialBounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(initialSize.x, initialSize.y, initialSize.z) || 1;
    activeModel.scale.setScalar(2.55 / longestSide);

    const bounds = new THREE.Box3().setFromObject(activeModel);
    const center = bounds.getCenter(new THREE.Vector3());
    activeModel.position.sub(center);
    activeModel.rotation.y = -0.35;
    scene.add(activeModel);

    const centeredBounds = new THREE.Box3().setFromObject(activeModel);
    meshFloor.position.y = centeredBounds.min.y - 0.04;

    meshPreview.hidden = true;
    meshPoster.hidden = true;
    meshLoadButton.hidden = true;
    meshStatus.textContent = button.dataset.title;
    resetCamera();
  } catch (error) {
    console.error("Unable to load mesh", error);
    showMeshPreview();
    meshStatus.textContent = "3D asset unavailable";
  } finally {
    if (requestId === activeRequest) {
      isLoading = false;
      meshLoadButton.disabled = false;
      meshLoadButton.querySelector("span").textContent = "Load 3D";
    }
  }
}

meshLoadButton.addEventListener("click", loadSelectedModel);

modelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modelButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    meshTitle.textContent = button.dataset.title;
    meshPoster.src = button.dataset.poster;
    meshPoster.alt = `Preview of the ${button.dataset.title} mesh`;

    if (renderer && activeModelKey !== button.dataset.model) {
      isLoading = false;
      loadSelectedModel();
    }
  });
});

viewModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    wireframe = button.dataset.viewMode === "wireframe";
    viewModeButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    updateModelMaterials();
  });
});

autoRotateButton.addEventListener("click", () => {
  autoRotate = !autoRotate;
  autoRotateButton.setAttribute("aria-pressed", String(autoRotate));
  autoRotateButton.setAttribute("aria-label", autoRotate ? "Pause automatic rotation" : "Start automatic rotation");
  autoRotateButton.setAttribute("title", autoRotate ? "Pause automatic rotation" : "Start automatic rotation");
  autoRotateButton.innerHTML = `<i data-lucide="${autoRotate ? "pause" : "play"}" aria-hidden="true"></i>`;
  if (controls) controls.autoRotate = autoRotate;
  refreshIcons();
});

resetCameraButton.addEventListener("click", resetCamera);

window.addEventListener("pagehide", () => {
  resizeObserver?.disconnect();
  renderer?.setAnimationLoop(null);
  renderer?.dispose();
  dracoLoader.dispose();
});
