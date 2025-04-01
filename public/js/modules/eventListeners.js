import { elements } from "./elements.js";
import { interfaceController } from "./interfaceController.js";
import { searchProducts, searchByCategory } from "./dataHandler.js";

// Função para adicionar event listeners aos itens de categoria
export function addCategoryEventListeners(items) {
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const searchTerm = item.getAttribute("data-search");
      searchByCategory(searchTerm);
      // Fecha o menu hamburguer após selecionar uma categoria
      elements.hamburgerContent.classList.remove("active");
    });
  });
}

// Função para clonar os itens do menu
export function cloneMenuItems() {
  // Limpa a lista principal
  elements.mainList.innerHTML = "";

  // Clona os itens do menu hamburguer para a lista principal
  const items = elements.hamburgerList.querySelectorAll(".category-item");
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    elements.mainList.appendChild(clone);
  });

  // Adiciona event listeners aos itens clonados
  const clonedItems = elements.mainList.querySelectorAll(".category-item");
  addCategoryEventListeners(clonedItems);
}

// Configuração de todos os event listeners
export function setupEventListeners() {
  elements.searchButton.addEventListener("click", searchProducts);
  elements.keywordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchProducts();
    }
  });

  // Adicionar event listeners para as categorias do menu hamburguer
  const hamburgerItems =
    elements.hamburgerList.querySelectorAll(".category-item");
  addCategoryEventListeners(hamburgerItems);

  // Event listener para o botão do menu hamburguer
  elements.hamburgerButton.addEventListener(
    "click",
    interfaceController.toggleHamburgerMenu
  );

  // Event listener para o banner
  const bannerContent = document.querySelector(".banner-content");
  if (bannerContent) {
    bannerContent.addEventListener("click", () => {
      const searchTerm = bannerContent.getAttribute("data-search");
      searchByCategory(searchTerm);
    });
  }

  // Fecha o menu ao clicar fora dele
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".hamburger-menu")) {
      elements.hamburgerContent.classList.remove("active");
    }
  });

  // Event listeners para os botões de destaques
  document.querySelectorAll(".featured-button").forEach((button) => {
    button.addEventListener("click", () => {
      const searchTerm = button.getAttribute("data-search");
      searchByCategory(searchTerm);
    });
  });
}
