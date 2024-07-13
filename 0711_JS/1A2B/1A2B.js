const startBtn = document.querySelector("#start_btn");
const showAnsBtn = document.querySelector("#show_answer_btn");
const restartBtn = document.querySelector("#restart_btn");
const guessBtn = document.querySelector("#guess_btn");
const guessInput = document.querySelector("#guess_input");
const guessHistoryList = document.querySelector("#guess_history_list");
const gameMsgToast = document.querySelector("#game_msg_toast");
let answer;
const toastBootstrap = new bootstrap.Toast(gameMsgToast, { delay: 2000 });
const endGameModal = document.querySelector("#end_game_modal");

const modalBootstrap = new bootstrap.Modal(endGameModal);
const endGameBtn = document.querySelector("#end_game_btn");

// window.addEventListener("load", () => {
//   initGame();
// });
// window.onload = (event) => {
//   console.log("page is fully loaded");
// };

gameMsgToast.addEventListener("hide.bs.toast", () => {
  console.log("toast hide!");
});

function initGame() {
  //產生answer
  answer = generateAns();
  //清空紀錄
  guessHistoryList.innerHTML = "";
}

function generateAns() {
  const numArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  numArr.sort((a, b) => getRandomArbitrary(-1, 1));
  return numArr.slice(0, 4).join("");
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

startBtn.addEventListener("click", initGame);
restartBtn.addEventListener("click", initGame);
showAnsBtn.addEventListener("click", () => {
  showHint(`answer:${answer}`);
});
guessBtn.addEventListener("click", () => {
  const val = guessInput.value.trim();
  console.log(val);
  //驗證輸入的合法性
  if (val === "" || isNaN(val)) {
    showHint("請輸入合法的數字");
    guessInput.value = "";
    return;
  }
  //輸入的是不重複的4個數字
  if (val.length > 4 || new Set(val).size !== 4) {
    showHint("請確認輸入數字的數量！");
    guessInput.value = "";
    return;
  }
  //處理a,b的數量
  let a = 0,
    b = 0;
  for (let i = 0; i < answer.length; i++) {
    if (val[i] === answer[i]) {
      a++;
    } else if (answer.includes(val[i])) {
      b++;
    }
  }
  if (a === 4) {
    //過關
    // alert("過關！");
    modalBootstrap.show();
  }
  guessInput.value = "";
  appendHistory(a, b, val);
});
function appendHistory(a, b, input) {
  const li = document.createElement("li");
  li.classList.add("list-group-item");
  const span = document.createElement("span");
  const badgeColor = a === 4 ? "bg-success" : "bg-danger";
  span.classList.add("badge", badgeColor);
  span.textContent = `${a}A${b}B`;
  li.append(span, input);
  guessHistoryList.append(li);
}

function showHint(msg) {
  gameMsgToast.querySelector(".toast-body").textContent = msg;
  //   const toastBootstrap = bootstrap.Toast.getOrCreateInstance(gameMsgToast);
  toastBootstrap.show();
}
endGameBtn.addEventListener("click", () => {
  modalBootstrap.hide();
});
