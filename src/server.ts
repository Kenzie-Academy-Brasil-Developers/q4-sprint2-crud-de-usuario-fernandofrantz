import { createConnection } from "typeorm";
import "reflect-metadata";
import app from "./app";

export const config = {
  secret: "the_greatest_secret_key",
  expiresIn: "1h",
};

createConnection()
  .then(() => {
    app.listen(3000, () => {
      console.log("Running at http://localhost:3000");
    });
  })
  .catch((err: any) => console.log(err));
