addEventListener("DOMContentLoaded", function () {
  const key = "todoList";
  const saveBtn = document.querySelector(".saveBtn");
  const removeBtn = document.querySelector(".removeBtn");
  const cancelBtn = document.querySelector(".cancelBtn");
  let currentYear = new Date().getFullYear();
  // 月份由0開始至11代表1至12月，故month+1
  let currentMonth = new Date().getMonth() + 1;
  // ↓↓↓沒有問題
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
      const storedEvent = localStorage.getItem(`${year}-${month}-${day}`);
      //eventClass和eventTitle邏輯有問題，無法成功新增事件在表格中
      const eventClass = storedEvent ? "event" : "";
      const eventTitle = storedEvent ? JSON.parse(storedEvent).title : "";
      calendar += `<td class="${
        isToday ? "today" : ""
      } ${eventClass}" data-date="${year}-${month}-${day}">${day} <span class="event-title">${eventTitle}</span></td>`;
    }

    calendar += "</tr></tbody></table>";
    return calendar;
  }

  function updateCalendar() {
    document.getElementById("calendar").innerHTML = generateCalendar(
      currentYear,
      currentMonth
    );
    document.getElementById(
      "currentMonthYear"
    ).textContent = `${currentYear} - ${currentMonth}`;
  }
  // ↓↓↓沒有問題
  function saveEvent(key, date, title, content) {
    localStorage.setItem(key, JSON.stringify({ date, title, content }));
  }

  function deleteEvent(date) {
    const todoList = getTodoListFromStorage();
    const todoItemIdx = todoList.findIndex((item) => item.date === date);
    todoList.splice(todoItemIdx, 1);
  }

  function getTodoListFromStorage() {
    const localStorageItem = localStorage.getItem(key);
    return localStorageItem ? JSON.parse(localStorageItem) : [];
  }
  function saveTodoListToStorage(todoList) {
    const json = JSON.stringify(todoList);
    localStorage.setItem(key, json);
    console.log(`Saved: ${key} → ${json}`);
  }

  //查看和編輯#calendar內的指定日期與行程(目前無法正常顯示，要調整)
  document
    .getElementById("calendar")
    .addEventListener("click", function (event) {
      //使用Element.closest("el")用來獲取當前距離最近的td tag
      const target = event.target.closest("td");
      if (target) {
        const date = target.getAttribute("data-date");
        if (date) {
          const event = JSON.parse(localStorage.getItem(date));
          document.getElementById("eventDate").value = date;
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
  // ↓↓↓沒有問題
  saveBtn.addEventListener("click", function () {
    const date = document.getElementById("eventDate").value;
    const title = document.getElementById("eventTitle").value;
    const content = document.getElementById("eventContent").value;
    saveEvent(key, date, title, content);
    $("#staticBackdrop").modal("hide");
    updateCalendar();
  });

  removeBtn.addEventListener("click", function (event) {
    const target = event.target.closest("td");
    if (target) {
      const date = target.getAttribute("data-date");
      deleteEvent(date);
      $("#staticBackdrop").modal("hide");
      updateCalendar();
    }
  });

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
