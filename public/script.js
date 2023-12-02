const root = document.querySelector(".root");
const baseUrl = `${window.location.origin}`;

const fetchAlbums = async () => {
  try {
    /* global axios */
    const { data } = await axios.get(`${baseUrl}/albums/?user=arttu`);

    const albums = data.map((album) => {
      return `<ul><li>${album.artist}</li><li>${album.title}</li><li>${album.year}</li><li>${album.genre}</li></ul>`;
    });
    root.innerHTML = albums.join("");
  } catch (e) {
    console.log(e);
    root.innerHTML = `<div class="alert alert-danger">Could not fetch data</div>`;
  }
};

fetchAlbums();
