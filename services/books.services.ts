import sendRequest from "./api.services";

class BooksServices {
  async uploadBook(book: FormData) {
    const response = await sendRequest(
      "/api/archives/upload",
      "POST",
      true,
      book,
      true
    );

    if (!response.ok) {
      const fail = await response.json();
      throw { error: fail.error };
    }

    const data = await response.json();

    return data.message;
  }
}

export default new BooksServices();
