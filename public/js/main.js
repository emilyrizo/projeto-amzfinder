import {
  cloneMenuItems,
  setupEventListeners,
} from "./modules/eventListeners.js";
import { bannerController } from "./modules/bannerController.js";

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  cloneMenuItems();
  setupEventListeners();
  bannerController.init();
});
