document.addEventListener("DOMContentLoaded", function () {
  const saveBtn = document.querySelector(".saveBtn");
  const removeBtn = document.querySelector(".removeBtn");
  const cancelBtn = document.querySelector(".cancelBtn");
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth() + 1;

  function generateCalendar(year, month) {
    const date = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDay = date.getDay();
    const today = new Date();

    let calendar = '<table class="table table-bordered">';
    calendar += "<thead><tr>";

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let day of daysOfWeek) {
      calendar += `<th>${day}</th>`;
    }
    calendar += "</tr></thead><tbody><tr>";

    for (let i = 0; i < startDay; i++) {
      calendar += "<td></td>";
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if ((startDay + day - 1) % 7 === 0 && day !== 1) {
        calendar += "</tr><tr>";
      }
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() + 1 === month &&
        today.getDate() === day;
      const storedEvent = localStorage.getItem(`${year}-${month}-${day}`);
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

  function saveEvent(date, title, content) {
    localStorage.setItem(date, JSON.stringify({ title, content }));
  }

  function deleteEvent(date) {
    localStorage.removeItem(date);
  }

  document
    .getElementById("calendar")
    .addEventListener("click", function (event) {
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

  saveBtn.addEventListener("click", function () {
    const date = document.getElementById("eventDate").value;
    const title = document.getElementById("eventTitle").value;
    const content = document.getElementById("eventContent").value;
    saveEvent(date, title, content);
    $("#staticBackdrop").modal("hide");
    updateCalendar();
  });

  removeBtn.addEventListener("click", function () {
    const date = document.getElementById("eventDate").value;
    deleteEvent(date);
    $("#staticBackdrop").modal("hide");
    updateCalendar();
  });

  window.addEventListener("wheel", function (event) {
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
