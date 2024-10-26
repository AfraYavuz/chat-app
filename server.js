//Express.js'i projeye dahil ediyoruz.
const express = require("express");

// Express.js objesini oluşturun.
const app = express();

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
app.use(express.static("public"));

app.get("/", (req, res) => {
  // Tarayıcıda public dizini altındaki dosyaları görüntüleyin.
  res.send("public dizini altındaki dosyaları görüntüleyin");
});
