/*Bu kod parçacığı, bir mesajı belirli bir formatta döndürmek için kullanılan bir işlevi içerir. 
İşlev, kullanıcının adını, mesaj metnini ve mesajın gönderildiği zamanı içeren bir nesne oluşturur.*/
const moment = require("moment"); /*moment kütüphanesi, tarih ve zaman işlemleri için yaygın olarak kullanılan bir JavaScript kütüphanesidir.
Bu kütüphane, tarihleri biçimlendirme, karşılaştırma ve diğer tarih işlemleri yapmak için kolay bir API sunar.
Bu satır, moment kütüphanesini içe aktararak kullanılabilir hale getirir.*/

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}

module.exports = formatMessage;
/*özet:Bu kod, kullanıcı adı, mesaj metni ve gönderim zamanını içeren bir mesaj nesnesi oluşturan formatMessage adlı bir fonksiyon tanımlar.
 moment kütüphanesini kullanarak zamanın biçimlendirilmesi sağlanır. */
