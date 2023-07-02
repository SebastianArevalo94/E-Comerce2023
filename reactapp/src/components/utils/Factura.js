import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const Factura = ({ factura }) => {
  const tableHeads = ["Imagen", "Nombre", "Precio", "Cantidad", "Subtotal"];
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          mt: 3,
          gap: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 17 }}>
              <Typography sx={{ fontSize: 65 }}>Factura</Typography>
              <Paper sx={{ display: "flex", alignItems: "center", p: 2 }}>
                <Typography sx={{ fontSize: 45 }}>
                  Id Factura: {factura.id_Factura}
                </Typography>
              </Paper>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 5 }}>
            <Box sx={{}}>
              <Paper sx={{ textAlign: "center", p: 3, width: 540 }}>
                <Typography sx={{ fontSize: 35 }}>Datos del Cliente</Typography>

                <Typography sx={{ fontSize: 25 }}>
                  Nombre Completo: {factura.nombreCompleto}
                </Typography>

                <Typography sx={{ fontSize: 25 }}>
                  Direccion: {factura.direccion_Envio}
                </Typography>
                <Typography sx={{ fontSize: 25 }}>
                  Correo: {factura.correo}
                </Typography>
              </Paper>
            </Box>
            <Box sx={{}}>
              <Paper sx={{ textAlign: "center", p: 3, width: 440 }}>
                 <Typography sx={{ mt: 3, fontSize: 35 }}>
                      Resumen Compra
                    </Typography>
                    <Typography sx={{ fontSize: 25 }}>
                      Productos Comprados: {factura.productos.length}
                    </Typography>
                    <Typography sx={{ fontSize: 25 }}>
                      Metodo de Pago: {factura.labelMetodoPago}
                    </Typography>
                    <Typography sx={{ fontSize: 25 }}>
                      Total: {factura.totalFacturado}
                    </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ width: "85%", minWidth: 700 }}>
          <Table aria-label="simple table" className="tableFix">
            <TableHead>
              <TableRow>
                {tableHeads.map((head, index) => (
                  <TableCell align="center" key={index}>
                    <Typography sx={{ fontSize: 30 }} textAlign="center">
                      {head}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {factura.productos.map((producto, index) => (
                <TableRow key={index} sx={{ position: "relative" }}>
                  <TableCell align="center">
                    <img
                      src={producto.foto}
                      width="140px"
                      alt={producto.nombre}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 25 }}>
                      {producto.nombre}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 30 }} textAlign="center">
                      {producto.precio}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 30 }} textAlign="center">
                      {producto.unidades}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 30 }} textAlign="center">
                      {producto.subTotal}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Typography sx={{ mt: 3, fontSize: 30 }}>
              Total Facturado: {factura.totalFacturado.toFixed(2)}
            </Typography> */}
      </Box>
    </>
  );
};

export default Factura;
