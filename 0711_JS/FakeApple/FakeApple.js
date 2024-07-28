const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      price: null,
      selectedName: "iPhone 15",
      selectedSize: "6.1吋顯示器",
      selectedCapacity: "128GB",
      selectedColor: "原色鈦金屬",
      products: [],
      images: [],
      prices: {
        "6.1吋顯示器": {
          "128GB": 36900,
          "256GB": 40400,
          "512GB": 47400,
          "1TB": 54400,
        },
        "6.7吋顯示器": {
          "256GB": 44900,
          "512GB": 51900,
          "1TB": 58900,
        },
      },
      resultImages: [
        {
          idx: 1,
          color: "原色鈦金屬",
          url: "/0711_JS/FakeApple/applePic/原色鈦金屬6-1inch/iphone-15-pro-naturaltitanium-select_AV2.jpg",
        },
        {
          idx: 2,
          color: "白色鈦金屬",
          url: "/0711_JS/FakeApple/applePic/白色鈦金屬6-1inch/iphone-15-pro-whitetitanium-select_AV2.jpg",
        },
        {
          idx: 3,
          color: "藍色鈦金屬",
          url: "/0711_JS/FakeApple/applePic/藍色鈦金屬6-1inch/iphone-15-pro-bluetitanium-select_AV2.jpg",
        },
      ],
    };
  },
  methods: {
    fetchProducts() {
      fetch("/0711_JS/FakeApple/iPhone15.json")
        .then((response) => response.json())
        .then((data) => {
          this.products = data;
          this.updateImages();
        });
    },
    updateImages() {
      const selectedProduct = this.products.find(
        (product) =>
          product.size === this.selectedSize &&
          product.capacity === this.selectedCapacity &&
          product.color === this.selectedColor
      );
      if (selectedProduct) {
        this.price = selectedProduct.price;
        this.images = selectedProduct.image;
      }
    },
    setSize(size) {
      this.selectedSize = size;
      if (size === "6.1吋顯示器") {
        this.selectedCapacity = "128GB";
      } else if (size === "6.7吋顯示器") {
        this.selectedCapacity = "256GB";
      }
      this.updateImages();
      this.updatePrice();
    },
    changeColor(color) {
      this.selectedColor = color;
      this.updateImages();
    },
    changeCapacity(capacity) {
      this.selectedCapacity = capacity;
      this.updateImages();
      this.updatePrice();
    },
    updatePrice() {
      if (
        this.prices[this.selectedSize] &&
        this.prices[this.selectedSize][this.selectedCapacity]
      ) {
        this.price = this.prices[this.selectedSize][this.selectedCapacity];
      }
    },
    initializePrice() {
      if (
        this.prices[this.selectedSize] &&
        this.prices[this.selectedSize][this.selectedCapacity]
      ) {
        this.price = this.prices[this.selectedSize][this.selectedCapacity];
      }
    },
  },
  computed: {
    filteredImage() {
      return (
        this.resultImages.find((image) => image.color === this.selectedColor)
          ?.url || ""
      );
    },
  },
  mounted() {
    this.fetchProducts();
    this.initializePrice();
  },
}).mount("#app");
