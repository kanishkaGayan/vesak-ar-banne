export function applyDecorationAnimation(entity, type) {
  if (type === "lotus") {
    entity.setAttribute("animation__bob", "property: position; dir: alternate; dur: 1800; loop: true; to: 0 0.08 0");
    entity.setAttribute("animation__spin", "property: rotation; dur: 7000; loop: true; to: 0 360 0");
  }

  if (type === "lantern") {
    entity.setAttribute("animation__swing", "property: rotation; dir: alternate; dur: 1600; loop: true; to: 0 0 12");
  }

  if (type === "flame") {
    entity.setAttribute("animation__pulse", "property: scale; dir: alternate; dur: 650; loop: true; to: 1.15 1.5 1.15");
  }

  if (type === "buddha") {
    entity.setAttribute("animation__glow", "property: scale; dir: alternate; dur: 2000; loop: true; to: 1.06 1.06 1.06");
    entity.setAttribute("animation__turn", "property: rotation; dur: 14000; loop: true; to: 0 360 0");
  }

  if (type === "sparkle") {
    entity.setAttribute("animation__rise", "property: position; dir: alternate; dur: 2200; loop: true; to: 0 0.45 0");
  }
}

export function flashSelection(entity) {
  entity.setAttribute("animation__select", "property: scale; dur: 180; to: 1.15 1.15 1.15");
  setTimeout(() => {
    entity.setAttribute("animation__selectback", "property: scale; dur: 180; to: 1 1 1");
  }, 190);
}
