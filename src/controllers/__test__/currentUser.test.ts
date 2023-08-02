import request from "supertest";
import { app } from "../../app";
import { getSignUpCookie } from "../../test/getSignUpCookie";

it("returns current user", async () => {
  const response = await request(app)
    .get("/api/v1/users/current-user")
    .set("Cookie", await getSignUpCookie())
    .send()
    .expect(200);

  expect(response.body.user.email).toStrictEqual("test@example.com");
});

it("returns 401 when not authenticated", async () => {
  const response = await request(app)
    .get("/api/v1/users/current-user")
    .send()
    .expect(401);

  expect(response.body.user).toBeUndefined();
});
