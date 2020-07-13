export const shortUrl = {
  async encodeKey(k) {
    if (k) {
      const d = new URLSearchParams([["url", JSON.stringify(k)]]);
      const res = await fetch("https://es-scalability-test.ue.r.appspot.com", {
        method: "post",
        body: d,
      }).then((el) => el.text());
      return await res;
    }
  },
  async decodeKey(k) {
    const res = await fetch(
      "https://es-scalability-test.ue.r.appspot.com/dec/" + k,
      {
        method: "get",
      }
    ).then((el) => el.text());
    try {
      return JSON.parse(await res);
    } catch (e) {
      return null;
    }
  },
};
