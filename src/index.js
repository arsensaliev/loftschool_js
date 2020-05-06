import Map from './map';
import TemplateComment from './comment.hbs';
import TemplateBallon from './more.hbs';

ymaps.ready(function () {
    //получаем данные из localStorege
    var localMarks = localStorage.getItem('marks');
    var marks = localMarks ? JSON.parse(localMarks) : [];

    //Создаем экземпляр api работы с картой
    const apiMap = new Map('map', {
        center: [55.76, 37.64],
        zoom: 18
    });

    //Вызываем init для создания карты
    var map = apiMap.init();

    //рендер текущих меток (из localStorage) при загрузке приложения 
    marks.forEach(mark => {
        // console.log(mark)
        apiMap.createPlacemark(mark.coords, {
            balloonContentHeader: mark.coords,
            balloonContent: mark.address
        });
    });

    var banner = document.querySelector('.banner');
    var bannerAddress = document.querySelector('.banner-address__info');
    var closeBanner = document.querySelector('.close-button');
    var shareComment = document.querySelector('.banner-feedback__share');
    var bannerComment = document.querySelector('.banner-comment');
    var moreComment = [];
    var coords = null;
    var address = null;
    async function openBanner(e) {

        var event = e.get('domEvent').originalEvent;
        bannerComment.innerHTML = '';
        bannerAddress.textContent = address;
        banner.classList.remove('hide');
        banner.style.top = event.clientY + 'px';
        banner.style.left = event.clientX + 'px';

        shareComment.onclick = (e) => {
            var myName = document.querySelector('.banner-feedback__name');
            var myPlace = document.querySelector('.banner-feedback__place');
            var myComment = document.querySelector('.banner-feedback__comment');
            if (myName.value && myPlace.value && myComment.value) {

                var comment = {
                    name: myName.value,
                    place: myPlace.value,
                    feedback: myComment.value,
                    coords: coords
                };

                moreComment.push(comment);
                var template = TemplateComment(comment);
                apiMap.createPlacemark(coords, {
                    balloonContentHeader: myPlace.value,
                    balloonContent: TemplateBallon({
                        text: address,
                        coords: coords
                    })
                }, async (e) => {
                    e.preventDefault();
                    let coordsPlace = e.originalEvent.target.geometry._coordinates;
                    coords = coordsPlace;
                    address = await apiMap.geocoder(coords);
                    bannerAddress.textContent = address;
                    bannerComment.innerHTML = '';
                    moreComment.forEach(item => {
                        const [lat, lng] = item.coords;
                        if (coordsPlace.includes(lat) && coordsPlace.includes(lng)) {
                            bannerComment.innerHTML += TemplateComment(item);
                            banner.classList.remove('hide');
                        }
                    });
                });

                bannerComment.innerHTML += template;
                myName.value = '';
                myPlace.value = '';
                myComment.value = '';
            }
        };
        closeBanner.addEventListener('click', (e) => banner.classList.add('hide'));


    }

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('template-address')) {
            let currentCoords = e.target.dataset.coords.split(',');
            coords = currentCoords;
            address = e.target.innerText;
            bannerAddress.textContent = address;
            bannerComment.innerHTML = '';
            moreComment.forEach(item => {
                const [lat, lng] = item.coords;
                if (currentCoords.includes(lat.toString()) && currentCoords.includes(lng.toString())) {
                    bannerComment.innerHTML += TemplateComment(item);
                    banner.classList.remove('hide');
                    console.log('good');
                }
            })
        }
    });
    //Вешаем обработчик клика на карту
    map.events.add('click', async (e) => {
        // получаем координаты клика
        coords = e.get('coords');
        try {
            //получаем адресс по координатам
            address = await apiMap.geocoder(coords);
            //создаем метку по координате при клике
            openBanner(e);
            //Сохроняем данные в localStorage
            marks.push({
                coords,
                address
            });
            localStorage.setItem('marks', JSON.stringify(marks));

        } catch (error) {
            alert(error)
        }

    });

})