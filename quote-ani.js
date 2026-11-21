const quote = document.querySelector(".about-quote-text");
  const author = document.querySelector(".about-quote-author");
  console.log("Quote found:", quote);
  console.log("Author found:", author);
  if (quote && author) {
    setTimeout(() => {
      quote.classList.add("show");
    }, 500);
    setTimeout(() => {
      author.classList.add("show");
    }, 2700);
  }
