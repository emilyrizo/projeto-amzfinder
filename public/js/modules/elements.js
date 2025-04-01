// Elementos do DOM
export const elements = {
  searchButton: document.getElementById("search-button"),
  keywordInput: document.getElementById("search-input"),
  loadingDiv: document.getElementById("loading"),
  errorDiv: document.getElementById("error"),
  resultsDiv: document.getElementById("results"),
  categoryItems: document.querySelectorAll(".category-item"),
  hamburgerButton: document.querySelector(".hamburger-button"),
  hamburgerContent: document.querySelector(".hamburger-content"),
  featuredSection: document.querySelector(".featured-section"),
  bannerContainer: document.querySelector(".banner-container"),
  bannerContent: document.querySelector(".banner-content"),
  bannerSlides: document.querySelectorAll(".banner-slide"),
  bannerPrev: document.querySelector(".banner-nav.prev"),
  bannerNext: document.querySelector(".banner-nav.next"),
  hamburgerList: document.querySelector(".hamburger-content .categories-list"),
  mainList: document.querySelector(".categories-content .categories-list"),
};

export let originalTitle = document.title;