import React from "react";
import { FormControl, Input, Button, Box } from "@mui/material";
import { actionTypes } from "./Reducer";
import { useStateValue } from "./StateProvider";
import "./Login.css";
const Login = () => {
  const [, dispatch] = useStateValue();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const cidKey = 'cid';

    let cid = sessionStorage.getItem(cidKey);
    if (!cid) {
      const arr = crypto.getRandomValues(new Uint8Array(16));
      cid = Array.from(arr).map(b=>b.toString(16).padStart(2,'0')).join('');
      sessionStorage.setItem(cidKey, cid)
    }

    dispatch({
      type: actionTypes.SET_USER,
      user: data.get("user"),
    });

    dispatch({
      type: actionTypes.SET_CID,
      cid: cid,
    });

    console.log("Nome digitado2: ", data.get("user"));
  };
  return (
    <div className="login">
      <div className="login__container">
        <img src="logo512.png" alt="whatsapp" />
        <div className="login__text">
          <h1>Login no chat.</h1>
        </div>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            mt: 1,
          }}
        >
          <FormControl>
            <Input
              name="user"
              placeholder="Digite seu usuario"
              autoFocus="true"
              type="text"
            />
          </FormControl>
          <Button type="submit" variant="contained">
            Entrar
          </Button>
        </Box>
      </div>
    </div>
  );
};
export default Login;
