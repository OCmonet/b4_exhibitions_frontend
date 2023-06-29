import { frontendBaseURL, payload, payloadParse, backendBaseURL } from "./api.js";
const API_URL = `${backendBaseURL}/exhibitions/weather/`
async function injectNavbar() {
    fetch("../templates/navbar.html").then(response => {
        return response.text()
    })
        .then(data => {
            document.querySelector("header").innerHTML = data;
        });
    const NavbarHTML = await fetch("../templates/navbar.html");
    const data = await NavbarHTML.text();
    document.querySelector("header").innerHTML = data;

    // 카테고리 id 기준으로 addEventListener 부여 
    for (let i = 1; i < 9; i++)
        document.getElementById(i).addEventListener("click", function () {
            selectCategory(this.value)
        })
    updateWeather();

    async function fetchWeatherData() {
        try {
            const response = await fetch(API_URL);

            if (response.ok) {
                const data = await response.json();
                const iconUrl = getWeatherIconUrl(data.weather[0].icon);
                return { data, iconUrl };
            } else {
                throw new Error(`Failed to fetch weather data: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    }
    // 날씨 아이콘  URL
    function getWeatherIconUrl(iconId) {
        return `https://openweathermap.org/img/wn/${iconId}.png`;
    }
    // 날씨 정보 업데이트
    function updateWeather() {
        document.getElementById("weather-text").innerHTML = "로딩 중...";

        fetchWeatherData()
            .then(({ data, iconUrl }) => {
                const { main, weather } = data;
                const img = document.createElement("img");
                const weatherText = `${Math.round(main.temp * 10) / 10}ºC`;
                img.src = iconUrl;
                img.alt = weather[0].description;
                const weatherElement = document.getElementById("weather-info");
                weatherElement.innerHTML = weatherText;
                weatherElement.appendChild(img);
            })
    }


    if (payload) {
        // 내비바 왼쪽 항목
        const navbarLeft = document.getElementById("navbarLeft");

        // 내비바 오른쪽 항목
        const navbarRight = document.getElementById("navbarRight");
        const logOutButton = document.createElement("button");
        logOutButton.setAttribute("class", "text-warning ms-5 me-5 btn btn-light shadow-warning material-symbols-outlined");
        logOutButton.innerText = "person 로그아웃";
        logOutButton.addEventListener("click", handleLogOut);

        const myPage = document.createElement("a");
        myPage.setAttribute("class", "text-warning ms-5 btn btn-light shadow-warning material-symbols-outlined");
        myPage.innerText = "person 내 정보";
        myPage.setAttribute("href", `${frontendBaseURL}/templates/my-page.html?user_id=${payloadParse.user_id}`);
        navbarRight.appendChild(myPage);
        navbarRight.appendChild(logOutButton);

        // payload 존재시 숨길 항목
        const signInButton = document.getElementById("signInButton");
        const signUpButton = document.getElementById("signUpButton");
        signInButton.style.display = "none";
        signUpButton.style.display = "none";
    }

}

// 로그아웃 함수 
function handleLogOut() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("payload");
    location.reload();
}
function selectCategory(category) {
    if (payloadParse && payloadParse.is_admin) {
        window.location.href = `${frontendBaseURL}/templates/backoffice-main.html?category=${category}`
    } else {
        window.location.href = `${frontendBaseURL}/index.html?category=${category}`
    }
}

injectNavbar();
