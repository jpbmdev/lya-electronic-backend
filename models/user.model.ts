import { Schema, model } from "mongoose";

//Creamos el esquema para las sessiones del usuario
interface session {
  jwt: string;
  active: boolean;
  date_created: Date;
}

//Creamos la interfaz del usuairo
interface User {
  email: string;
  password: string;
  active: boolean;
  sessions: session[];
}

//Creamos el esquema basados en la interfaz
const userSchema = new Schema<User>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  active: { type: Boolean, required: true },
  sessions: {
    type: [
      {
        jwt: { type: String, required: true },
        active: { type: Boolean, required: true },
        date_created: { type: Date, required: true },
      },
    ],
    required: true,
  },
});

export default model("User", userSchema);