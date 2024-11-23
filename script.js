// Пример данных мероприятий
const events = [
    {
        id: 1,
        sport: "Баскетбол",
        discipline: "3х3",
        program: "Финальный тур",
        location: "Москва",
        participants: 12,
        gender: "Мужчины",
        ageGroup: "18-25",
        startDate: "2024-11-25",
        endDate: "2024-11-26",
        type: "Чемпионат"
    },
    {
        id: 2,
        sport: "Плавание",
        discipline: "Баттерфляй",
        program: "100 м",
        location: "Казань",
        participants: 30,
        gender: "Женщины",
        ageGroup: "18-30",
        startDate: "2024-12-10",
        endDate: "2024-12-12",
        type: "Кубок"
    },
    {
        id: 3,
        sport: "Футбол",
        discipline: "Мини-футбол",
        program: "Групповой этап",
        location: "Сочи",
        participants: 20,
        gender: "Универсально",
        ageGroup: "16-40",
        startDate: "2025-01-05",
        endDate: "2025-01-10",
        type: "Межрегиональные"
    }
];

const dateRangeFilter = document.getElementById("dateRangeFilter");
const customDateFields = document.getElementById("customDateFields");
const applyDateFormatBtn = document.getElementById("applyDateFormat");
const filterForm = document.getElementById("filterForm");

// Показать/скрыть пользовательские поля даты
dateRangeFilter.addEventListener("change", () => {
    if (dateRangeFilter.value === "custom") {
        customDateFields.style.display = "block";
    } else {
        customDateFields.style.display = "none";
    }
});

// Применить фильтры
filterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const sport = document.getElementById("sportFilter").value;
    const discipline = document.getElementById("disciplineFilter").value.toLowerCase();
    const program = document.getElementById("programFilter").value.toLowerCase();
    const location = document.getElementById("locationFilter").value.toLowerCase();
    const participants = document.getElementById("participantsFilter").value;
    const gender = document.getElementById("genderFilter").value;
    const ageGroup = document.getElementById("ageGroupFilter").value.toLowerCase();
    const type = document.getElementById("competitionTypeFilter").value;

    const filteredEvents = events.filter(event => {
        return (
            (!sport || event.sport === sport) &&
            (!discipline || event.discipline.toLowerCase().includes(discipline)) &&
            (!program || event.program.toLowerCase().includes(program)) &&
            (!location || event.location.toLowerCase().includes(location)) &&
            (!participants || event.participants >= parseInt(participants)) &&
            (!gender || event.gender === gender) &&
            (!ageGroup || event.ageGroup.toLowerCase().includes(ageGroup)) &&
            (!type || event.type === type)
        );
    });

    displayEvents(filteredEvents);
});

// Применить формат отображения
applyDateFormatBtn.addEventListener("click", () => {
    const today = new Date();
    let startDate = null;
    let endDate = null;

    switch (dateRangeFilter.value) {
        case "week":
            startDate = today;
            endDate = new Date(today);
            endDate.setDate(today.getDate() + 7);
            break;
        case "month":
            startDate = today;
            endDate = new Date(today);
            endDate.setMonth(today.getMonth() + 1);
            break;
        case "quarter":
            startDate = today;
            endDate = new Date(today);
            endDate.setMonth(today.getMonth() + 3);
            break;
        case "halfyear":
            startDate = today;
            endDate = new Date(today);
            endDate.setMonth(today.getMonth() + 6);
            break;
        case "custom":
            startDate = new Date(document.getElementById("startDateFilter").value);
            endDate = new Date(document.getElementById("endDateFilter").value);
            break;
    }

    const filteredEvents = events.filter(event => {
        return (
            (!startDate || new Date(event.startDate) >= startDate) &&
            (!endDate || new Date(event.endDate) <= endDate)
        );
    });

    displayEvents(filteredEvents);
});

// Функция для отображения мероприятий в таблице
function displayEvents(filteredEvents) {
    const eventsList = document.getElementById("eventsList");
    eventsList.innerHTML = ""; // Очистка таблицы

    if (filteredEvents.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 9;
        cell.textContent = "Нет подходящих мероприятий.";
        cell.style.textAlign = "center";
        row.appendChild(cell);
        eventsList.appendChild(row);
        return;
    }

    filteredEvents.forEach(event => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${event.sport}</td>
            <td>${event.discipline}</td>
            <td>${event.program}</td>
            <td>${event.location}</td>
            <td>${event.participants}</td>
            <td>${event.gender}</td>
            <td>${event.ageGroup}</td>
            <td>${event.startDate} - ${event.endDate}</td>
            <td>${event.type}</td>
        `;
        eventsList.appendChild(row);
    });
}

// Инициализация: отображаем все события при загрузке
displayEvents(events);

// Функция для отображения мероприятий в таблице (с кнопкой напоминания)
function displayEvents(filteredEvents) {
    const eventsList = document.getElementById("eventsList");
    eventsList.innerHTML = ""; // Очистка таблицы

    if (filteredEvents.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 10; // 10 колонок в таблице
        cell.textContent = "Нет подходящих мероприятий.";
        cell.style.textAlign = "center";
        row.appendChild(cell);
        eventsList.appendChild(row);
        return;
    }

    filteredEvents.forEach(event => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${event.sport}</td>
            <td>${event.discipline}</td>
            <td>${event.program}</td>
            <td>${event.location}</td>
            <td>${event.participants}</td>
            <td>${event.gender}</td>
            <td>${event.ageGroup}</td>
            <td>${event.startDate} - ${event.endDate}</td>
            <td>${event.type}</td>
            <td><button class="reminder-btn" data-id="${event.id}">Установить напоминание</button></td>
        `;
        eventsList.appendChild(row);
    });

    // Добавляем обработчики для кнопок напоминаний
    const reminderButtons = document.querySelectorAll(".reminder-btn");
    reminderButtons.forEach(button => {
        button.addEventListener("click", () => {
            const eventId = button.getAttribute("data-id");
            setReminder(eventId);
        });
    });
}

// Установка напоминания
function setReminder(eventId) {
    const event = events.find(e => e.id == eventId);
    if (!event) return;

    const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    if (!reminders.some(reminder => reminder.id === eventId)) {
        reminders.push({ id: eventId, date: event.startDate });
        localStorage.setItem("reminders", JSON.stringify(reminders));
        alert(`Напоминание для "${event.sport} (${event.discipline})" установлено!`);
    } else {
        alert("Напоминание уже установлено для этого мероприятия.");
    }
}

// Проверка напоминаний
function checkReminders() {
    const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    const today = new Date();
    today.setDate(today.getDate() + 1); // Дата завтра

    reminders.forEach(reminder => {
        const reminderDate = new Date(reminder.date);
        if (reminderDate.toDateString() === today.toDateString()) {
            const event = events.find(e => e.id == reminder.id);
            if (event) {
                alert(`Напоминание: Завтра начнется "${event.sport} (${event.discipline})".`);
            }
        }
    });
}

// Проверяем напоминания при загрузке страницы
checkReminders();
