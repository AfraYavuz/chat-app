const users =
  []; /*Bu ifade, uygulamada aktif olan kullanıcıları saklamak için boş bir dizi oluşturur.
Her bir kullanıcı, diziye bir nesne olarak eklenecek, bu nesne kullanıcının kimliğini, adını ve hangi odada bulunduğunu içerecektir. */

// Join user to chat-Bu fonksiyon, bir kullanıcının sohbet odasına katıldığında çağrılır.
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user-Bu fonksiyon, verilen bir id'ye karşılık gelen mevcut kullanıcıyı almak için kullanılır.
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat-Bu fonksiyon, bir kullanıcının sohbet odasından ayrıldığında çağrılır.
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users-Bu fonksiyon, belirtilen bir odada bulunan tüm kullanıcıları almak için kullanılır.
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
