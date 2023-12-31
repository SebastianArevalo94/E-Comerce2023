import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { GetAllUsers, GetOneUser } from "../../services/users-service";
import { GetTipoAcciones } from "../../services/acciones-service";
import {
  GetAdminLog,
  GetFacturaByLog,
  GetInfoUserAuthByLog,
} from "../../services/log.service";
import MapComponent from "../utils/Map";
import Factura from "../utils/Factura";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const UsersActivity = () => {
  const [expanded, setExpanded] = useState(false);
  const [users, setUsers] = useState([]);
  const [dataLog, setDataLog] = useState([]);
  const [userName, setUserName] = useState("");
  const [showFactura, setSF] = useState(false);
  const [tipoAcciones, setTipoAcciones] = useState([]);
  const [infoLogin, setInfoLogin] = useState({});
  const [userInfoLog, setUserInfoLog] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(13);
  const [factura, setFactura] = useState({});
  const [userLog, setUserLog] = useState({});

  const defaultUser = {
    id: 0,
    nombre: "Todos",
    apellido: "",
  };

  const defaultOrder = {
    command: "desc",
    label: "Descendente",
  };

  const defaultTipoAccion = {
    id: 0,
    nombre: "Todos",
  };

  const [userFilter, setUserFilter] = useState(defaultUser);

  const [orderFilter, setOrderFilter] = useState(defaultOrder.command);

  const [tipoAccionFilter, setTipoAccionFilter] = useState(
    defaultTipoAccion.id
  );

  const [filter, setFilter] = useState(0);

  const Orders = [
    {
      command: "asc",
      label: "Ascendente",
    },
    {
      command: "desc",
      label: "Descendente",
    },
  ];

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 13));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChange = (panel, panel2) => (event, isExpanded) => {
    console.log(panel, panel2);
    setExpanded(isExpanded ? panel : false);
    setSF(false);
    console.log(panel, panel2);
    if (panel2 == 1 || panel2 == 2 || panel2 == 3) {
      GetInfoUserAuthByLog(panel).then((log) => {
        if (log.results !== null) {
          setInfoLogin(log.results);
          if (log.results.usuario !== null) {
            GetOneUser(log.results.usuario)
              .then((resp) => {
                setUserInfoLog(resp.response);
                console.log(resp.response);
              })
              .catch();
          }
        }
      });
    }
  };

  const displayedData = dataLog.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // const displayedData = dataLog.slice(
  //   page * rowsPerPage,
  //   page * rowsPerPage + rowsPerPage
  // );

  const SearchData = (user = defaultUser, tipoAccion, order) => {
    const objFilter = {
      filter:
        user.id == 0 && tipoAccion == 0
          ? 1
          : user.id == 0 && tipoAccion != 0
          ? 2
          : user.id != 0 && tipoAccion == 0
          ? 3
          : user.id != 0 && tipoAccion != 0
          ? 4
          : 1,
      type: tipoAccion,
      user: user.id,
      order: order,
    };
    GetAdminLog(objFilter)
      .then((resp) => {
        setDataLog(resp.results);
      })
      .catch((error) => {});
    //console.log(objFilter);
    //console.log(user.id);
    // console.log(tipoAccion);
    //console.log(order);
  };

  const _GetFacturaByLog = (log) => {
    GetFacturaByLog(log)
      .then((resp) => {
        if (resp.result !== null) {
          setFactura(resp.result);
        }
        setSF(true);
      })
      .catch((err) => {
        "";
      });
  };

  const ReadDateTime = (datetime) => {
    const año = datetime.getFullYear();
    const mes = String(datetime.getMonth() + 1).padStart(2, "0"); // El mes está basado en cero, por lo que se suma 1
    const dia = String(datetime.getDate()).padStart(2, "0");
    const horas = String(datetime.getHours()).padStart(2, "0");
    const minutos = String(datetime.getMinutes()).padStart(2, "0");
    const segundos = String(datetime.getSeconds()).padStart(2, "0");

    return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    fontSize: 18,
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    GetAllUsers()
      .then((resp) => {
        setUsers(resp.response);
        //console.log(resp.response);
      })
      .catch((err) => {});
    GetTipoAcciones()
      .then((resp) => {
        setTipoAcciones(resp.response);
        //console.log(resp);
      })
      .catch((err) => {});
    SearchData(userFilter, tipoAccionFilter, orderFilter);
  }, []);

  return (
    <Box sx={{ mt: 10, textAlign: "center" }}>
      <h1>Actividad Usuarios</h1>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <FormControl sx={{ width: 320 }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={[defaultUser, ...users]}
              value={userFilter}
              inputValue={userName}
              onInputChange={(event, newInputValue) => {
                setUserName(newInputValue);
              }}
              onChange={(event, value) => {
                setUserFilter(value);
                SearchData(value, tipoAccionFilter, orderFilter);
              }}
              getOptionLabel={(user) => `${user.nombre} ${user.apellido}`}
              renderInput={(params) => (
                <TextField {...params} label="Usuario" />
              )}
            />
          </FormControl>
          <FormControl sx={{ width: 220 }}>
            <FormControl>
              <InputLabel id="tipo-accion-label">Tipo Accion</InputLabel>
              <Select
                labelId="tipo-accion-label"
                label="Tipo Accion"
                id="tipo-accion-select"
                value={tipoAccionFilter}
                onChange={(event) => {
                  // console.log(event.target.value);
                  setTipoAccionFilter(event.target.value);
                  SearchData(userFilter, event.target.value, orderFilter);
                }}
              >
                <MenuItem
                  key={defaultTipoAccion.id}
                  value={defaultTipoAccion.id}
                >
                  {defaultTipoAccion.nombre}
                </MenuItem>
                {tipoAcciones.map((accion) => (
                  <MenuItem key={accion.id} value={accion.id}>
                    {accion.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormControl>
          <FormControl sx={{ width: 220 }}>
            <Select
              labelId="order-label"
              label="Orden"
              id="order-select"
              value={orderFilter}
              //defaultValue={defaultOrder.command}
              onChange={(event) => {
                //console.log(event.target.value);
                setOrderFilter(event.target.value);
                SearchData(userFilter, tipoAccionFilter, event.target.value);
              }}
            >
              {Orders.map((order, index) => (
                <MenuItem
                  key={index}
                  value={order.command}
                  //selected={orderFilter === order.command}
                >
                  {order.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ m: 4 }}>
        {displayedData.map((log, index) => {
          return (
            <Accordion
              key={log.index}
              expanded={expanded === log.id}
              onChange={handleChange(log.id, log.tipoAccion)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "33%", flexShrink: 0, fontSize: 19 }}>
                  {log.descripcion}
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {ReadDateTime(new Date(log.fecha))}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {log.tipoAccion == 6 ? (
                  <Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 5 }}
                    >
                      <Button
                        sx={{ mt: 2 }}
                        color="primary"
                        variant="contained"
                        onClick={() => _GetFacturaByLog(log.id)}
                      >
                        Ver Factura
                      </Button>
                      <Button
                        sx={{ mt: 2 }}
                        color="secondary"
                        variant="contained"
                        onClick={() => setSF(false)}
                      >
                        Ocultar
                      </Button>
                    </Box>
                    {showFactura ? <Factura factura={factura} /> : <></>}
                  </Box>
                ) : (
                  ""
                )}
                {(log.tipoAccion == 1 ||
                  log.tipoAccion == 2 ||
                  log.tipoAccion == 3 ||
                  log.tipoAccion == 5) &&
                infoLogin != null ? (
                  <>
                    <Box
                      sx={{
                        m: 3,
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Box sx={{ mt: 0 }}>
                        <Typography sx={{ fontSize: 32 }}>
                          {log.tipoAccion === 1
                            ? "Informacion de inicio de sesion"
                            : log.tipoAccion === 2
                            ? "Informacion de sesion cerrada"
                            : log.tipoAccion === 3
                            ? "Informacion de registro"
                            : null}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Stack
                            sx={{ display: "flex", justifyContent: "center" }}
                            direction="row"
                            spacing={2}
                          >
                            <Item>IP: {infoLogin.ip}</Item>
                            <Item>Pais {infoLogin.pais}</Item>
                            <Item>Ciudad: {infoLogin.ciudad}</Item>
                            <Item>
                              Fecha: {ReadDateTime(new Date(log.fecha))}
                            </Item>
                          </Stack>
                          {/* <Typography sx={{ fontSize: 25 }}>
                            Ip: {infoLogin.ip}
                          </Typography>
                          <Typography sx={{ fontSize: 25 }}>
                            Pais: {infoLogin.pais}
                          </Typography>
                          <Typography sx={{ fontSize: 25 }}>
                            Ciudad: {infoLogin.ciudad}
                          </Typography> */}
                          <Typography sx={{ mt: 4, fontSize: 35 }}>
                            Informacion de Usuario:
                          </Typography>
                          <Card
                            sx={{
                              maxWidth: 750,
                              mt: 2,
                              gap: 2,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Box sx={{ mt: 3 }}>
                              <img
                                alt="green iguana"
                                //height="170"
                                width="250"
                                height="250"
                                src={userInfoLog.foto}
                              />
                            </Box>
                            <CardContent sx={{}}>
                              {/* <Typography
                                gutterBottom
                                variant="h4"
                                component="div"
                              >
                                Sebastian Arevalo
                              </Typography> */}
                              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                                <Stack direction="column" spacing={2}>
                                  <Item>Nombre Completo</Item>
                                  <Item>Correo:</Item>
                                  <Item>Direccion</Item>
                                  <Item>Documento</Item>
                                </Stack>
                                <Stack direction="column" spacing={2}>
                                  <Item>{`${userInfoLog.nombre} ${userInfoLog.apellido}`}</Item>
                                  <Item>{userInfoLog.correo}</Item>
                                  <Item>{userInfoLog.direccion}</Item>
                                  <Item>{userInfoLog.documento}</Item>
                                </Stack>
                              </Box>
                            </CardContent>
                            {/* <CardActions>
                              <Button size="small">Share</Button>
                              <Button size="small">Learn More</Button>
                            </CardActions> */}
                          </Card>
                        </Box>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 33, mb: 2 }}>
                          Ubicacion:
                        </Typography>
                        <MapComponent
                          center={{
                            lat: infoLogin.latitud,
                            lng: infoLogin.longitud,
                          }}
                        />
                      </Box>
                    </Box>
                  </>
                ) : (
                  ""
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
        <TablePagination
          rowsPerPageOptions={[13, 20, 50]}
          component="div"
          count={dataLog.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default UsersActivity;
