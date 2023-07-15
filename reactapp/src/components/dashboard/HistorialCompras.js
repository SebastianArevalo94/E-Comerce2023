import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  TablePagination,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GetFacturasByUser } from "../../services/facturas-service";
import Factura from "../utils/Factura";

const HistorialCompras = () => {
  const [facturas, setFacturas] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [showFactura, setSF] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(13);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 13));
    setPage(0);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const displayedData = facturas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    //setSF(false);
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
    const userId = localStorage.getItem("id_user");
    GetFacturasByUser(userId).then((resp) => {
      setFacturas(resp.result);
    });
  }, []);

  return (
    <Box sx={{ m: 13 }}>
      <Typography variant="h3" textAlign="center">
        Historial de Compras
      </Typography>
      <Box sx={{ mt: 3 }}>
        {displayedData.length > 0 ? (
          displayedData.map((factura) => {
            return (
              <Accordion
                key={factura.id_Factura}
                expanded={expanded === factura.id_Factura}
                onChange={handleChange(factura.id_Factura)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography
                    sx={{ width: "33%", flexShrink: 0, fontSize: 19 }}
                  >
                    {"Compra Realizada"}
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {ReadDateTime(new Date(factura.fechaCompra))}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ fontSize: 23 }}>
                    {"Realizaste una compra en: "}
                    {ReadDateTime(new Date(factura.fechaCompra))}
                    <Factura factura={factura} />
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <Typography sx={{ fontSize: 35, textAlign:"center", mt:9 }}>
            No tienes facturas registradas
          </Typography>
        )}
          <TablePagination
            rowsPerPageOptions={[13, 25, 50]}
            component="div"
            count={facturas.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
      </Box>
    </Box>
  );
};

export default HistorialCompras;
