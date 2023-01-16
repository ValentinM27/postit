const book = (props: any) => {
  const getDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };
  return (
    <div className="card-container">
      <h2>{props?.book?.title}</h2>
      <span>Book added the {getDate(props?.book?.uploadDate)}</span>
      <hr />
      <div className="form-group col-md-12 text-center">
        <button className="btn btn-dark btn-lg">Read</button>
      </div>
    </div>
  );
};

export default book;
