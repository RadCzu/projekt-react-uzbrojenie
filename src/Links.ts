const Links = {
  baseURL: "http://localhost/NewCode/",
  postURL: "http://localhost:3001/apiPOST",
  getURL: "http://localhost:3001/apiGET",
};

const articleId = {
  id: 1,
}

export function getId(): number {
  return articleId.id;
}

export function setId(number: number): void {
  articleId.id = number;
}

export default Links;