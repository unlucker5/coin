import { el, setChildren } from "redom"
import { nav } from "../nav"
import { getCordsArray} from "../api"

let app = document.getElementById('app')

export let createAtmPage = function() {
    let mapContainer = el(".p-12.w-full")

    let mapHeader = el("h2.font-bold.text-4xl.text-black.mb-14","Карта банкоматов")

    let mapWrap = el(".flex.w-full.min-h-screen#map")

    setChildren(mapContainer, [mapHeader, mapWrap])
    setChildren(app, mapContainer)
    setChildren(document.body, [nav(), app])


    async function createPlacemarks() {
      try {
        const cordsArray = await getCordsArray();
        const myMap = new ymaps.Map(mapWrap, {
          center: [55.76, 37.64],
          zoom: 10
        });
        cordsArray.forEach(cords => {
          const placemark = new ymaps.Placemark([cords.lat, cords.lon], {}, {});
          myMap.geoObjects.add(placemark);
        });
      } catch (error) {
        console.error(error);
      }
    }
    
    ymaps.ready(function() {
      // Вызов функции createPlacemarks() после загрузки библиотеки
      createPlacemarks();
    });
}


