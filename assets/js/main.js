const CONFIG = {
  componentsPath: "/components/",
};

class ComponentLoader {
  static async loadAll() {
    await this.loadHead();
    await Promise.all([
      this.loadComponent("header", "header-container"),
      this.loadComponent("footer", "footer-container"),
    ]);
  }

  static async loadComponent(name, targetId) {
    const response = await fetch(`${CONFIG.componentsPath}${name}.html`);
    if (!response.ok) return;

    const html = await response.text();
    const target = document.getElementById(targetId);
    if (target) target.outerHTML = html;
  }

  static async loadHead() {
    const response = await fetch(`${CONFIG.componentsPath}head.html`);
    if (!response.ok) return;

    const content = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    [...doc.head.children].forEach((el) => {
      document.head.appendChild(el.cloneNode(true));
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await ComponentLoader.loadAll();
  setActiveLink();
});

function setActiveLink() {
  const currentPath = window.location.pathname;

  document.querySelectorAll(".nav-link").forEach((link) => {
    const linkPath = new URL(link.href).pathname;

    // Limpiar clase activa primero
    link.classList.remove("active");

    if (currentPath === linkPath) {
      link.classList.add("active");
    }

    // Caso especial para home (index)
    if (
      (currentPath === "/" || currentPath.endsWith("index.html")) &&
      (linkPath === "/" || linkPath.endsWith("index.html"))
    ) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("load", async () => {
  await ComponentLoader.loadAll();
  setActiveLink();

  const loader = document.getElementById("page-loader");
  if (loader) loader.remove();
});
