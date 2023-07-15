import { Box, Typography, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import ShopIcon from "@mui/icons-material/Shop";

const Admin = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        mt: 5,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        position: "relative",
      }}
    >
      <Box>
        <ArrowBackIcon
          sx={{ position: "absolute", top: "10%", left: "2%", fontSize: 55 }}
          onClick={() => navigate(-1)}
        />
      </Box>
      <Typography variant="h2" textAlign="center" sx={{ p: 2 }}>
        Bienvenido al Panel Administrador
      </Typography>
      <Typography variant="h4" textAlign="center">
        Hola Admin, ¿Que quieres hacer?
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          flexWrap: " wrap",
        }}
      >
        <Paper
          elevation={2}
          sx={{ p: 4, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <AccountCircleIcon sx={{ fontSize: 170 }} />
          </Box>
          <Link to="/admin/users" className="linkFix">
            <Button color="info" variant="contained">
              Administrar Usuarios
            </Button>
          </Link>
        </Paper>
        <Paper
          elevation={2}
          sx={{ p: 4, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <ShopIcon sx={{ fontSize: 170 }} />
          </Box>

          <Link to="/admin/products" className="linkFix">
            <Button color="info" variant="contained">
              Administrar Productos
            </Button>
          </Link>
        </Paper>
        <Paper
          elevation={2}
          sx={{ p: 4, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <FolderSharedIcon sx={{ fontSize: 170 }} />
          </Box>

          <Link to="/admin/users-activity" className="linkFix">
            <Button color="info" variant="contained">
              Ver Actividad de Usuarios
            </Button>
          </Link>
        </Paper>
      </Box>
    </Box>
  );
};

export default Admin;
