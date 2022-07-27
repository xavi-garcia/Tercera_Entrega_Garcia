const socket = io();
const sendButton = document.getElementById("sendButton");
const email = document.getElementById("email");
const message = document.getElementById("message");
const username = document.getElementById("username");
const systemUsername = document.getElementById("systemUsername");
const form = document.getElementById("form");


const sendMessage = (e) => {
  e.preventDefault();
  if (!message.value || !message.value) {
    return;
  }
  const chat = {
    user: {
      email: email.value,
      username: username.value,
    },
    system: {
      username: systemUsername.value,
    },
    date: Date.now(),
    text: message.value,
  };

  socket.emit("message", chat);
  form.reset();
  return false;
};


sendButton.addEventListener("click", sendMessage);

const showChat = (chat) => {
    const today = new Date()
    const room = chat.map((e) =>`<p><strong>-${e.author.email} </strong>${today.toDateString()}<em class="bubble">: ${e.text}</em></p>`).join(" ");
    document.getElementById("chatRoom").innerHTML = room;
};

socket.on("messages", (data) => showChat(data));




