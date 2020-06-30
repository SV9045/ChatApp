const socket = io();

const input = document.querySelector('input');
const locationBtn = document.getElementById('share-location');
const messages = document.getElementById('messages');

// Templates
const messageTempltae = document.getElementById('message-template').innerHTML;

// socket.on('countUpdated', (count) => {
//   console.log('Account has been updated', count);
// })

// const incButton = document.getElementById('inc');
// incButton.addEventListener('click', getIncrement);

// function getIncrement() {
//   console.log('Increment button clicked');
//   socket.emit('increment');
// }

// Challenge 1
// socket.on('message', (message) => {
//   console.log(message);
// })

// Challenge 2
socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messageTempltae, {message});
  messages.insertAdjacentHTML('beforeend', html);
});

const submitBtn = document.getElementById('submit-btn');

submitBtn.addEventListener('click', getMessage);
function getMessage() {
const message = document.getElementById('input-value').value;
if(message) {
  socket.emit('sendMessage', message, (error) => {
    if(error) {
      return console.log(error);
    }
    console.log('message delivered');
  });
  input.value = '';
  input.focus();
}
  // console.log(message);

// Acknowledgement process
// server(emit) --> client(recieve). client will send acknowledgement to the server.
// client(emit) --> server(recieve). server will send acknowledgement to the client.
}

locationBtn.addEventListener('click', shareLocation);

function shareLocation(){
  if (!navigator.geolocation) {
    alert('geolocation is not supported in your browser');
  }
  
  locationBtn.disabled = true;
  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      locationBtn.disabled = false;
      console.log('Location Shared');
    })
  })
}

