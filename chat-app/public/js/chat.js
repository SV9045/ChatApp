const socket = io();

// Elements
const input = document.querySelector('input');
const locationBtn = document.getElementById('share-location-btn');
const submitBtn = document.getElementById('submit-btn');
const messages = document.getElementById('messages');
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;

// Templates
const messageTempltae = document.getElementById('message-template').innerHTML;
const locationTemplate = document.getElementById('location-template').innerHTML;

// Query Strings
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// Challenge 2
socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messageTempltae, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('MMMM Do, YYYY,h:mm A')
  });
  messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (url) => {
  console.info(url);
  const location = Mustache.render(locationTemplate, {
    username: url.username,
    url: url.url,
    locatedAt: moment(url.createdAt).format('MMMM Do, YYYY,h:mm A')
  });
  messages.insertAdjacentHTML('beforeend', location);
});

submitBtn.addEventListener('click', getMessage);
function getMessage(e) {
  const message = document.getElementById('input-value').value;
  if (message) {
    socket.emit('sendMessage', message, (error) => {
      if (error) {
        return console.log(error);
      }
      console.log('message delivered');
    });
    input.value = '';
    input.focus();
    e.preventDefault();
  }
  // console.log(message);

  // Acknowledgement process
  // server(emit) --> client(recieve). client will send acknowledgement to the server.
  // client(emit) --> server(recieve). server will send acknowledgement to the client.
}

locationBtn.addEventListener('click', shareLocation);

function shareLocation() {
  if (!navigator.geolocation) {
    alert('geolocation is not supported in your browser');
  }

  locationBtn.disabled = true;
  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      () => {
        locationBtn.disabled = false;
        console.log('Location Shared');
      }
    );
  });
}

socket.on('roomData', ({ room, users}) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  document.getElementById('sidebar').innerHTML = html;
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
