window.onload = (event) => {

    const routes = [
        {path: '/', handler: homeHandler},
        {path: '/payment.html', handler: paymentHandler},
        {path: '/admin.html', handler: adminHandler},
        {path: '/index.html', handler: homeHandler},
        {path: '/login.html', handler: loginHandler},
        {path: '/signup.html', handler: signupHandler}
    ]

    handleUrlChange();

    function handleUrlChange () {
        const path = window.location.pathname;
        const urlPath = routes.find(route => route.path === path)

        if (urlPath) {
            urlPath.handler();
        }
        else {
            homeHandler();
        }
    }



function homeHandler () {
        const logoutButton = document.querySelector('#logout');
        const buyButtons = document.querySelectorAll("[id^='buy']");
        buyButtons.forEach(button => {
        button.addEventListener("click", buyProduct);
        });

    }
    function paymentHandler () {
        const paymentForm = document.getElementById("payment-form");
        const urlPayment = 'http://127.0.0.1:5000/payment.html';

        paymentForm.addEventListener("submit", (event) => {
            event.preventDefault();

            sendRequestToServer(paymentForm, urlPayment)
            .then(response => {
                    location.replace("/result.html");
                }
    )
    })
    }

    function signupHandler () {
        const signupForm = document.getElementById("signup-form");
        const urlSignup = 'http://127.0.0.1:5000/signup';

        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();

            sendRequestToServer(signupForm, urlSignup)
            .then(response => {
                if (response.isRegistered) {
                    location.replace("/login.html")
                }
            });
    })
    }

    function loginHandler () {
        const loginForm = document.getElementById("login-form");
        const urlLogin = 'http://127.0.0.1:5000/login.html';

        const btn = document.getElementById("signupButton")
        btn.addEventListener("click", (event) => {
            location.replace("signup.html")

        })

        document.getElementById("logoutButton").addEventListener("click", function() {

            localStorage.removeItem("token")

            location.replace("/");
        });

        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            sendRequestToServer(loginForm, urlLogin)
            .then(response => {if (response.isLogged) {
                    location.replace("/");
                    localStorage.setItem("token", response.token);
                    console.log(localStorage.getItem("token"));
                }
    })
    })
    }


    function adminHandler() {
        fetch('http://127.0.0.1:5000/admin', {method: 'GET',
        headers: {
        'Authorization':`Bearer ${localStorage.getItem("token")}`,
        'Content-type':'application/json'},
        })
        .then(response => {console.log(response)})
        .catch(console.error);

        // Загружаем данные из базы данных
        const request = new XMLHttpRequest();
        request.open('GET', '/admin.html');
        console.log(122)
        request.onload = function() {
        if (request.status === 200) {
            const users = JSON.parse(request.response);

        // Создаем список пользователей
            const userList = document.getElementById('userList');
            return users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.name;
            userList.appendChild(li);
            });
        } else {
            console.log('Ошибка загрузки данных');
        }
        };
    request.send();
    }

function logout () {
        localStorage.removeItem('token');
        location.replace('/login.html');
    }


    function sendRequestToServer (form, url) {

        const formData = new FormData(form);
        const data = {};

        for (const[key, value] of formData.entries()) {
            data[key] = value;
        }

        return fetch(url, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .catch(error => console.error('Помилка:', error));
    }

    function signupb() {
        const btns = document.getElementById("signupButton")
        btns.addEventListener("click", (event) => {
            location.replace("signup.html")
        })
    }



    function buyProduct(event) {

  event.preventDefault(); // предотвращает отправку формы

  // здесь нужно реализовать проверку наличия аккаунта
  const hasAccount = checkAccount();

   //если аккаунт есть, перенаправляем на указанный в форме сайт
  if (hasAccount) {
    const form = event.target.closest("form");
    const action = form.getAttribute("action");
    window.open(action, "_blank");
  }
  // если аккаунта нет, перенаправляем на страницу входа
  else {
    window.location.href = "login.html";
  }
}

// функция для проверки наличия аккаунта
function checkAccount() {
    console.log(123)
    const token = localStorage.getItem("token")
  // здесь нужно реализовать логику проверки наличия аккаунта
  // возвращаем true, если аккаунт есть, и false, если его нет
  if (token) {
    return true
  }
  return false // здесь стоит временное значение, замените его на реальную проверку
}

// назначаем обработчик события на все кнопки с id="buyX"
const buyButtons = document.querySelectorAll("[id^='buy']");
buyButtons.forEach(button => {
  button.addEventListener("click", buyProduct);
});


//
//    function login_check() {
//        const btnlc = document.getElementById("buy1")
//        const token = localStorage.getItem("token")
//        btnlc.addEventListener("click", (event) => {
//            if (token) {
//                 location.replace("login.html")
//            }
//        })
//    }


//    function showEvents (data) {
//        console.log(data);
//        const eventsDiv = document.getElementById("display-events");
//
//        const singleDayEvents = document.createElement("div");
//        singleDayEvents.classList.add("single-day-events");
//        eventsDiv.appendChild(singleDayEvents);
//
//        const date = JSON.parse(data[0]).date;
//        console.log(data)
//
//        if (date) {
//            const dateHeader = document.createElement("h4", date, singleDayEvents);
//            dateHeader.textContent = date;
//            singleDayEvents.appendChild(dateHeader);
//        }
//
//        data.forEach((event) => {
//                event = JSON.parse(event);
//
//                const singleEvent = createElementAndAppendChild("div", null, singleDayEvents);
//
//                createElementAndAppendChild("h3", event.header, singleEvent);
//
//                createElementAndAppendChild("span", event.time, singleEvent);
//
//                createElementAndAppendChild("span", event.description, singleEvent);
//        })
//    }
//    function createElementAndAppendChild (tagName, content, tagAddTo) {
//        const createdElement = document.createElement(tagName);
//        if ( content ) { createdElement.textContent = content };
//        tagAddTo.appendChild(createdElement);
//        return createdElement;
//    }

//    function renderEventsForFiveDays () {
//        const endDate = new Date();
//        endDate.setDate(endDate.getDate() + 5);
//        let currentDate = new Date();
//
//        while (currentDate <= endDate) {
//            const date = currentDate.toISOString();
//
//            getEventsByDate(date)
//            .then(data => showEvents(data))
//
//            currentDate.setDate(currentDate.getDate() + 1)
//        }
//    }


}