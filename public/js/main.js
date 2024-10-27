const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL - URL'deki sorgu parametrelerini kullanarak kullanıcı adı ve oda bilgisini alır ve bir WebSocket bağlantısı başlatır.
const { username, room } = Qs.parse(location.search, {
  //Qs.parse fonksiyonu, URL’deki sorgu parametrelerini (location.search) nesneye dönüştürür. Örneğin, URL ?username=John&room=JavaScript şeklindeyse bu fonksiyon { username: "John", room: "JavaScript" } nesnesini döndürür.
  ignoreQueryPrefix: true,
});
console.log(username, room);

const socket = io(); //socket değişkeni, sunucu ile gerçek zamanlı veri alışverişi yapılmasını sağlar ve bu değişken üzerinden mesaj gönderme/alma işlemleri yapılabilir.

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users - odadaki kullanıcı listesini ve oda adını güncel tutmak için kullanılır ve sunucudan her "roomUsers" olayı tetiklendiğinde güncellenir.
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message); // gelen mesajı arayüze ekler

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight; //sohbet alanını otomatik olarak aşağı kaydırarak son gelen mesajın görünür olmasını sağlar.
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "../index.html";
  } else {
  }
});
