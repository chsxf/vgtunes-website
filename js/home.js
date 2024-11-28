function setupHome() {
  let albums = document.getElementsByClassName("album");
  for (let album of albums) {
    album.addEventListener("click", function (e) {
      document.location.href = album.attributes["data-url"].value;
    });
  }
}

(function () {
  setupHome();
})();
