// get data
const appleData = "/0711_JS/FakeApple/FakeApple.json";
let data;
function fetchJSONData(url) {
  return fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
}

const resultArr = [];
document
  .querySelector(".select-size")
  .addEventListener("click", async (event) => {
    const target = event.target.closest("button");
    if (target) {
      data = await fetchJSONData(appleData);
      const proBtn = document.querySelector(".proBtn");
      const proMaxBtn = document.querySelector(".proMaxBtn");
      if (target === proBtn) {
        for (let i = 0; i < 12; i++) {
          resultArr.push(data[i]);
        }
      } else if (target === proMaxBtn) {
        for (let i = 12; i < 21; i++) {
          resultArr.push(data[i]);
        }
      }
      console.log(resultArr);
    }
  });

document.querySelector(".select-color").addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (target) {
    const normalBtn = document.querySelector(".normal-btn");
    const blueBtn = document.querySelector(".blue-btn");
    const whiteBtn = document.querySelector(".white-btn");
    const blackBtn = document.querySelector(".black-btn");
    if (target === normalBtn) {
      console.log("normal");
    } else if (target === blueBtn) {
      console.log("blue");
    } else if (target === whiteBtn) {
      console.log("white");
    } else if (target === blackBtn) {
      console.log("black");
    }
    console.log(resultArr);
  }
});

document
  .querySelector(".select-capacity")
  .addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (target) {
      const s128Btn = document.querySelector(".storageOf128");
      const s256Btn = document.querySelector(".storageOf256");
      const s512Btn = document.querySelector(".storageOf512");
      const s1TBtn = document.querySelector(".storageOf1TB");
      if (target === s128Btn) {
        console.log("s128Btn");
      } else if (target === s256Btn) {
        console.log("s256Btn");
      } else if (target === s512Btn) {
        console.log("s512Btn");
      } else if (target === s1TBtn) {
        console.log("s1TBtn");
      }
      console.log(resultArr);
    }
  });
