import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { signUp } from "../../services/auth-service";
import { CreateCC } from "../../services/credit-card.service";
import { useNavigate } from "react-router-dom";
import { AlertInfo } from "../utils/Alerts";
import { fileUpload } from "../helpers/fileUpload";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { changeTheme } from "../../redux/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { ValidateHook } from "../hooks/ValidationHook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { FormControl, InputLabel } from "@mui/material";

const Register = () => {
  const initialState = {
    Nombre: "",
    Apellido: "",
    Correo: "",
    Contrasenia: "",
    Foto: "",
    Direccion: "",
    Documento: "",
  };
  const initialStateCC = {
    CardHolder: "",
    Numero: "",
    Expira: "",
    Ccv: "",
    Tipo: "",
    Id_User: 0,
  };
  const [user, validate, handleInputChange, userValid, setUserValid] =
    ValidateHook(initialState);
  const [cc, setCC] = useState(initialStateCC);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showCC, setShowCC] = useState(true);
  const [selectedExpiry, setSelectedExpiry] = useState(null);
  const [buttonMessage, setButtonMessage] = useState(
    "Omitir tarjeta por ahora"
  );
  const [alertColor, setAlertColor] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const themeState = useSelector((store) => store.theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      signUp(user).then((response) => {
        switch (response.status) {
          case 201:
            navigate("/");
            localStorage.setItem("token", response.token);
            if (showCC) {
              CreateCC(cc, response.idUser).then(() => {});
            }
            break;
          case 400:
            setAlertColor("error");
            setAlertContent(response.message);
            setShowAlert(true);
            break;
        }

        //if (response.status == 200) {
        //    navigate("/");
        //    localStorage.setItem('token', response.token)
        //}

        //if (json.token) {
        //    navigate("/");
        //    setAlertColor("success");
        //}
        //setAlertColor("error");
        //setShowAlert(true);
        //setAlertContent(json.message);
      });
      setTimeout(() => setShowAlert(false), 4000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowCCForm = () => {
    setShowCC(!showCC);
    const msg = buttonMessage;
    if (msg == "Omitir tarjeta por ahora") {
      setButtonMessage("Agregar tarjeta");
    } else {
      setButtonMessage("Omitir tarjeta por ahora");
    }
  };

  const handleExpiry = (date) => {
    setSelectedExpiry(date);
    setCC({
      ...cc,
      Expira: selectedExpiry,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      user.Foto = reader.result;
      console.log(user);
    };
    reader.readAsDataURL(file);

    // const file = e.target.files[0];
    // setUserValid(false);
    // fileUpload(file)
    //     .then((resp) => {
    //         user.Foto = resp;
    //         setUserValid(true);
    //     })
    //     .catch((error) => {
    //         console.warn(error);
    //     });
  };

  const PasswordValidator = () => {
    const HasCapital = () => {
      return validate.Contrasenia.hasCapital ? (
        <Box sx={{ display: "flex", gap: 2 }}>
          <CheckCircleIcon color="success" />
          <Typography component="subtitle" sx={{ color: "#66bb6a" }}>
            Una letra mayuscula
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 2 }}>
          <ErrorIcon color="error" />
          <Typography component="subtitle" sx={{ color: "#f44336" }}>
            Una letra mayuscula
          </Typography>
        </Box>
      );
    };
    const HasNumber = () => {
      return validate.Contrasenia.hasNumber ? (
        <Box sx={{ display: "flex", gap: 2 }}>
          <CheckCircleIcon color="success" />
          <Typography component="subtitle" sx={{ color: "#66bb6a" }}>
            Un numero
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 2 }}>
          <ErrorIcon color="error" />
          <Typography component="subtitle" sx={{ color: "#f44336" }}>
            Un numero
          </Typography>
        </Box>
      );
    };
    const IsMin8 = () => {
      return validate.Contrasenia.isMin8 ? (
        <Box sx={{ display: "flex", gap: 2 }}>
          <CheckCircleIcon color="success" />
          <Typography component="subtitle" sx={{ color: "#66bb6a" }}>
            Minimo 8 caracteres
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 2 }}>
          <ErrorIcon color="error" />
          <Typography component="subtitle" sx={{ color: "#f44336" }}>
            Minimo 8 caracteres
          </Typography>
        </Box>
      );
    };
    return passwordTouched ? (
      <Box sx={{ mt: 3, display: "flex", flexDirection: "column" }}>
        <HasCapital />
        <HasNumber />
        <IsMin8 />
      </Box>
    ) : (
      ""
    );
  };

  const HandleCC = ({ target }) => {
    setCC({
      ...cc,
      [target.name]: target.value,
    });
  };

  return (
    <>
      <AlertInfo
        show={showAlert}
        severity={alertColor}
        content={alertContent}
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
      <Container component="main" sx={{ width: "720px", minWidth: "380px" }}>
        <CssBaseline />
        <Paper
          sx={{
            marginTop: 5,
            p: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Typography component="h1" variant="h4" align="center">
              Registrarse
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  autoComplete="given-name"
                  name="Nombre"
                  error={
                    validate.Nombre.isValid === null
                      ? false
                      : !validate.Nombre.isValid
                      ? true
                      : false
                  }
                  helperText={
                    !validate.Nombre.isValid ? validate.Nombre.message : ""
                  }
                  required
                  fullWidth
                  value={user.Nombre}
                  onChange={handleInputChange}
                  id="Nombre"
                  label="Nombre"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  value={user.Apellido}
                  onChange={handleInputChange}
                  error={
                    validate.Apellido.isValid === null
                      ? false
                      : !validate.Apellido.isValid
                      ? true
                      : false
                  }
                  helperText={
                    !validate.Apellido.isValid ? validate.Apellido.message : ""
                  }
                  id="Apellido"
                  label="Apellido"
                  name="Apellido"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  name="Correo"
                  fullWidth
                  value={user.Correo}
                  onChange={handleInputChange}
                  error={
                    validate.Correo.isValid === null
                      ? false
                      : !validate.Correo.isValid
                      ? true
                      : false
                  }
                  helperText={
                    !validate.Correo.isValid ? validate.Correo.message : ""
                  }
                  id="Correo"
                  label="Correo"
                  autoComplete="Correo"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  name="Contrasenia"
                  value={user.Contrasenia}
                  onChange={(e) => {
                    handleInputChange(e);
                    setPasswordTouched(true);
                  }}
                  error={
                    validate.Contrasenia.isValid === null
                      ? false
                      : !validate.Contrasenia.isValid
                      ? true
                      : false
                  }
                  label="Contrasenia"
                  type="password"
                  id="Contrasenia"
                  autoComplete="new-password"
                />
                <PasswordValidator />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  name="Direccion"
                  value={user.Direccion}
                  label="Direccion"
                  type="text"
                  id="Direccion"
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  name="Documento"
                  value={user.Documento}
                  label="Documento"
                  type="text"
                  id="Documento"
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="cover-input">Documento</InputLabel>
                  <TextField
                    id="cover-input"
                    name="cover"
                    type="file"
                    onChange={handleFileChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Button
                color="primary"
                type="button"
                variant="contained"
                onClick={handleShowCCForm}
                //sx={{ width: "35%" }}
              >
                {buttonMessage}
              </Button>
            </Box>
            {showCC ? (
              <>
                <Typography component="h1" variant="h4" align="center">
                  Datos Tarjeta
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="CardHolder"
                      required
                      fullWidth
                      value={cc.Nombre}
                      onChange={HandleCC}
                      id="Nombre"
                      label="Nombre"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      value={cc.Numero}
                      onChange={HandleCC}
                      id="Numero"
                      label="Numero"
                      name="Numero"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        value={selectedExpiry}
                        onChange={handleExpiry}
                        label="Fecha de Expiracion"
                        views={["year", "month"]}
                        disablePast={true}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      name="Ccv"
                      value={cc.Ccv}
                      onChange={HandleCC}
                      label="CCV"
                      type="number"
                      id="Ccv"
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      required
                      fullWidth
                      name="Tipo"
                      value={cc.Tipo}
                      label="Tipo"
                      type="text"
                      id="Tipo"
                      onChange={HandleCC}
                    />
                  </Grid>
                </Grid>
              </>
            ) : (
              ""
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={!userValid}
                sx={{ width: "35%" }}
              >
                Registrarse
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Register;
