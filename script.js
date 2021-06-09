"use strict";

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
  #mapZoomLevel = 11;
  constructor() {
    //get user's position
    this._getPosition();

    //get data from local storage
    this._getLocalStorage();

    //s4 when inputType change, toggles corresponding field
    inputType.addEventListener("change", this._toggleElevationField);

    //s5 add submit event to form,
    form.addEventListener("submit", this._newWorkout.bind(this));

    //feature that will move the map to the position of workout that was clicked in the sidelist
    //using event deligation to parent element
    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));
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

    this.#myMap = L.map("map").setView(
      [latitude, longitude],
      this.#mapZoomLevel
    );

    //set tileLayer to myMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#myMap);

    //s3 handle click event on myMap with showForm
    this.#myMap.on("click", this._showForm.bind(this));

    // marker displaying must after the map initialized
    this.#workouts.forEach((work) => {
      this._displayMarker(work);
    });
  }

  _showForm(e) {
    //show form for each click
    form.classList.remove("hidden");
    inputDistance.focus();
    //get coords from map click event , then stored coords
    this.#coords = [e.latlng.lat, e.latlng.lng];
  }

  _clearInputNHideForm() {
    inputDistance.value =
      inputDuration.value =
      inputElevation.value =
      inputCadence.value =
        "";

    //avoid animation
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 11);
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
    // const type = inputType.options[inputType.selectedIndex].text;
    const type = inputType.value;
    let workout = "";

    //rewrite using Guard Clauses

    //#region  validition methods
    //check if datas is all filled
    const allInputsFilled = function (...fields) {
      // let flag = true;
      // fields.forEach(function (el, index, _) {
      //   if (el === "") flag = false;
      // });
      // return flag;
      return fields.every((v) => v !== "");
    };

    //check if datas is all numbers
    const isAllInputsNumber = (...fields) =>
      //fields.forEach((e) => console.log(Number.parseInt(e)));
      fields.every((v) => Number.isFinite(Number.parseInt(v)));

    //check if datas is all numbers positive except elevation
    const isAllInputsPositive = (...fields) =>
      fields.every((v) => Number.parseInt(v) >= 0);
    //#endregion

    //create corresponding object
    if (type == "running") {
      if (!allInputsFilled(dist, duration, cadence)) {
        return alert("all fields need filled");
      }
      if (!isAllInputsNumber(dist, duration, cadence)) {
        return alert("all fields need be a number");
      }
      if (!isAllInputsPositive(dist, duration, cadence)) {
        return alert("all number need be positive");
      }
      workout = new Running(
        this.#coords,
        Number.parseInt(dist),
        Number.parseInt(duration),
        Number.parseInt(cadence)
      );
    }

    if (type == "cycling") {
      if (!allInputsFilled(dist, duration, elevation)) {
        return alert("all fields need filled");
      }
      if (!isAllInputsNumber(dist, duration, elevation)) {
        return alert("all fields need be a number");
      }
      if (!isAllInputsPositive(dist, duration)) {
        return alert("dist, duration need be positive");
      }
      workout = new Cycling(
        this.#coords,
        Number.parseInt(dist),
        Number.parseInt(duration),
        Number.parseInt(elevation)
      );
    }
    //#region first try

    //let dataVaild = false;

    // //check if data is empty
    // if (
    //   dist?.trim() &&
    //   duration?.trim() &&
    //   (type === "Running" ? cadence?.trim() : elevation?.trim())
    // ) {
    //   //check if data is a number
    //   if (
    //     parseInt(dist) &&
    //     parseInt(duration) &&
    //     (type === "Running" ? parseInt(cadence) : parseInt(elevation))
    //   ) {
    //     //check if data is >= 0
    //     if (
    //       dist > 0 &&
    //       duration > 0 &&
    //       (type === "Running" ? cadence > 0 : elevation > 0)
    //     ) {
    //       dataVaild = true;
    //     } else {
    //       alert("number should be greater equal 0");
    //     }
    //   } else {
    //     console.log(typeof parseInt(dist));
    //     alert("all fields need to be number");
    //   }
    // } else {
    //   alert("all fields need to fill");
    // }

    // if (dataVaild) {
    //   //create corresponding instance
    //   if (type === "Running") {
    //     workout = new Running(
    //       this.#coords,
    //       inputDistance.value,
    //       inputDuration.value,
    //       inputCadence.value
    //     );
    //   } else
    //     workout = new Cycling(
    //       this.#coords,
    //       inputDistance.value,
    //       inputDuration.value,
    //       inputElevation.value
    //     );
    //#endregion
    //clear input fields & hide form
    this._clearInputNHideForm();

    //add the instance to array
    this.#workouts.push(workout);

    //render workout on map as marker
    this._displayMarker(workout);

    //render workout on side list
    this._displaySideList(workout);

    //set local storage to all workouts
    this._setLocalStorage();
  }

  _displayMarker(workout) {
    L.layerGroup().clearLayers();

    const popup = L.popup({
      className: workout.type == "running" ? `running-popup` : `cycling-popup`,
      closeOnClick: false,
      autoClose: false,
    }).setContent(
      (workout.type == "running" ? `🏃‍♂️ ` : `🚴‍♀️ `) + `${workout.description}`
    );
    //set the workout 's coords
    L.marker(workout.coords).addTo(this.#myMap).bindPopup(popup).openPopup();
  }

  _displaySideList(workout) {
    let html = `
  <li class="workout workout--${workout.type}" data-id="${workout.id}">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type == "running" ? `🏃‍♂️` : `🚴‍♀️`
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;
    if (workout.type === "running")
      html += `
    <div class="workout__details">
       <span class="workout__icon">⚡️</span>
       <span class="workout__value">${workout.pace.toFixed(1)}</span>
       <span class="workout__unit">min/km</span>
    </div>
    <div class="workout__details">
       <span class="workout__icon">🦶🏼</span>
       <span class="workout__value">${workout.candence}</span>
       <span class="workout__unit">spm</span>
    </div>
  </li>
  `;

    if (workout.type === "cycling")
      html += `
      <div class="workout__details">
       <span class="workout__icon">⚡️</span>
       <span class="workout__value">${workout.speed.toFixed(1)}</span>
       <span class="workout__unit">km/h</span>
      </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevationGain}</span>
      <span class="workout__unit">m</span>
    </div>
  </li>
  `;

    containerWorkouts.insertAdjacentHTML("beforeend", html);
  }

  _moveToPopup(e) {
    //event bubbling, get the workout element
    const workoutEl = e.target.closest(".workout");
    console.log(e.target);

    //guard clause
    if (!workoutEl) return;

    //find workout object through workout element from the UI
    const workout = this.#workouts.find(
      (work) => work.id === workoutEl.dataset.id
    );
    this.#myMap.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _setLocalStorage() {
    //convert object to JSON String
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    //get the JSON String from local storage
    const data = JSON.parse(localStorage.getItem("workouts"));

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach((work) => {
      this._displaySideList(work);
    });
  }

  reset() {
    localStorage.removeItem("workouts");
    location.reload();
  }
}

//#region  Data structure
class Workout {
  date = new Date();
  id = (Date.now() + " ").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    //Kilometer
    this.distance = distance;
    //mintue
    this.duration = duration;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }
  calcSpeed() {
    // return km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, candence) {
    super(coords, distance, duration);
    this.candence = candence;
    this.calcPace();
    this._setDescription();
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
