import request from "supertest";
import {
  baseURL,
  key,
  token,
  randomBoardName,
  toDo,
  done,
  cardName,
} from "./testData";

describe("Test trello APIs", () => {
  beforeEach(async() => {
    const response = await request(baseURL).get(
      `/1/members/me/boards?key=${key}&token=${token}`
    );
    expect(response.statusCode).toBe(200);
    const boards=response.body
    for(let i=0; i<boards.length; i++){

      const response = await request(baseURL).delete(
        `/1/boards/${boards[i].id}?key=${key}&token=${token}`
      );
      expect(response.statusCode).toBe(200);
      expect(response.body._value).toBe(null);
      console.log("All boards deleted")
    }
    
  });

  it("Create a board", async () => {
    let boardId;
    const boardName = randomBoardName(2);
    const response = await request(baseURL).post(
      `/1/boards/?name=${boardName}&key=${key}&token=${token}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(boardName);
    expect(response.body.closed).toBe(false);
    expect(response.body.prefs.permissionLevel).toBe("private");
    boardId = response.body.id;
  });
  it("Create a TODO list inside board", async () => {
    let boardId;
    let toDoListId;
    const boardName = randomBoardName(2);
    const response = await request(baseURL).post(
      `/1/boards/?name=${boardName}&key=${key}&token=${token}`
    );
    boardId = response.body.id;

    const response2 = await request(baseURL).post(
      `/1/lists?name=${toDo}&idBoard=${boardId}&key=${key}&token=${token}`
    );
    expect(response2.statusCode).toBe(200);
    expect(response2.body.name).toBe(toDo);
    expect(response2.body.closed).toBe(false);
    expect(response2.body.idBoard).toBe(boardId);
    toDoListId = response2.body.id;
  });

  it("Create a DONE list inside board", async () => {
    let boardId;
    let toDoListId;
    let doneListId;
    const boardName = randomBoardName(2);

    const response = await request(baseURL).post(
      `/1/boards/?name=${boardName}&key=${key}&token=${token}`
    );
    boardId = response.body.id;

    const response2 = await request(baseURL).post(
      `/1/lists?name=${toDo}&idBoard=${boardId}&key=${key}&token=${token}`
    );
    toDoListId = response2.body.id;

    const response3 = await request(baseURL).post(
      `/1/lists?name=${done}&idBoard=${boardId}&key=${key}&token=${token}`
    );
    expect(response3.statusCode).toBe(200);
    expect(response3.body.name).toBe(done);
    expect(response3.body.closed).toBe(false);
    expect(response3.body.idBoard).toBe(boardId);
    doneListId = response3.body.id;
  });

  it("Create a Card inside TODO list", async () => {
    let boardId;
    let toDoListId;
    let doneListId;
    let cardId;
    const boardName = randomBoardName(2);
    const response = await request(baseURL).post(
      `/1/boards/?name=${boardName}&key=${key}&token=${token}`
    );
    boardId = response.body.id;

    const response2 = await request(baseURL).post(
      `/1/lists?name=${toDo}&idBoard=${boardId}&key=${key}&token=${token}`
    );
    toDoListId = response2.body.id;

    const response3 = await request(baseURL).post(
      `/1/lists?name=${done}&idBoard=${boardId}&key=${key}&token=${token}`
    );
    doneListId = response3.body.id;

    const response4 = await request(baseURL).post(
      `/1/cards?name=${cardName}&idList=${toDoListId}&key=${key}&token=${token}`
    );
    expect(response4.statusCode).toBe(200);
    expect(response4.body.name).toBe(cardName);
    expect(response4.body.closed).toBe(false);
    expect(response4.body.idList).toBe(toDoListId);
    expect(response4.body.idBoard).toBe(boardId);
    expect(response4.body.badges.votes).toBe(0);
    expect(response4.body.badges.attachmentsByType.trello.card).toBe(0);
    cardId = response4.body.id;
  });

  it("Move the card from TODO to DONE list", async () => {
    let boardId;
    let toDoListId;
    let doneListId;
    let cardId;
    const boardName = randomBoardName(2);
    const response = await request(baseURL).post(
      `/1/boards/?name=${boardName}&key=${key}&token=${token}`
    );
    boardId = response.body.id;

    const response2 = await request(baseURL).post(
      `/1/lists?name=${toDo}&idBoard=${boardId}&key=${key}&token=${token}`
    );
    toDoListId = response2.body.id;

    const response3 = await request(baseURL).post(
      `/1/lists?name=${done}&idBoard=${boardId}&key=${key}&token=${token}`
    );
    doneListId = response3.body.id;

    const response4 = await request(baseURL).post(
      `/1/cards?name=${cardName}&idList=${toDoListId}&key=${key}&token=${token}`
    );
    cardId = response4.body.id;

    const response5 = await request(baseURL).put(
      `/1/cards/${cardId}?key=${key}&token=${token}&idList=${doneListId}`
    );
    expect(response5.statusCode).toBe(200);
    expect(response5.body.name).toBe(cardName);
    expect(response5.body.closed).toBe(false);
    expect(response5.body.idList).toBe(doneListId);
    expect(response5.body.idBoard).toBe(boardId);
  });

  it("Retrieve the deleted board", async () => {
    let boardId;
    let toDoListId;
    let doneListId;
    let cardId;
    const boardName = randomBoardName(2);
    const response = await request(baseURL).post(
      `/1/boards/?name=${boardName}&key=${key}&token=${token}`
    );
    boardId = response.body.id;

    const response2 = await request(baseURL).post(
      `/1/lists?name=${toDo}&idBoard=${boardId}&key=${key}&token=${token}`
    );
    toDoListId = response2.body.id;

    const response3 = await request(baseURL).post(
      `/1/lists?name=${done}&idBoard=${boardId}&key=${key}&token=${token}`
    );
    doneListId = response3.body.id;

    const response4 = await request(baseURL).post(
      `/1/cards?name=${cardName}&idList=${toDoListId}&key=${key}&token=${token}`
    );
    cardId = response4.body.id;

    const response5 = await request(baseURL).put(
      `/1/cards/${cardId}?key=${key}&token=${token}&idList=${doneListId}`
    );

    const response6 = await request(baseURL).put(
      `/1/cards/${cardId}?key=${key}&token=${token}&idList=${doneListId}`
    );

    const response7 = await request(baseURL).delete(
      `/1/boards/${boardId}?key=${key}&token=${token}`
    );

    const response8 = await request(baseURL).get(
      `/1/boards/${boardId}?key=${key}&token=${token}`
    );
    expect(response8.statusCode).toBe(404);
  });
});
