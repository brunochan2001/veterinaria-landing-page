const CONFIG = {
  componentsPath: "/components/",
};

class ComponentLoader {
  static async loadAll() {
    this.spinner();
    await this.loadHead();
    await Promise.all([
      this.loadComponent("header", "header-container"),
      this.loadComponent("footer", "footer-container"),
    ]);
    this.removeSpinner();
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

  static spinner() {
    const style = document.createElement("style");
    style.innerHTML = `
    #page-loader {
      position: fixed;
      inset: 0;
      background: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
    }

    #page-loader .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #e5e5e5;
      border-top: 5px solid #000;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

    document.head.appendChild(style);

    const loader = document.createElement("div");
    loader.id = "page-loader";
    loader.innerHTML = `<div class="spinner"></div>`;

    document.body.prepend(loader);
  }

  static removeSpinner() {
    const loader = document.getElementById("page-loader");
    if (loader) loader.remove();
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
