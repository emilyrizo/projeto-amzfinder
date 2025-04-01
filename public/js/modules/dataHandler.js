import { elements } from "./elements.js";
import { interfaceController } from "./interfaceController.js";

export const dataHandler = {
  async fetchProducts(keyword) {
    try {
      console.log(`Buscando produtos para: "${keyword}"`);
      const response = await fetch(
        `/api/scrape?keyword=${encodeURIComponent(keyword)}`
      );

      // Se receber um 404, considere como "nenhum resultado" em vez de erro
      if (response.status === 404) {
        console.log("API retornou 404: Nenhum produto encontrado");
        return []; // Retorna array vazio indicando nenhum resultado
      }

      if (!response.ok) {
        console.error(`Erro na API: ${response.status} ${response.statusText}`);
        throw new Error("Falha ao buscar produtos");
      }

      const data = await response.json();
      console.log("Resposta da API:", data);

      // Verificar se a resposta é um array
      if (!Array.isArray(data)) {
        console.error("Resposta não é um array:", data);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error; // Relanço o erro para ser tratado pelo chamador
    }
  },

  createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";

    // Gerar as estrelas com base no rating
    let starsHtml = "";
    if (
      product.rating !== null &&
      typeof product.rating === "number" &&
      !isNaN(product.rating)
    ) {
      const roundedRating = Math.round(product.rating * 2) / 2; // Arredonda para o meio ponto mais próximo
      const fullStars = Math.floor(roundedRating); // Estrelas cheias
      const hasHalfStar = roundedRating - fullStars === 0.5; // Verifica se tem exatamente meia estrela
      let emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Estrelas vazias restantes

      // Garante que emptyStars não seja negativo
      emptyStars = Math.max(emptyStars, 0);

      // Gera as estrelas cheias
      starsHtml += '<i class="fa-solid fa-star"></i>'.repeat(fullStars);

      // Adiciona meia estrela, se necessário
      if (hasHalfStar) {
        starsHtml += '<i class="fa-regular fa-star-half-stroke"></i>';
      }

      // Adiciona estrelas vazias
      starsHtml += '<i class="fa-regular fa-star"></i>'.repeat(emptyStars);
    } else {
      // Se não houver avaliação, mostra 5 estrelas vazias
      starsHtml = '<i class="fa-regular fa-star"></i>'.repeat(5);
    }

    // Texto das avaliações
    const reviewsText = product.reviews ? `(${product.reviews})` : "";

    // Monta o HTML do card
    card.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.title}">
      <h3>${product.title}</h3>
      <div class="rating-container">
        ${starsHtml}
        <div class="reviews">${reviewsText}</div>
      </div>
      <input type="hidden" class="product-url" value="${product.url}">
    `;

    return card;
  },

  displayProducts(products, searchTerm) {
    console.log("Exibindo produtos:", products);
    console.log("Termo de busca:", searchTerm || elements.keywordInput.value);

    // Esconde elementos desnecessários
    elements.loadingDiv.style.display = "none";
    elements.errorDiv.style.display = "none";
    elements.featuredSection.style.display = "none";
    elements.bannerContainer.style.display = "none";

    // Limpa os resultados anteriores
    elements.resultsDiv.innerHTML = "";

    // Verifica se products existe e tem comprimento
    if (!products || !Array.isArray(products) || products.length === 0) {
      console.log("Nenhum produto encontrado, exibindo mensagem");

      // Cria uma mensagem de "nenhum resultado"
      const noResultsMessage = document.createElement("div");
      noResultsMessage.className = "no-results-message";
      noResultsMessage.innerHTML = `
        <p>Nenhum resultado para "${
          searchTerm || elements.keywordInput.value
        }".</p>
        <p>Tente verificar a ortografia ou usar termos mais genéricos.</p>
      `;
      elements.resultsDiv.appendChild(noResultsMessage);
      return; // Sai da função, pois não há produtos para exibir
    }

    console.log(`Renderizando ${products.length} produtos`);

    // Caso haja produtos, cria e adiciona os cards normalmente
    products.forEach((product) => {
      const card = this.createProductCard(product);
      elements.resultsDiv.appendChild(card);
    });

    // Adiciona eventos de clique para redirecionamento
    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const productUrl = card.querySelector(".product-url")?.value;
        if (productUrl) {
          window.open(productUrl, "_blank");
        } else {
          alert("URL do produto não disponível");
        }
      });
    });
  },
};

// Função principal de busca
export async function searchProducts() {
  const keyword = elements.keywordInput.value.trim();
  if (!keyword) {
    return; // Não exibe mensagem de erro
  }

  try {
    interfaceController.showLoading(true); // Mostra o spinner
    console.log(`Iniciando busca para: "${keyword}"`);
    const products = await dataHandler.fetchProducts(keyword);
    console.log(
      `Busca concluída, produtos encontrados: ${products ? products.length : 0}`
    );
    dataHandler.displayProducts(products, keyword);
  } catch (error) {
    console.error("Erro durante a busca:", error.message);
    // Verifica se é um erro de API (não 404) antes de mostrar a mensagem de erro genérica
    interfaceController.showError(error.message);
  } finally {
    interfaceController.showLoading(false); // Remove o spinner
  }
}

// Função para buscar por categoria
export async function searchByCategory(searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    return; // Evita busca com termos vazios
  }

  console.log(`Iniciando busca por categoria: "${searchTerm}"`);

  try {
    interfaceController.showLoading(true);
    const products = await dataHandler.fetchProducts(searchTerm);
    console.log(
      `Busca por categoria concluída, produtos encontrados: ${
        products ? products.length : 0
      }`
    );
    dataHandler.displayProducts(products, searchTerm);
  } catch (error) {
    console.error("Erro durante a busca por categoria:", error.message);
    interfaceController.showError(error.message);
  } finally {
    interfaceController.showLoading(false);
  }
}
