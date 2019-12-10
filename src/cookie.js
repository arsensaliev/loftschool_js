/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

// Поиск куки
filterNameInput.addEventListener('keyup', function () {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    const value = filterNameInput.value;
    const allCookie = getCookie();
    const result = filterObj(value, allCookie);

    renderCookie(result);
});

// Функция фильтра объекта
function filterObj(value, obj) {
    let filter = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (isMatching(key, value) || isMatching(obj[key], value)) {
                filter[key] = obj[key];
            }
        }
    }

    return filter;
}

// Функция поиска куки
function isMatching(full, chunk) {
    const RexExp = new RegExp(chunk, 'i');

    return full.search(RexExp) > -1;
}

// Показать все куки при загрузики странице
window.addEventListener('DOMContentLoaded', () => {
    renderCookie(getCookie());
});

// Функция удаление выбранного куки
listTable.addEventListener('click', evt => {
    const target = evt.target;

    if (target.tagName === 'BUTTON') {
        const tr = target.closest('tr');
        const nameCookie = tr.dataset.about;
        const date = new Date(0);

        document.cookie = `${nameCookie}=; path=/; expires=" ${date.toUTCString()}`;
        tr.remove();
    }

});

// Функция показа всех кук в таблице
function renderCookie(obj) {
    listTable.innerHTML = '';
    if (Object.keys(obj).length) {
        for (const item in obj) {
            if (obj.hasOwnProperty(item)) {
                listTable.innerHTML += `<tr data-about="${item}">
            <td>${item}</td>
            <td>${obj[item]}</td>
            <td><button>Удалить</button></td>
        </tr>`
            }
        }
    }

}

// Функция для получения всех кук
function getCookie() {
    const cookie = document.cookie;

    if (cookie) {
        return cookie.split('; ').reduce((prev, next) => {
            const [key, value] = next.split('=');

            prev[key] = value;

            return prev;
        }, {})
    }

    return {};
}

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    if (addNameInput.value && addValueInput.value) {
        document.cookie = `${addNameInput.value}=${addValueInput.value}`;
        const value = filterNameInput.value;
        const allCookie = getCookie();
        const result = filterObj(value, allCookie);

        renderCookie(result);
    }
});