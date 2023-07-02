import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { signIn } from "../../services/auth-service";
import { useNavigate, Link } from "react-router-dom";
import { AlertInfo } from "../utils/Alerts";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { changeTheme } from "../../redux/themeSlice";
import { setUserRedux } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import jwt_decode from "jwt-decode";

const Login = () => {
  const initialState = {
    Correo: "",
    Contrasenia: "",
  };
  const themeState = useSelector((store) => store.theme);
  const [user, setUser] = useState(initialState);
  const [showAlert, setShowAlert] = useState(false);
  const [hideDuration, setHideDuration] = useState(false);
  const [alertColor, setAlertColor] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.Correo);

    if (!isValidEmail) {
      setAlertColor("error");
      setShowAlert(true);
      setAlertContent("Introduce un correo valido");
      setTimeout(() => setShowAlert(false), 4000);
      return false;
    }
 
    signIn(user)
      .then((response) => {
        if (response.status == 403) {
          setAlertColor("error");
          setShowAlert(true);
          setAlertContent("Contrasenia Incorrecta.");
        }

        if (response.status == 200) {
          navigate("/");
          const userOBJ = jwt_decode(response.token);
          localStorage.setItem("id_user", userOBJ.id);
          dispatch(setUserRedux(userOBJ));
        }

        // if (json.token) {
        //   navigate("/");
        //   // dispatch(saveUser(json.user))
        //   // setAlertColor('success');
        //   // setShowAlert(true);
        //   // setAlertContent(json.message);
        // // }
        // setAlertColor("success");
        // setShowAlert(true);
        // //setAlertContent("Introduce un correo valido");
        // setTimeout(() => setShowAlert(false), 4000);
        // navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });

    setTimeout(() => setShowAlert(false), 4000);
  };

  const handleInputChange = ({ target }) => {
    setUser({
      ...user,
      [target.name]: target.value,
    });
  };

  return (
    <>
      <AlertInfo
        show={showAlert}
        severity={alertColor}
        content={alertContent}
        autoHideDuration={hideDuration}
      />
      <Box
        sx={{ display: "flex", justifyContent: "center", mt: 3 }}
        onClick={() => dispatch(changeTheme())}
      >
        {themeState.isDark ? (
          <WbSunnyIcon sx={{ fontSize: 60 }} />
        ) : (
          <DarkModeIcon sx={{ fontSize: 60 }} />
        )}
      </Box>
      <Container component="main" sx={{ width: "420px", minWidth: "380px" }}>
        <Paper
          sx={{
            marginTop: 4,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4">
            Iniciar Sesion
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid
              sx={{ display: "flex", justifyContent: "center" }}
              container
              spacing={3}
            >
              <Grid item xs={10}>
                <TextField
                  required
                  name="Correo"
                  fullWidth
                  value={user.Correo}
                  onChange={handleInputChange}
                  id="Correo"
                  label="Correo"
                  autoComplete="Correo"
                />
              </Grid>
              <Grid item xs={10}>
                <TextField
                  required
                  fullWidth
                  name="Contrasenia"
                  value={user.Contrasenia}
                  onChange={handleInputChange}
                  label="Contraseña"
                  type="Contrasenia"
                  id="Contrasenia"
                  autoComplete="new-Contrasenia"
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", mt: 2, flexDirection: "column" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ width: "50%", m: "auto" }}
              >
                Iniciar Sesion
              </Button>
              <Link
                to="/register"
                className={themeState.isDark ? "aLinkDark" : "aLinkLight"}
              >
                <Box sx={{ display: "flex", position: "relative" }}>
                  <Typography
                    sx={{
                      fontSize: 20,
                      textAlign: "center",
                      mt: 2,
                      fontWeight: 400,
                    }}
                  >
                    No tienes cuenta? Registrate
                  </Typography>
                  <ArrowRightAltIcon
                    sx={{ fontSize: 65, position: "absolute", left: "83%" }}
                  />
                </Box>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
