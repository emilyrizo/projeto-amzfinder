import { elements, originalTitle } from "./elements.js";

export const interfaceController = {
  showLoading(show) {
    if (show) {
      if (!originalTitle) {
        originalTitle = document.title;
      }

      let spinnerStep = 0; // Controla o estado do spinner
      const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]; // Frames do spinner

      // Função para animar o spinner no título
      function animateSpinner() {
        document.title = `${spinnerFrames[spinnerStep]} Buscando produtos...`;
        spinnerStep = (spinnerStep + 1) % spinnerFrames.length; // Avança para o próximo frame
      }
      // Inicia a animação
      elements.loadingInterval = setInterval(animateSpinner, 100); // Atualiza a cada 100ms
    } else {
      clearInterval(elements.loadingInterval);
      document.title = originalTitle;
    }
  },

  showError(message) {
    // Se o erro estiver relacionado a uma busca (como evidenciado por um 404)
    if (message === "Falha ao buscar produtos") {
      const searchTerm = elements.keywordInput.value;
      elements.errorDiv.innerHTML = `
        <div class="no-results-message">
          <p>Nenhum resultado para "${searchTerm}".</p>
          <p>Tente verificar a ortografia ou usar termos mais genéricos.</p>
        </div>
      `;
    } else {
      elements.errorDiv.textContent = message;
    }

    elements.errorDiv.style.display = "block";
    elements.resultsDiv.innerHTML = "";
    elements.featuredSection.style.display = "none";
    elements.bannerContainer.style.display = "none";
  },

  clearResults() {
    elements.loadingDiv.style.display = "none";
    elements.errorDiv.style.display = "none";
    elements.resultsDiv.innerHTML = "";
    elements.featuredSection.style.display = "block";
    elements.bannerContainer.style.display = "block";
  },

  setSearchInput(value) {
    elements.keywordInput.value = value;
  },

  toggleHamburgerMenu() {
    elements.hamburgerContent.classList.toggle("active");
  },
};
