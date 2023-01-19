const terms = () => {
  return (
    <div className="p-2 m-2">
      <div className="contracts d-flex justify-content-between align-middle">
        <div>
          <h1>Terms and Privacy Policy</h1>
        </div>
        <div>
          <a href="/users/signup">
            <button type="button" className="btn btn-light">
              Sign Up
            </button>
          </a>
        </div>
      </div>

      <div className="m-4">
        <h2>App informations and datas</h2>
        <div>
          This application is designed to be used by everyone for free,{" "}
          <b>IT IS NOT A PRODUCT</b> and should be considered as a tool created
          for personnal use. This app is a side project create by{" "}
          <a>Valentin Marguerie</a>, you can reach out to me by my website:{" "}
          <a href="https://valentinmarguerie.fr">valentinmarguerie.fr</a>
        </div>

        <div>
          This app only store hashed passwords in its database linked to a
          username, this username isn't considered as personnal data. All of
          your books are stored in a S3 databases and not directly linked to you
          in this database.
        </div>
      </div>

      <div className="m-4">
        <h2>Hosting</h2>
        <div>
          This app is hosted on Vercel,{" "}
          <a href="https://vercel.com">vercel.com</a>. And use Atlas MongoDB
          cluster and Filebase S3 for storage purposes
        </div>
      </div>

      <div className="m-4">
        <h2>Cookies</h2>
        <div>
          This app doesn't use any form of cookies, but take notes that Vercel
          is collecting anonymous analytics to create user's statistics like
          content loading time. Those statistics are metrics meant to help the
          development of the application.
        </div>
      </div>
    </div>
  );
};

export default terms;
