//Express.js'i projeye dahil ediyoruz.
const express = require("express");
//
const socketio = require("socket.io");
//
const http = require("http");
const formatMessage = require("./utils/messages");
//Socket.IO için Redis adapter'ını içe aktarır
const createAdapter = require("@socket.io/redis-adapter").createAdapter;
//Bu ifade, Redis ile etkileşim kurmak için kullanılan redis paketini içe aktarır.
const redis = require("redis");
//dotenv modülü, uygulama içerisinde çevresel değişkenleri yönetmek için kullanılır.config() fonksiyonu, .env dosyasındaki değişkenleri yükler ve process.env nesnesi aracılığıyla erişilebilir hale getirir.
require("dotenv").config();
//createClient fonksiyonu, Redis sunucusuna yeni bir istemci (client) oluşturmak için kullanılır.
const { createClient } = redis;
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

// Express.js objesini oluşturun.
const app = express();
const server = http.createServer(app);
// Socket.IO kütüphanesi projeye dahil edilir.
const io = socketio(server);

/*istemciler bağlandığında sunucu tarafında bir olay tetikler ve her yeni bağlantıda belirli işlemler (örneğin, sunucuya mesaj gönderme veya istemciye veri yollama) yapılmasına olanak tanır.
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});*/

/* Sunucuyu 8080 portunda başlatın,8080 portunda bir istemci bağlandığında konsola "a user connected" mesajı yazdırır.
server.listen(8080, () => {
    console.log("Server is running on port 8080");
  });*/

/* Bu yapı sayesinde istemciden sunucuya bir mesaj gönderildiğinde, sunucu bu mesajı alıp işleyebilir veya konsolda görüntüleyebilir.
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});*/

//
const botName = "ChatCord Bot";
//Bu kod, Redis kullanarak Socket.IO'nun dağıtılmış bir ortamda çalışabilmesini sağlayan bir yapı oluşturur. Socket.IO-Redis adapter ile çoklu sunucu yapısında bile Socket.IO üzerinden mesajlaşmayı senkronize edebiliriz.
(async () => {
  pubClient = createClient({ url: "redis://127.0.0.1:7777" });
  await pubClient.connect();
  subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
})();

// Bu kod, Socket.IO kullanarak bir kullanıcı bir odaya katıldığında tetiklenen olayları ve bağlantı işlemlerini yönetir. Kullanıcı sunucuya bağlandığında, ona özel bir "socket" nesnesi atanır. Kullanıcı belirli bir odaya katıldığında sunucuda ona özel bir karşılama mesajı gönderilir.
io.on("connection", (socket) => {
  console.log(io.of("/").adapter);
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects - Bu kod, bir kullanıcı belirli bir odaya katıldığında, o odadaki diğer kullanıcılara bir duyuru mesajı gönderir. Bu mesaj, yeni kullanıcının odaya katıldığını belirtir.
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info - Bu kod, belirli bir odaya kullanıcı katıldığında veya ayrıldığında, o odadaki tüm kullanıcılara güncel oda bilgilerini gönderir. Bu güncelleme, odadaki kullanıcıların listesini içerir, böylece her kullanıcı mevcut katılımcıları görebilir.
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage - Bu kod, bir kullanıcı sohbet mesajı gönderdiğinde o mesajı alır ve aynı odadaki diğer tüm kullanıcılara yayınlar. Kullanıcının kimliği ve mesajı iletilerek odadaki herkesin mesajı görmesi sağlanır.
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects - Bu kod, bir kullanıcı bağlantısını kestiğinde (örneğin, tarayıcıyı kapatması veya internet bağlantısının kesilmesi durumunda) tetiklenen olayları yönetir. Kullanıcının odadan ayrıldığını diğer kullanıcılara bildirmek için kullanılır.
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info - Bu kod parçası, bir kullanıcının bir odadan ayrıldığında veya yeni bir kullanıcı katıldığında, o odadaki tüm kullanıcılara güncel kullanıcı listesini ve odanın adını iletmek için kullanılır. Bu, sohbet ortamında katılımcıların kimlerin olduğunu bilmek açısından önemlidir.
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

/*3000 portuna bir server kurulumu yaptık
burada yapacağımız eylemleri tepki ve sonuçlarını (localhost:3000)
yani 3000 portunda görüntüleyebileceğiz*/
// Bir route oluşturun. Bu route bir GET isteği için çalışacaktır.
app.listen(3000, () => {
  console.log(
    "Sunucu başlatıldı, http://localhost:3000 adresinden erişebilirsiniz."
  );
});

// express.static() fonksiyonunu kullanarak,
// bir dizin altındaki dosyaları tarayıcıda görüntüleyin.
/*Bu middleware, public klasöründeki dosyaları sunucuya "statik" olarak sunar. Yani, /public klasöründeki dosyalar bir backend işlemi olmadan doğrudan istemcilere sunulabilir.*/
//örnek:http://localhost:3000/style.css - Bu yapı, özellikle istemciye sunulması gereken sabit dosyalar için oldukça kullanışlıdır.
app.use(express.static("public"));

app.get("/", (req, res) => {
  // Tarayıcıda public dizini altındaki dosyaları görüntüleyin.
  res.send("public dizini altındaki dosyaları görüntüleyin");
});
