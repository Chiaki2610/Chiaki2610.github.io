addEventListener("DOMContentLoaded", function () {
  const saveBtn = document.querySelector(".saveBtn");
  const removeBtn = document.querySelector(".removeBtn");
  const todayBtn = document.querySelector(".backBtn");
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth() + 1;
  // 月份由0開始至11代表1至12月，故month+1
  let key;

  // 生成日曆table DOM
  function generateCalendar(year, month) {
    const date = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDay = date.getDay();
    const today = new Date();

    let calendar = '<table class="table table-bordered">';
    calendar += "<thead><tr>";
    // 塞星期幾的表頭在th
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let day of daysOfWeek) {
      calendar += `<th>${day}</th>`;
    }
    calendar += "</tr></thead><tbody><tr>";
    // 塞空格在月份起始日前
    for (let i = 0; i < startDay; i++) {
      calendar += "<td></td>";
    }
    // 將日期逐一塞入月份起迄日之間
    for (let day = 1; day <= daysInMonth; day++) {
      // 星期由0開始至6代表Sun至Sat；此判斷是要塞tr
      if ((startDay + day - 1) % 7 === 0 && day !== 1) {
        calendar += "</tr><tr>";
      }
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() + 1 === month &&
        today.getDate() === day;

      calendar += `<td class="${
        isToday ? "today" : ""
      }" data-date="${year}-${month}-${day}">${day}
      <ul class="list-group"></ul></td>`;
    }

    calendar += "</tr></tbody></table>";
    return calendar;
  }

  //將日曆table塞到html並更新當前年份-月份
  function updateCalendar() {
    document.getElementById("calendar").innerHTML = generateCalendar(
      currentYear,
      currentMonth
    );
    document.getElementById(
      "currentMonthYear"
    ).textContent = `${currentYear} - ${currentMonth}`;
    displayTodoListAtOrderDate();
  }

  //獲取localStorage資料
  function getTodoListFromStorage(key) {
    const localStorageItem = localStorage.getItem(key);
    return localStorageItem ? JSON.parse(localStorageItem) : [];
  }

  //取得現在所有的todoItem,再加上去
  function saveTodoItem(date, todoItem) {
    const todoList = getTodoListFromStorage();
    todoList.push(todoItem);
    saveTodoListToStorage(todoList);
  }

  //setItem
  function saveTodoListToStorage(todoList) {
    const json = JSON.stringify(todoList);
    localStorage.setItem(key, json);
  }

  function displayTodoListAtOrderDate() {
    const dateCells = document.querySelectorAll("td[data-date]");
    const selectedDate = document.getElementById("eventDate").value;
    dateCells.forEach(function (cell) {
      const cellDate = cell.getAttribute("data-date");
      const todoList = getTodoListFromStorage(cellDate);
      const eventClass = todoList.length ? "event" : "";
      if (cellDate === selectedDate) {
        if (eventClass) {
          cell.classList.add(eventClass);
          const ul = cell.querySelector("ul");
          ul.innerHTML = "";
          todoList.forEach(function (todoItem) {
            const titleLi = document.createElement("li");
            titleLi.classList.add("event-title");
            titleLi.textContent = todoItem.title;
            ul.appendChild(titleLi);
          });
        }
      }
    });
    //   if (cellDate === selectedDate) {
    //     if (eventClass) {
    //       cell.classList.add(eventClass);
    //     }
    //     if (eventTitle) {
    //       const titleLi = document.createElement("li");
    //       titleLi.classList.add("event-title");
    //       titleLi.textContent = eventTitle;
    //       cell.appendChild(titleLi);
    //     }
    //   }
    // const selectedDate = document.getElementById("eventDate").value;
    // const storedEvent = localStorage.getItem(selectedDate);
    // const eventClass = storedEvent ? "event" : "";
    // const eventTitle = storedEvent ? JSON.parse(storedEvent).title : "";
  }

  //將data-data的value格式轉為符合modal格式
  function formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  todayBtn.addEventListener("click", function (event) {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth() + 1;
    updateCalendar();

    const todayCell = document.querySelector(".today");
    if (todayCell) {
      // element.scrollIntoView()
      todayCell.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  saveBtn.addEventListener("click", function (event) {
    const eventTitle = document.querySelector("#eventTitle").value.trim();
    const eventContent = document.querySelector("#eventContent").value.trim();
    const eventDate = document.querySelector("#eventDate").value;
    if (!eventTitle) return;
    // 儲存待辦事項
    const todoItem = {
      //會以毫秒表示一串數字
      id: new Date().valueOf(),
      title: eventTitle,
      content: eventContent,
    };
    saveTodoItem(eventDate, todoItem);
    displayTodoListAtOrderDate();
  });

  removeBtn.addEventListener("click", function (event) {
    const target = event.target.closest("td");
    if (target) {
      key = target.getAttribute("data-date");
      const todoList = getTodoListFromStorage(key);
      const todoItemTarget = todoList.some((item) => item.id === 1721415224871);
      todoList.splice(todoItemTarget, 1);
      saveTodoListToStorage(todoList);
    }
  });

  //將待辦事項顯示在modal中
  document
    .getElementById("calendar")
    .addEventListener("click", function (event) {
      //使用Element.closest("el")用來獲取當前距離最近的td tag
      const target = event.target.closest("td");
      if (target) {
        key = target.getAttribute("data-date");
        if (key) {
          const event = getTodoListFromStorage(key)[0];
          const formattedDate = formatDate(key);
          document.getElementById("eventDate").value = formattedDate;
          document.getElementById("eventTitle").value = event
            ? event.title
            : "";
          document.getElementById("eventContent").value = event
            ? event.content
            : "";
          $("#staticBackdrop").modal("show");
        }
      }
    });

  //捲動滾輪時呼叫事件並更新日曆
  window.addEventListener("wheel", function (event) {
    //WheelEvent：deltaY，捲動垂直屬性
    if (event.deltaY < 0) {
      currentMonth--;
      if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
      }
    } else {
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }
    updateCalendar();
  });
  updateCalendar();
});
