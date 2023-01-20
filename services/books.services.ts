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

  async getBooksRef() {
    const response = await sendRequest("/api/archives", "GET", true);

    if (!response.ok) {
      const fail = await response.json();
      throw { error: fail.error };
    }

    const data = await response.json();

    return data;
  }

  async getBook(bookId: string) {
    try {
      const response = await sendRequest(
        `/api/archives/book?id=${bookId}`,
        "GET",
        true
      );

      if (response.ok) {
        const book = await response.arrayBuffer();
        return book;
      } else {
        throw { error: `Error downloading the book ${response.statusText}` };
      }
    } catch (error) {
      throw { error: error };
    }
  }

  async deleteBook(bookId: string) {
    try {
      const response = await sendRequest(
        `/api/archives/book?id=${bookId}`,
        "DELETE",
        true
      );

      if (!response.ok) {
        const fail = await response.json();
        throw { error: fail.error };
      }

      const data = await response.json();

      return data.message;
    } catch (error) {
      throw { error: error };
    }
  }
}

export default new BooksServices();
