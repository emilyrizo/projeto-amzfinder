import { elements } from "./elements.js";
import { searchByCategory } from "./dataHandler.js";

export const bannerController = {
  currentSlide: 0,
  interval: null,
  slideInterval: 5000,
  totalSlides: 0,
  isTransitioning: false,

  // Criar clones para carrossel infinito
  init() {
    this.totalSlides = elements.bannerSlides.length;

    if (this.totalSlides < 2) return; // Se houver apenas um slide, não há necessidade de configuração

    // Clona o primeiro e o último slide
    const firstSlideClone = elements.bannerSlides[0].cloneNode(true);
    const lastSlideClone =
      elements.bannerSlides[this.totalSlides - 1].cloneNode(true);

    // Adiciona os clones ao início e fim
    elements.bannerContent.appendChild(firstSlideClone);
    elements.bannerContent.insertBefore(
      lastSlideClone,
      elements.bannerSlides[0]
    );

    // Reconfigura a contagem de slides (agora temos 2 a mais)
    this.totalSlides =
      elements.bannerContent.querySelectorAll(".banner-slide").length;

    // Configura as larguras de slide
    this.setupSlideWidths();

    // Define a posição inicial no primeiro slide real (índice 1, já que o 0 é o clone do último)
    this.currentSlide = 1;
    this.updateSlideWithoutTransition();

    // Configura os eventos de clique e navegação
    this.setupClickEvents();
    this.setupNavigation();
    this.setupTransitionEnd();
    this.startSlideshow();
  },

  setupSlideWidths() {
    // Define a largura do container de slides baseado no número de slides (incluindo clones)
    elements.bannerContent.style.width = `${this.totalSlides * 100}%`;

    // Define a largura de cada slide individual
    const slides = elements.bannerContent.querySelectorAll(".banner-slide");
    slides.forEach((slide) => {
      slide.style.width = `${100 / this.totalSlides}%`;
    });
  },

  startSlideshow() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, this.slideInterval);
  },

  stopSlideshow() {
    clearInterval(this.interval);
  },

  restartSlideshow() {
    this.stopSlideshow();
    this.startSlideshow();
  },

  setupClickEvents() {
    const slides = elements.bannerContent.querySelectorAll(".banner-slide");
    slides.forEach((slide) => {
      slide.addEventListener("click", () => {
        const searchTerm = slide.getAttribute("data-search");
        searchByCategory(searchTerm);
      });
    });
  },

  setupNavigation() {
    elements.bannerPrev.addEventListener("click", (e) => {
      e.stopPropagation(); // Evitar propagação do evento
      if (!this.isTransitioning) {
        this.prevSlide();
        this.restartSlideshow();
      }
    });

    elements.bannerNext.addEventListener("click", (e) => {
      e.stopPropagation(); // Evitar propagação do evento
      if (!this.isTransitioning) {
        this.nextSlide();
        this.restartSlideshow();
      }
    });
  },

  setupTransitionEnd() {
    elements.bannerContent.addEventListener("transitionend", () => {
      this.isTransitioning = false;

      // Se estiver no clone do último slide (posição 0), salte para o slide real (totalSlides-2)
      if (this.currentSlide === 0) {
        this.currentSlide = this.totalSlides - 2;
        this.updateSlideWithoutTransition();
      }

      // Se estiver no clone do primeiro slide (última posição), salte para o slide real (1)
      if (this.currentSlide === this.totalSlides - 1) {
        this.currentSlide = 1;
        this.updateSlideWithoutTransition();
      }
    });
  },

  prevSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentSlide--;
    this.updateSlide();
  },

  nextSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentSlide++;
    this.updateSlide();
  },

  updateSlide() {
    const offset = this.currentSlide * -(100 / this.totalSlides);
    elements.bannerContent.style.transition = "transform 0.5s ease-in-out";
    elements.bannerContent.style.transform = `translateX(${offset}%)`;
  },

  updateSlideWithoutTransition() {
    const offset = this.currentSlide * -(100 / this.totalSlides);
    elements.bannerContent.style.transition = "none";
    elements.bannerContent.style.transform = `translateX(${offset}%)`;

    // Força o reflow para aplicar a mudança sem transição
    elements.bannerContent.offsetHeight;

    // Restaura a transição para os próximos slides
    setTimeout(() => {
      elements.bannerContent.style.transition = "transform 0.5s ease-in-out";
    }, 50);
  },
};
