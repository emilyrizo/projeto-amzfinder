const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { JSDOM } = require("jsdom");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Headers mais realistas
const getHeaders = () => ({
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Cache-Control": "max-age=0",
  TE: "Trailers",
});

// Função para fazer o scraping
async function scrapeAmazon(keyword) {
  try {
    const response = await axios.get(
      `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`,
      {
        headers: getHeaders(),
        timeout: 5000,
      }
    );

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const products = [];
    const productElements = document.querySelectorAll(
      '[data-component-type="s-search-result"]'
    );

    productElements.forEach((element) => {
      try {
        const title = element.querySelector("h2 span")?.textContent.trim();
        const ratingElement = element.querySelector(".a-icon-star-small");
        let rating = null;

        if (ratingElement) {
          const ratingText = ratingElement.textContent.trim();
          // Remove qualquer caractere não numérico exceto ponto e vírgula
          const cleanRating = ratingText.replace(/[^\d.,]/g, "");
          // Substitui vírgula por ponto e converte para número
          rating = parseFloat(cleanRating.replace(",", "."));
        }

        const reviews = element
          .querySelector(".a-size-base.s-underline-text")
          ?.textContent.trim();
        const imageUrl = element.querySelector("img.s-image")?.src;

        const linkElement = element.querySelector(
          "a.a-link-normal.s-no-outline"
        ); // Captura o link do título
        let url = linkElement ? linkElement.href : null;

        if (url && !url.startsWith("http")) {
          url = `https://www.amazon.com.br${url}`;
        }

        if (title) {
          products.push({
            title,
            rating,
            reviews,
            imageUrl,
            url,
          });
        }
      } catch (error) {
        console.error("Erro ao processar produto:", error);
      }
    });

    return products;
  } catch (error) {
    console.error("Erro ao fazer scraping:", error);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    }
    throw new Error(
      "Falha ao buscar produtos da Amazon. Por favor, tente novamente mais tarde."
    );
  }
}

// Rota para fazer o scraping
app.get("/api/scrape", async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        error: "Palavra-chave não fornecida",
        message: "Por favor, digite uma palavra-chave",
      });
    }

    const products = await scrapeAmazon(keyword);

    if (products.length === 0) {
      return res.status(404).json({
        error: "Nenhum produto encontrado",
        message: "Não foram encontrados produtos para esta busca",
      });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({
      error: "Erro interno",
      message: error.message,
    });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Use o navegador para acessar a interface de busca");
});
