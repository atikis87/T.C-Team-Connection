const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);


const socket = io();

// Join chatroom
socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ({room, users})=>
{
    outputRoomName(room);
    outputUsers(users);

});

//Message from server
socket.on('message', message =>
{
    console.log(message);
    outputMessage(message);

    // Scrool down
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

// Message submit
chatForm.addEventListener('submit', (e)=>
{
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input texfeld
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();


});



// Output message to DOM
function outputMessage(message) 
{
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}


// Add rooom name to DOM
function outputRoomName()
{
    roomName.innerText = room;
};

// Add users to DOM
function outputUsers(users)
{
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
};