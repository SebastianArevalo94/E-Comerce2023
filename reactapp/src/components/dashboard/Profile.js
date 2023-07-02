import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Typography,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Container,
} from "@mui/material";
import { AlertInfo, UserDialog } from "../utils/Alerts";
import Paper from "@mui/material/Paper";
import { EditUser } from "../../services/users-service";
import { GetUserById } from "../../services/auth-service";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Link, useNavigate } from "react-router-dom";
import HistoryIcon from "@mui/icons-material/History";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const Profile = () => {
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(true);
  const [openAlert, setAlert] = useState(false);
  const handleEdit = () => {
    setEdit(!edit);
  };
  const handleClose = () => {};

  const handleInputChange = ({ target }) => {
    setUser({
      ...user,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    EditUser(user, user.id)
      .then((json) => {
        if (json.status == 200) {
          setAlert(true);
          handleEdit();
        }
        setTimeout(() => setAlert(false), 3000);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = jwt_decode(token);

    GetUserById(payload.id).then((json) => {
      setUser(json.response);
    });
  }, []);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 16 }}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          // m:"auto",
          // mt:3,
          // width: "fit-content",
          p: 3,
          gap: 4,
          position: "relative",
        }}
        elevation={3}
      >
        <AlertInfo
          severity="success"
          show={openAlert}
          content={"Usuario Editado"}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{ width: 300, height: 300 }}
            alt={`${user.nombre} Photo.`}
            src={user.foto}
          />
          <Box>
            <Typography variant="h2">
              {`${user.nombre} ${user.apellido}`}
            </Typography>
          </Box>
        </Box>
        <EditIcon
          color="primary"
          sx={{ position: "absolute", top: "5%", left: "85%", fontSize: 50 }}
          onClick={handleEdit}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              name="nombre"
              InputProps={{
                readOnly: edit,
              }}
              required
              fullWidth
              value={user.nombre}
              id="nombre"
              label="Nombre"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              InputProps={{
                readOnly: edit,
              }}
              required
              fullWidth
              id="apellido"
              label="Apellido"
              name="apellido"
              value={user.apellido}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              InputProps={{
                readOnly: edit,
              }}
              required
              name="correo"
              fullWidth
              id="correo"
              label="Correo"
              autoComplete="Correo"
              value={user.correo}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              InputProps={{
                readOnly: edit,
              }}
              required
              fullWidth
              name="direccion"
              label="Direccion"
              type="text"
              id="direccion"
              value={user.direccion}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              InputProps={{
                readOnly: edit,
              }}
              required
              fullWidth
              name="documento"
              label="Documento"
              type="text"
              id="Documento"
              value={user.documento}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="cover" type="file" fullWidth />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "evenly" }}>
          <Paper
            sx={{
              m: "auto",
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CreditCardIcon sx={{ fontSize: 170 }} />
            <Link to="/profile/adminCC" className="linkFix">
              <Button variant="contained" color="primary">
                Administrar CC
              </Button>
            </Link>
          </Paper>
          <Paper
            sx={{
              m: "auto",
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <HistoryIcon sx={{ fontSize: 170 }} />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Link to="/log-activity" className="linkFix">
                <Button variant="contained" color="primary">
                  Ver Actividad
                </Button>
              </Link>
            </Box>
          </Paper>
          <Paper
            sx={{
              m: "auto",
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: 170 }} />
            <Box sx={{}}>
              <Link to="/historial-compras" className="linkFix">
                <Button variant="contained" color="primary">
                  Historial de Compras
                </Button>
              </Link>
            </Box>
          </Paper>
        </Box>
        <Button
          variant="contained"
          color="success"
          disabled={edit}
          onClick={handleSubmit}
        >
          Editar
        </Button>
        {/*<UserDialog*/}
        {/*  open={openDialog}*/}
        {/*  handleClose={handleClose}*/}
        {/*  user={user}*/}
        {/*  handleChange={handleInputChange}*/}
        {/*  handleSubmit={handleSubmit}*/}
        {/*/>*/}
      </Paper>
    </Box>
  );
};

export default Profile;
