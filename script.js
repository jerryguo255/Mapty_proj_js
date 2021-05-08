"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  // form.classList.add("hidden");
  console.log("ss");
});
//re-write
let myMap = null;
let coords;
//get location from user browser
navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  coords = [latitude, longitude];
  myMap = L.map("map").setView(coords, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(myMap);

  myMap.on("click", function (e) {
    form.classList.remove("hidden");
    inputDistance.focus();
    const { lat, lng } = e.latlng;
    coords = [lat, lng];

    console.log(coords);
  });
});
inputType.addEventListener("change", function () {
  console.log(inputElevation.closest(".form__row"));
  inputElevation.closest(".form__row").classList.toggle("form_row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form_row--hidden");
});
// .addEventListener("change", function () {
//   console.log("dd");
//   inputCadence.classList.toggle("hidden");
//   inputElevation.classList.toggle("hidden");
// });
// const popup = L.popup({
//   maxWidth: 222,
//   maxHeight: 155,
//   className: "running-popup",
//   autoClose: false,
//   closeOnClick: false,
// })
//   .setLatLng(coords)
//   .setPopupContent("<p>Hello world!<br />This is a nice popup.</p>")
//   .openOn(myMap);

// L.marker(coords).addTo(myMap).bindPopup(popup).openPopup();

//get Geolocation

// //Get Geolocation
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(
//     function (position) {
//       const { latitude, longitude } = position.coords;
//       // const { longitude } = position.coords;
//       console.log(
//         `https://www.google.co.nz/maps/@${latitude},${longitude},20.35z`
//       );
//       const coords = [latitude, longitude];
//       const map = L.map("map").setView(coords, 13);

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(map);

//       //event listener
//       map.on("click", function (mapEvent) {
//         const { lat, lng } = mapEvent.latlng;
//         //set a marker
//         L.marker([lat, lng])
//           .addTo(map)
//           .bindPopup(
//             L.popup({
//               maxWidth: 250,
//               minWidth: 100,
//               autoClose: false,
//               closeOnClick: false,
//               className: "run",
//             })
//           )
//           .setPopupContent("Workout")
//           .openPopup();
//       });
//     },
//     function () {
//       alert("cannot get position");
//     }
//   );
// }
