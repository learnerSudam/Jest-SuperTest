const baseURL = "https://api.trello.com";
  const key = "162bdc536c6fb633ff890a33022f5b25";
  const token =
    "5ec8a6db5264e88b7af970a79ce474e93cd7bfedcaae2149c460187fcd590665";
    function randomBoardName(length) {
      let result = "";
      let characters = "0123456789";
      let charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return "MyBoard " + result;
    }
    let toDo = "TODO";
    let done = "DONE";
    let cardName = "API Automation";
    export { baseURL, key, token, randomBoardName,toDo, done, cardName};