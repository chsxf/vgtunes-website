let searchIndexRequest = new XMLHttpRequest();
searchIndexRequest.addEventListener("load", onSearchIndexLoaded);

let searchIndex = null;

function onSearchIndexLoaded() {
  searchIndex = JSON.parse(searchIndexRequest.responseText);
  let searchField = document.getElementById("search-terms");
  searchField.setAttribute("placeholder", "Search for albums");
  searchField.removeAttribute("disabled");
  searchField.addEventListener("input", onSearchInput);
}

function setupSearch() {
  searchIndexRequest.open("get", "/searchIndex.json");
  searchIndexRequest.send();
}

function onSearchInput(e) {
  e.preventDefault();
  e.stopPropagation();

  let foundSlugs = [];

  const searchTerm = this.value.toLowerCase();
  for (var albumSlug in searchIndex.albums) {
    let album = searchIndex.albums[albumSlug];
    if (album.t.toLowerCase().indexOf(searchTerm) >= 0) {
      foundSlugs.push(albumSlug);
    }
  }

  updateSearchResults(foundSlugs);
}

function updateSearchResults(foundSlugs) {}

(function () {
  setupSearch();
})();
