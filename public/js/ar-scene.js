import { applyDecorationAnimation, flashSelection } from "/public/js/animations.js";

export const THEMES = {
  gold: {
    lotus: "#f9b4d0",
    lantern: "#dd4a2e",
    flame: "#ffc34a",
    buddha: "#f2c76a",
    sparkle: "#fff3c2"
  },
  saffron: {
    lotus: "#f6d0ba",
    lantern: "#d97025",
    flame: "#ffe597",
    buddha: "#d3a15e",
    sparkle: "#fff6db"
  },
  ruby: {
    lotus: "#f8bfd5",
    lantern: "#b32d2d",
    flame: "#ff944f",
    buddha: "#ffd2aa",
    sparkle: "#ffd3d3"
  }
};

const DECORATION_TYPES = ["lotus", "lantern", "flame", "buddha", "sparkle"];

export function initArScene({ sceneEl, worldRootEl, onToast, initialTheme = "gold" }) {
  let currentTheme = initialTheme;
  let selectedEntity = null;
  let selectedType = "lotus";
  let sceneScale = 1;
  let rotationY = 0;
  let interactionLockedUntil = 0;

  const lockInteraction = () => {
    interactionLockedUntil = Date.now() + 250;
  };

  const randomPosition = () => {
    const spread = 1.4;
    const x = (Math.random() * spread * 2) - spread;
    const y = 0.2 + Math.random() * 1.5;
    const z = -0.2 + Math.random() * 0.8;
    return `${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)}`;
  };

  const createParticleCluster = (parent, color) => {
    for (let i = 0; i < 8; i += 1) {
      const particle = document.createElement("a-sphere");
      particle.setAttribute("radius", "0.03");
      particle.setAttribute("position", `${(Math.random() - 0.5).toFixed(2)} ${(Math.random() * 0.6).toFixed(2)} ${(Math.random() - 0.5).toFixed(2)}`);
      particle.setAttribute("material", `color: ${color}; emissive: ${color}; emissiveIntensity: 0.8; opacity: 0.75`);
      particle.setAttribute("animation", `property: position; dir: alternate; dur: ${1000 + (i * 180)}; loop: true; to: ${(Math.random() - 0.5).toFixed(2)} ${(0.9 + Math.random() * 0.4).toFixed(2)} ${(Math.random() - 0.5).toFixed(2)}`);
      parent.appendChild(particle);
    }
  };

  const colorFor = (type) => THEMES[currentTheme][type] || "#ffffff";

  const setupSelectable = (entity, type) => {
    entity.classList.add("decoration");
    entity.dataset.type = type;
    entity.addEventListener("click", (event) => {
      event.stopPropagation();
      selectedEntity = entity;
      flashSelection(entity);
      lockInteraction();
      onToast(`${type} selected`);
    });
  };

  const makeLotus = () => {
    const lotus = document.createElement("a-entity");

    const core = document.createElement("a-sphere");
    core.setAttribute("radius", "0.18");
    core.setAttribute("material", `color: ${colorFor("lotus")}; roughness: 0.4`);
    lotus.appendChild(core);

    for (let i = 0; i < 8; i += 1) {
      const petal = document.createElement("a-cone");
      petal.setAttribute("radius-bottom", "0.06");
      petal.setAttribute("radius-top", "0.01");
      petal.setAttribute("height", "0.22");
      petal.setAttribute("position", `${(Math.cos(i * 0.78) * 0.2).toFixed(2)} 0 ${(Math.sin(i * 0.78) * 0.2).toFixed(2)}`);
      petal.setAttribute("rotation", `90 ${i * 45} 0`);
      petal.setAttribute("material", `color: ${colorFor("lotus")}`);
      lotus.appendChild(petal);
    }

    return lotus;
  };

  const makeLantern = () => {
    const lantern = document.createElement("a-entity");

    const body = document.createElement("a-cylinder");
    body.setAttribute("radius", "0.16");
    body.setAttribute("height", "0.42");
    body.setAttribute("material", `color: ${colorFor("lantern")}; metalness: 0.2`);
    lantern.appendChild(body);

    const flame = document.createElement("a-sphere");
    flame.setAttribute("radius", "0.08");
    flame.setAttribute("position", "0 0.24 0");
    flame.setAttribute("material", `color: ${colorFor("flame")}; emissive: ${colorFor("flame")}; emissiveIntensity: 1`);
    lantern.appendChild(flame);

    createParticleCluster(lantern, colorFor("sparkle"));
    return lantern;
  };

  const makeFlame = () => {
    const flameRoot = document.createElement("a-entity");

    const flame = document.createElement("a-cone");
    flame.setAttribute("radius-bottom", "0.15");
    flame.setAttribute("radius-top", "0.02");
    flame.setAttribute("height", "0.4");
    flame.setAttribute("material", `color: ${colorFor("flame")}; emissive: ${colorFor("flame")}; emissiveIntensity: 0.9`);
    flameRoot.appendChild(flame);

    createParticleCluster(flameRoot, colorFor("sparkle"));
    return flameRoot;
  };

  const makeBuddha = () => {
    const buddha = document.createElement("a-entity");

    const body = document.createElement("a-cylinder");
    body.setAttribute("radius", "0.18");
    body.setAttribute("height", "0.44");
    body.setAttribute("material", `color: ${colorFor("buddha")}; metalness: 0.1`);
    buddha.appendChild(body);

    const head = document.createElement("a-sphere");
    head.setAttribute("radius", "0.12");
    head.setAttribute("position", "0 0.29 0");
    head.setAttribute("material", `color: ${colorFor("buddha")}; emissive: ${colorFor("buddha")}; emissiveIntensity: 0.35`);
    buddha.appendChild(head);

    const halo = document.createElement("a-ring");
    halo.setAttribute("radius-inner", "0.25");
    halo.setAttribute("radius-outer", "0.29");
    halo.setAttribute("position", "0 0.35 -0.02");
    halo.setAttribute("material", `color: ${colorFor("sparkle")}; emissive: ${colorFor("sparkle")}; emissiveIntensity: 0.9`);
    buddha.appendChild(halo);

    return buddha;
  };

  const makeSparkle = () => {
    const cluster = document.createElement("a-entity");
    createParticleCluster(cluster, colorFor("sparkle"));
    return cluster;
  };

  const builders = {
    lotus: makeLotus,
    lantern: makeLantern,
    flame: makeFlame,
    buddha: makeBuddha,
    sparkle: makeSparkle
  };

  const spawnDecoration = (type = selectedType, position = randomPosition()) => {
    if (!DECORATION_TYPES.includes(type)) {
      return;
    }

    const root = document.createElement("a-entity");
    root.setAttribute("position", position);
    root.setAttribute("scale", "1 1 1");

    const body = (builders[type] || builders.lotus)();
    root.appendChild(body);

    setupSelectable(root, type);
    applyDecorationAnimation(root, type);
    worldRootEl.appendChild(root);

    selectedEntity = root;
    onToast(`${type} placed`);
    return root;
  };

  const resetScene = () => {
    while (worldRootEl.firstChild) {
      worldRootEl.removeChild(worldRootEl.firstChild);
    }

    sceneScale = 1;
    rotationY = 0;
    worldRootEl.setAttribute("scale", "1 1 1");
    worldRootEl.setAttribute("rotation", "0 0 0");
    selectedEntity = null;

    spawnDecoration("lotus", "-0.9 0.5 0.1");
    spawnDecoration("lantern", "0.9 1.1 0.1");
    spawnDecoration("buddha", "0 0.3 0");
  };

  const setTheme = (themeName) => {
    if (!THEMES[themeName]) {
      return;
    }

    currentTheme = themeName;
    const currentItems = Array.from(worldRootEl.querySelectorAll(".decoration"));
    const snapshot = currentItems.map((entity) => ({
      type: entity.dataset.type,
      position: entity.getAttribute("position")
    }));

    resetScene();

    snapshot.forEach((item) => {
      if (item.type && item.position) {
        spawnDecoration(item.type, `${item.position.x} ${item.position.y} ${item.position.z}`);
      }
    });

    onToast(`Theme changed: ${themeName}`);
  };

  const setSelectedType = (type) => {
    if (DECORATION_TYPES.includes(type)) {
      selectedType = type;
    }
  };

  const gestureState = {
    startX: 0,
    startY: 0,
    isDragging: false,
    startDistance: 0,
    pinchInProgress: false
  };

  const distance = (touchA, touchB) => {
    const dx = touchA.clientX - touchB.clientX;
    const dy = touchA.clientY - touchB.clientY;
    return Math.sqrt((dx * dx) + (dy * dy));
  };

  const targetForScale = () => selectedEntity || worldRootEl;

  sceneEl.addEventListener("touchstart", (event) => {
    if (event.touches.length === 1) {
      gestureState.startX = event.touches[0].clientX;
      gestureState.startY = event.touches[0].clientY;
      gestureState.isDragging = false;
    }

    if (event.touches.length === 2) {
      gestureState.startDistance = distance(event.touches[0], event.touches[1]);
      gestureState.pinchInProgress = true;
    }
  }, { passive: true });

  sceneEl.addEventListener("touchmove", (event) => {
    if (event.touches.length === 1) {
      const deltaX = event.touches[0].clientX - gestureState.startX;
      if (Math.abs(deltaX) > 2) {
        gestureState.isDragging = true;
        rotationY += deltaX * 0.15;
        worldRootEl.setAttribute("rotation", `0 ${rotationY.toFixed(2)} 0`);
        gestureState.startX = event.touches[0].clientX;
      }
    }

    if (event.touches.length === 2 && gestureState.pinchInProgress) {
      const currentDistance = distance(event.touches[0], event.touches[1]);
      const delta = (currentDistance - gestureState.startDistance) * 0.003;
      const scaleTarget = targetForScale();
      const current = scaleTarget.getAttribute("scale");
      const next = Math.max(0.45, Math.min(2.8, current.x + delta));
      scaleTarget.setAttribute("scale", `${next.toFixed(2)} ${next.toFixed(2)} ${next.toFixed(2)}`);
      gestureState.startDistance = currentDistance;
      sceneScale = next;
    }
  }, { passive: true });

  sceneEl.addEventListener("touchend", () => {
    gestureState.pinchInProgress = false;

    if (!gestureState.isDragging && Date.now() > interactionLockedUntil) {
      spawnDecoration(selectedType);
    }
  });

  sceneEl.addEventListener("click", (event) => {
    const tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
    if (tag !== "canvas" && !(event.target && event.target.classList && event.target.classList.contains("a-canvas"))) {
      return;
    }

    if (Date.now() > interactionLockedUntil) {
      spawnDecoration(selectedType);
    }
  });

  const getSceneState = () => ({
    theme: currentTheme,
    selectedType,
    scale: sceneScale,
    count: worldRootEl.querySelectorAll(".decoration").length
  });

  resetScene();

  return {
    spawnDecoration,
    resetScene,
    setTheme,
    setSelectedType,
    getSceneState,
    getSelectedType: () => selectedType
  };
}
