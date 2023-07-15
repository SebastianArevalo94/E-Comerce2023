import { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Container,
  ListItemButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { CreditCardDialog, AlertInfo, DialogConfirm } from "../utils/Alerts";
import { GetUserById } from "../../services/auth-service";
import jwt_decode from "jwt-decode";
import {
  CreateCC2,
  GetCCByUser,
  GetCCById,
  EditCC,
  DeleteCC,
} from "../../services/credit-card.service";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Swal from "sweetalert2";

const AdminCreditCards = () => {
  const initialStateCC = {
    Id: 0,
    CardHolder: "",
    Numero: "",
    Expira: "",
    Ccv: "",
    Tipo: "",
    Id_User: 0,
  };

  const [ccList, setCCList] = useState([]);
  const [cc, setCC] = useState(initialStateCC);
  const [cdTitle, setCdTitle] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [user, setUser] = useState({});
  const [selectedExpiry, setSelectedExpiry] = useState(null);
  const [open, setOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cdTitle === "Agregar Tarjeta") {
      CreateCC2(cc).then((json) => {
        GetCCByUser(user.id).then((json) => {
          setCCList(json.results);
          handleClose();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Tarjeta Agregada!",
            showConfirmButton: false,
            timer: 1500,
          });
        });
      });
    } else if (cdTitle === "Editar Tarjeta") {
      EditCC(cc).then((json) => {
        GetCCByUser(user.id).then((json) => {
          setCCList(json.results);
          handleClose();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Tarjeta Actualizada!",
            showConfirmButton: false,
            timer: 1500,
          });
        });
      });
    }

    setCC({
      ...initialStateCC,
      Id_User: user.id,
      CardHolder: `${user.nombre} ${user.apellido}`,
    });
  };

  const handleChange = ({ target }) => {
    setCC({
      ...cc,
      [target.name]: target.value,
    });
  };

  const handleExpiry = (date) => {
    setSelectedExpiry(date);
    setCC({
      ...cc,
      Expira: date,
    });
  };

  const handleCreateOpen = () => {
    setCdTitle("Agregar Tarjeta");
    setOpen(!open);
  };

  const handleEditOpen = (id) => {
    setCdTitle("Editar Tarjeta");
    GetCCById(id).then((json) => {
      setCC(json.results);
      handleExpiry(json.response.results.Expira);
    });
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmClose = () => {
    setOpenConfirm(false);
  };

  const handleConfirmOpen = (id) => {
    setOpenConfirm(true);
    setIdToDelete(id);
  };

  const handleDeleteCC = () => {
    DeleteCC(idToDelete).then(() => {
      GetCCByUser(user.id).then((json) => {
        setCCList(json.results);
        handleClose();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tarjeta Eliminada!",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    });
    handleConfirmClose();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = jwt_decode(token);

    GetUserById(payload.id).then((json) => {
      setUser(json.response);
      setCC({
        ...cc,
        Id_User: parseInt(payload.id),
        CardHolder: `${json.response.nombre.split(" ")[0]} ${
          json.response.apellido.split(" ")[0]
        }`,
      });

      GetCCByUser(payload.id).then((json) => {
        setCCList(json.results);
      });
    });
  }, []);

  const CreditCardCard = ({ cc }) => {
    return (
      <Card sx={{ m: 2, p: 1, width: 300 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CreditCardIcon sx={{ fontSize: 170 }} />
          </Box>
          <Typography variant="h6" component="h2">
            {cc.numero}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Card Holder: {cc.cardHolder}
          </Typography>
          <Typography color="textSecondary">Expira: {cc.expira}</Typography>
          <Typography color="textSecondary">CCV: {cc.ccv}</Typography>
          <Typography color="textSecondary">Tipo: {cc.tipo}</Typography>
        </CardContent>
        <ListItemButton
          sx={{ display: "flex", justifyContent: "center", gap: 1 }}
          onClick={() => handleEditOpen(cc.id)}
        >
          <EditIcon sx={{ fontSize: 27 }} />
          <Typography>Editar</Typography>
        </ListItemButton>
        <ListItemButton
          sx={{ display: "flex", justifyContent: "center", gap: 1 }}
          onClick={() => {
            handleConfirmOpen(cc.id);
          }}
        >
          <DeleteIcon sx={{ fontSize: 27 }} />
          <Typography>Eliminar</Typography>
        </ListItemButton>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        mt: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CreditCardDialog
        open={open}
        cc={cc}
        title={cdTitle}
        selectedExpiry={selectedExpiry}
        handleExpiry={handleExpiry}
        handleClose={handleClose}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      <DialogConfirm
        open={openConfirm}
        handleClose={handleConfirmClose}
        title="Quieres borrar esta tarjeta de credito?"
        action={handleDeleteCC}
      />

      <AlertInfo
        show={false}
        severity={"success"}
        content={"tarjeta agregada"}
      />
      <Box>
        <Button variant="contained" color="success" onClick={handleCreateOpen}>
          Agregar Nueva Tarjeta
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          mt: 3,
        }}
      >
        {ccList.length > 0 ? (
          ccList.map((cc) => <CreditCardCard cc={cc} />)
        ) : (
          <Typography variant="h6" component="h2">
            No tienes tarjetas registradas
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AdminCreditCards;
