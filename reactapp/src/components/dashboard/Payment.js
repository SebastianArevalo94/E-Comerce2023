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
import { GetCCByUser } from "../../services/credit-card.service";
import { GetUserById } from "../../services/auth-service";
import { GenerarFactura } from "../../services/facturas-service";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import PaymentsIcon from "@mui/icons-material/Payments";
import { AlertSnack, DialogConfirm } from "../utils/Alerts";
import { deleteAll } from "../../redux/shopCartSlice";
import Swal from "sweetalert2";

const Payment = () => {
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.shopCart.shopCart);
  const [addOrSelect, setAoS] = useState("select");
  const [creditCards, setCreditCards] = useState([]);
  const [datosAdicionales, setDA] = useState("");
  const [ccSelected, setCC] = useState(0);
  const [paymentMethod, setPM] = useState("0");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [alertDiaglog, setAlertDiaglog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCloseConfirm = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenConfirm(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const handleValidate = () => {
    if (paymentMethod == "0") {
      setOpenError(true);
      return false;
    }

    setOpenConfirm(true);
  };

  const ComprarProductos = () => {
    let productos_comprados = [];
    products.forEach((product) => {
      const producto = {
        Id_pc: 0,
        Id_Compra: "",
        Id_Producto: product.id,
        Id_Usuario: user.user.id,
        Unidades: product.unidades,
        Facturado: 0,
      };
      productos_comprados.push(producto);
    });
    const newFactura = {
      products: productos_comprados,
      usuario: user.user.id,
      metodoPago: paymentMethod,
      direccion_envio: `${user.user.direccion} ${datosAdicionales}`,
    };
    GenerarFactura(newFactura).then((resp) => {
      if (resp.status == 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: resp.message,
          showConfirmButton: true,
          closeOnConfirm: true,
        });
      }
      handleCloseConfirm();
      dispatch(deleteAll());
      navigate("/");
    });
  };

  const handleCC = ({ target }) => {
    //setCC(id);
    console.log(target.value);
  };

  const handlePM = ({ target }) => {
    setPM(target.value);
    console.log(target.value);
  };

  const handleDatosAdicionales = ({ target }) => {
    setDA(target.value);
    console.log(target.value);
  };

  useEffect(() => {
    const id_user = localStorage.getItem("id_user");
    GetCCByUser(id_user).then((resp) => {
      if (resp.results.length == 0) {
        setAoS("add");
      } else {
        setCreditCards(resp.results);
      }
    });
  }, []);

  const CreditCard = ({ cc }) => {
    return (
      <Card sx={{ m: 0, p: 0, width: 250 }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CreditCardIcon sx={{ fontSize: 170 }} />
          <Typography variant="h6" component="h2">
            {cc.numero}
          </Typography>
          <Typography color="textSecondary">{cc.ccv}</Typography>
          <Typography color="textSecondary">{cc.tipo}</Typography>
        </CardContent>
      </Card>
    );
  };

  const PMInfo = () => {
    return addOrSelect == "select" ? (
      <>
        <Typography variant="h3" textAlign="center">
          Seleccionar Medio de Pago
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              row
              value={paymentMethod}
              onChange={handlePM}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Tarjeta de Credito"
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="Efectivo"
              />
            </RadioGroup>
          </FormControl>
          {paymentMethod == "1" ? (
            <Box>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={creditCards.length == 0 ? 0 : creditCards[0].id}
                  name="radio-buttons-group"
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: " wrap",
                      gap: 2,
                    }}
                  >
                    {creditCards.map((cc) => (
                      <FormControlLabel
                        key={cc.id}
                        value={cc.id}
                        onChange={handleCC}
                        control={<Radio />}
                        label={<CreditCard cc={cc} />}
                      />
                    ))}
                  </Box>
                </RadioGroup>
              </FormControl>
            </Box>
          ) : (
            ""
          )}
        </Box>
      </>
    ) : (
      <>
        <Typography variant="h3" textAlign="center">
          Seleccionar Medio de Pago
        </Typography>

        <Typography variant="h4" textAlign="center">
          No tienes metodos de pago registrados
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Link to="/profile/adminCC" className="linkFix">
            <Button variant="contained" color="success">
              Agregar Nuevo
            </Button>
          </Link>
        </Box>
      </>
    );
  };

  return (
    <Box>
      <DialogConfirm
        open={openConfirm}
        handleClose={handleCloseConfirm}
        action={ComprarProductos}
        title="Deseas continuar con la compra y realizar el pago?"
      />
      <DialogConfirm
        open={openError}
        handleClose={handleCloseError}
        showCancel={false}
        action={handleCloseError}
        title="Debes seleccionar un medio de pago"
      />
      <AlertInfo show={true} severity={"success"} content={"example"} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Paper
          sx={{
            mx: "auto",
            //m: 10,
            mt: 17,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "75%",
            p: 3,
          }}
          elevation={3}
        >
          <Typography variant="h3" textAlign="center">
            Confirmar Datos de Envio
          </Typography>
          <TextField
            required
            //fullWidth
            name="direccion"
            //label="Direccion"
            type="text"
            id="direccion"
            value={user.user.direccion}
          />
          <TextField
            id="filled-multiline-static"
            label="Datos adicionales"
            multiline
            rows={2}
            fullWidth
            type="text"
            name="descripcion"
            variant="filled"
            value={datosAdicionales}
            onChange={handleDatosAdicionales}
          />
          {/*<Box sx={{ display: "flex", justifyContent: "center" }}>*/}
          {/*    <Button variant="contained" color="success">*/}
          {/*        Editar*/}
          {/*    </Button>*/}
          {/*</Box>*/}
        </Paper>
        <Paper
          sx={{
            mx: "auto",
            mt: 10,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: 3,
            width: "50%",
            p: 3,
          }}
          elevation={3}
        >
          <PMInfo />
        </Paper>
        <Box sx={{ display: "flex", justifyContent: "center", m: 10 }}>
          <Button variant="contained" color="success" onClick={handleValidate}>
            Confirmar Compra
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Payment;
