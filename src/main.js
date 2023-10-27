import { userIcon } from './helper.js'

//provided by HTML
const form = document.querySelector('form')
const input = document.querySelector('form #title')
const cancelBtn = document.querySelector('form #cancel')
const noteList = document.querySelector('ul')

// common variables
var map
var coords = []
var notes = []
var markerLayer = []

// event viewers
cancelBtn.addEventListener('click', () => {
  form.style.display = 'none'
  clearForm()
})

// printing the map on the screen based on the user's location
function loadMap(coords) {
  // installation of the map
  map = L.map('map').setView(coords, 10)

  //Information about our map. Type vs physical geography vs.
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  //create a separate layer where we will keep the cursors
  markerLayer = L.layerGroup().addTo(map)
  // show user's location
  L.marker(coords, { icon: userIcon }).addTo(map).bindPopup('Your Location!')

  //tracks click events on the map, it is not possible to listen with addevent listener.
  map.on('click', onMapClick)
}

//track form submission
form.addEventListener('submit', (e) => {
  e.preventDefault()
  // accessing values ​​inside the form
  const title = e.target[0].value
  const date = e.target[1].value
  const status = e.target[2].value
  // add this element to notes array
  notes.unshift({
    id: new Date().getTime(),
    title,
    date,
    status,
    coords,
  })
  //list notes
  renderNoteList(notes)

  //close the form
  form.style.display = 'none'
  clearForm()
})

// press the cursor on the screen
function renderMarker(item) {
  // create cursor
  L.marker(item.coords)
    // add cursor to layer
    .addTo(markerLayer)
    // add popup to cursor
    .bindPopup(item.title)
}

//printing the note list on the screen
function renderNoteList(items) {
  // cleaning old elements
  noteList.innerHTML = ''
  //clear old cursors
  markerLayer.clearLayers()

  //run screen push function for each element
  items.forEach((ele) => {
    //create element li
    const listEle = document.createElement('li')
    //determine its content
    listEle.innerHTML = ` 
        <li>
        <div>
          <p>${ele.title}</p>
          <p><span>Date: </span>${ele.date}</p>
          <p><span>Category: </span>${ele.status}</p>
        </div>
        <i id="fly" class="bi bi-airplane-fill"></i>
        <i id="delete" class="bi bi-trash3-fill"></i>
      </li>`
    //Send to HTML list
    noteList.appendChild(listEle)
    //push the cursor to the screen at each step of the loop
    renderMarker(ele)
  })
}

// request user's location
navigator.geolocation.getCurrentPosition(
  // If the user allows, open the map at his location
  (e) => loadMap([e.coords.latitude, e.coords.longitude]),
  // If it doesn't allow, open in default location
  () => {
    loadMap([38.802424, 35.505317])
  }
)

//function that runs when clicking on the map
const onMapClick = (e) => {
  //transfer coordinates to common area
  coords = [e.latlng.lat, e.latlng.lng]
  // show form
  form.style.display = 'flex'
  // If we want to focus the user on an input by js, focus() function is used.
  input.focus()
}

//clears the form
function clearForm() {
  form[0].value = ''
  form[1].value = ''
  form[2].value = 'goto'
}
