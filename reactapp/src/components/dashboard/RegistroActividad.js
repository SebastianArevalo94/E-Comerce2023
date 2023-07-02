import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import {
  GetFacturaByLog,
  GetInfoUserAuthByLog,
  GetLogByUser,
} from "../../services/log.service";
import { useSelector } from "react-redux";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import MapComponent from "../utils/Map";
import Factura from "../utils/Factura";

const LogActivity = () => {
  const user = useSelector((state) => state.user.user);
  const [expanded, setExpanded] = useState(false);
  const [dataLog, setDataLog] = useState([]);
  const [showFactura, setSF] = useState(false);
  const [factura, setFactura] = useState({});
  const [infoLogin, setInfoLogin] = useState({});

  const handleShowFactura = () => {
    setSF(!showFactura);
  };

  const handleChange = (panel, panel2) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setSF(false);
    if (panel2 == 1 || panel2 == 2 || panel2 == 3 || panel2 == 6) {
      GetInfoUserAuthByLog(panel).then((log) => {
        if (log.results !== null) {
          setInfoLogin(log.results);
        }
      });
    }
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

  useEffect(() => {
    if (!user.id) {
      const user = localStorage.getItem("id_user");
      GetLogByUser(user)
        .then((resp) => {
          setDataLog(resp.results);
        })
        .catch((error) => {
          console.log(error);
        });
    } else{
      GetLogByUser(user.id)
        .then((resp) => {
          setDataLog(resp.results);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <Box
      sx={{
        mt: 12,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Typography variant="h3" textAlign="center">
        Registro de Actividad
      </Typography>
      <Box sx={{ m: 4 }}>
        {dataLog.map((log) => {
          return (
            <Accordion
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
                  {ReadDateTime(log.fecha)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontSize: 23 }}>
                  {/* {log.label} {" el dia "}
                  {log.fecha.toLocaleDateString()} {" a las "}
                  {log.fecha.toLocaleTimeString()} */}
                  {log.label} {ReadDateTime(log.fecha)}
                </Typography>
                {log.tipoAccion == 6 ? (
                  <Box>
                    <Button
                      sx={{ mt: 2 }}
                      color="primary"
                      variant="contained"
                      onClick={() => _GetFacturaByLog(log.id)}
                    >
                      Ver Factura
                    </Button>
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
                      <Box sx={{ mt: 7 }}>
                        <Typography sx={{ fontSize: 32 }}>
                          {log.tipoAccion === 1
                            ? "Informacion de inicio de sesion"
                            : log.tipoAccion === 2
                            ? "Informacion de sesion cerrada"
                            : log.tipoAccion === 3
                            ? "Informacion de registro"
                            : null}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography sx={{ fontSize: 25 }}>
                            Ip: {infoLogin.ip}
                          </Typography>
                          <Typography sx={{ fontSize: 25 }}>
                            Pais: {infoLogin.pais}
                          </Typography>
                          <Typography sx={{ fontSize: 25 }}>
                            Ciudad: {infoLogin.ciudad}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 25, mb: 2 }}>
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
      </Box>
    </Box>
  );
};

export default LogActivity;
