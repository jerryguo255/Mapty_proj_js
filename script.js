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

//Get Geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords;
      // const { longitude } = position.coords;
      console.log(
        `https://www.google.co.nz/maps/@${latitude},${longitude},20.35z`
      );
      const coords = [latitude, longitude];
      const map = L.map("map").setView(coords, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //event listener
      map.on("click", function (mapEvent) {
        const { lat, lng } = mapEvent.latlng;
        //set a marker
        L.marker([lat, lng]).addTo(map).bindPopup("Workout").openPopup();
      });
    },
    function () {
      alert("cannot get position");
    }
  );
}
