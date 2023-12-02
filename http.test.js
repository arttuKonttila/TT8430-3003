const { default: axios } = require("axios");
const config = require("./config");
const testData = require("./Albums.albums");
const supertest = require("supertest");
const app = require("./index");
const Album = require("./models/Album");
const { beforeEach, beforeAll } = require("@jest/globals");
let count = 0;
let session_cookie;

beforeAll(async () => {
  const api = supertest(app);
  // login
  session_cookie = (await api.post("/login").send({ username: "testUser", password: "admin" }))
    .headers["set-cookie"];
});

beforeEach(async () => {
  // initialize database
  await Album.deleteMany();
  testData.forEach(async (album) => {
    await Album.create(album).catch((err) => {
      throw Error(err.message);
    });
  });
  count = testData.length;
});

describe("Tests", () => {
  describe("Get", () => {
    test("Verify album count", async () => {
      const api = supertest(app);
      // get
      const data = (await api.get("/albums").expect(200)).body;
      expect(data.data.length).toBe(count);
    });
  });

  describe("Post", () => {
    test("Album creation", async () => {
      const api = supertest(app);
      const album = {
        artist: "testi2222",
        title: "testi2222",
        year: 2020,
        genre: "testi222",
        tracks: 22,
      };

      await api
        .post("/albums")
        .set("Content-type", "application/json")
        .set("Cookie", session_cookie)
        .send(album);

      const data = (await api.get("/albums").expect(200)).body;
      expect(data.data.length).toBe(count + 1);
    });
  });

  describe("Delete", () => {
    test("Album deletion", async () => {
      const api = supertest(app);

      const album = await Album.findOne({ artist: "Steely Dan" });

      await api
        .delete("/albums/" + album._id)
        .set("Content-type", "application/json")
        .set("Cookie", session_cookie);

      const data = (await api.get("/albums").expect(200)).body;
      expect(data.data.length).toBe(count - 1);
    });
  });
});
