import { createApp } from "vue";
import App from "./App.vue";
import { app } from "../../scripts/app.js";

// Ensure styles are automatically injected into the document head
try {
  const cssUrl = new URL("./assets/style.css", import.meta.url).href;
  if (!document.querySelector(`link[href="${cssUrl}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssUrl;
    document.head.appendChild(link);
  }
} catch (e) {
  console.warn("ComfyUI-Libretto: Could not auto-inject style.css", e);
}

let vueAppInstance: any = null;

function mountLibrettoApp(container: HTMLElement) {
  if (vueAppInstance) {
    vueAppInstance.unmount();
    vueAppInstance = null;
  }
  container.innerHTML = "";
  const root = document.createElement("div");
  root.style.width = "100%";
  root.style.height = "100%";
  container.appendChild(root);

  vueAppInstance = createApp(App);
  vueAppInstance.mount(root);
}

function unmountLibrettoApp() {
  if (vueAppInstance) {
    vueAppInstance.unmount();
    vueAppInstance = null;
  }
}

function setupFallbackSidebar() {
  // Floating sidebar drawer for older ComfyUI web interfaces
  const drawerId = "libretto-fallback-drawer";
  if (document.getElementById(drawerId)) return;

  const drawer = document.createElement("div");
  drawer.id = drawerId;
  Object.assign(drawer.style, {
    position: "fixed",
    top: "40px",
    right: "0",
    width: "360px",
    height: "calc(100vh - 40px)",
    zIndex: "9999",
    background: "#1a1a1e",
    boxShadow: "-4px 0 16px rgba(0,0,0,0.5)",
    display: "none",
    flexDirection: "column",
    transition: "transform 0.2s ease-in-out",
  });

  const toggleBtn = document.createElement("button");
  toggleBtn.innerText = "Libretto";
  Object.assign(toggleBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "10000",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
  });

  let isOpen = false;
  toggleBtn.onclick = () => {
    isOpen = !isOpen;
    drawer.style.display = isOpen ? "flex" : "none";
    if (isOpen && !vueAppInstance) {
      mountLibrettoApp(drawer);
    }
  };

  document.body.appendChild(drawer);
  document.body.appendChild(toggleBtn);
}

app.registerExtension({
  name: "ComfyUI.Libretto",
  async setup() {
    // Check if ComfyUI modern sidebar tab registration is supported
    if (app.extensionManager && typeof app.extensionManager.registerSidebarTab === "function") {
      app.extensionManager.registerSidebarTab({
        id: "comfyui-libretto",
        icon: "pi pi-bookmark",
        title: "Libretto",
        tooltip: "ComfyUI-Libretto Compositions",
        type: "custom",
        render: (container: HTMLElement) => {
          mountLibrettoApp(container);
        },
        destroy: () => {
          unmountLibrettoApp();
        },
      });
    } else {
      setupFallbackSidebar();
    }
  },
});
