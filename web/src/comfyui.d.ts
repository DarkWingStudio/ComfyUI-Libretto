/**
 * Ambient type declarations for ComfyUI host frontend scripts.
 */

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "../../scripts/app.js" {
  export const app: any;
  export const ComfyApp: any;
  export const sanitizeNodeName: any;
}

declare module "*/scripts/app.js" {
  export const app: any;
  export const ComfyApp: any;
  export const sanitizeNodeName: any;
}

declare const LiteGraph: any;

interface Window {
  comfyAPI?: any;
  app?: any;
}
