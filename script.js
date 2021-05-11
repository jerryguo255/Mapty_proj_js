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

class App {
  #myMap;
  #coords;
  #workouts = [];
  constructor() {
    this._getPosition();

    //s4 when inputType change, toggles corresponding field
    inputType.addEventListener("change", this._toggleElevationField);

    //s5 add submit event to form,
    form.addEventListener("submit", this._newWorkout.bind(this));
  }
  //s1 getGeoLocation
  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      this._loadMap.bind(this)
    );
  }

  //s2 loadMap
  _loadMap(position) {
    //default coords
    let latitude = 30.5928,
      longitude = 114.3055;
    //if user accepted getting geolocation, otherwise, use default coords
    if (position instanceof GeolocationPosition)
      ({ latitude, longitude } = position.coords);

    this.#myMap = L.map("map").setView([latitude, longitude], 13);

    //set tileLayer to myMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#myMap);

    //s3 handle click event on myMap with showForm
    this.#myMap.on("click", this._showForm.bind(this));
  }

  _showForm(e) {
    //show form for each click
    form.classList.remove("hidden");
    inputDistance.focus();
    //get coords from click event , then stored coords
    this.#coords = [e.latlng.lat, e.latlng.lng];
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    //after every selection , foncs back to distance field
    inputDistance.focus();
  }

  _newWorkout(e) {
    //prevent refreshing of form submit
    e.preventDefault();

    //get data from form
    const dist = inputDistance.value;
    const duration = inputDuration.value;
    const cadence = inputCadence.value;
    const elevation = inputElevation.value;
    const type = inputType.options[inputType.selectedIndex].text;
    let workout = "";
    let dataVaild = false;
    //check if data is empty
    if (
      dist?.trim() &&
      duration?.trim() &&
      (type === "Running" ? cadence?.trim() : elevation?.trim())
    ) {
      //check if data is a number
      if (
        parseInt(dist) &&
        parseInt(duration) &&
        (type === "Running" ? parseInt(cadence) : parseInt(elevation))
      ) {
        console.log(typeof parseInt(dist));
        //check if data is >= 0
        if (
          dist > 0 &&
          duration > 0 &&
          (type === "Running" ? cadence > 0 : elevation > 0)
        ) {
          dataVaild = true;
        } else {
          alert("number should be greater equal 0");
        }
      } else {
        console.log(typeof parseInt(dist));
        alert("all fields need to be number");
      }
    } else {
      alert("all fields need to fill");
    }

    if (dataVaild) {
      //create corresponding instance
      if (type === "Running") {
        workout = new Running(
          this.#coords,
          inputDistance.value,
          inputDuration.value,
          inputCadence.value
        );
      } else
        workout = new Cycling(
          this.#coords,
          inputDistance.value,
          inputDuration.value,
          inputElevation.value
        );

      //clear input fields & hide form
      inputDistance.value = inputDuration.value = inputElevation.value = inputCadence.value =
        "";
      form.classList.add("hidden");

      //add the instance to array
      this.#workouts.push(workout);

      //render workout on map as marker
      this._displayMarker(workout);

      //render workout on side list
      TODO;
    }
  }

  _displayMarker(workout) {
    console.log(this.#workouts);
    const popup = L.popup({
      className: workout instanceof Running ? `running-popup` : `cycling-popup`,
      closeOnClick: false,
      autoClose: false,
    }).setContent("s");
    L.marker(this.#coords).addTo(this.#myMap).bindPopup(popup).openPopup();
  }
}

//#region  Data structure
class Workout {
  constructor(coords, distance, duration) {
    this.coords = coords;
    //Kilometer
    this.distance = distance;
    //mintue
    this.duration = duration;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
  }
  calcSpeed() {
    // return km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, candence) {
    super(coords, distance, duration);
    this.candence = candence;
  }

  calcPace() {
    // return pace  min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
//#endregion

const app = new App();
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
