


const appleDataFormat = {
  name: "",
  color: "",
  size: "",
  capacity: "",
  price,
  image: [],
};
const appleDataJson = JSON.stringify(appleDataFormat);
console.log(appleDataJson);

const proBtn = document.querySelector(".proBtn");
const proMaxBtn = document.querySelector(".proMaxBtn");
const normalBtn = document.querySelector(".normal-btn");
const blueBtn = document.querySelector(".blue-btn");
const whiteBtn = document.querySelector(".white-btn");
const blackBtn = document.querySelector(".black-btn");
const s128Btn = document.querySelector(".storageOf128");
const s256Btn = document.querySelector(".storageOf256");
const s512Btn = document.querySelector(".storageOf512");
const s1TBtn = document.querySelector(".storageOf1TB");
