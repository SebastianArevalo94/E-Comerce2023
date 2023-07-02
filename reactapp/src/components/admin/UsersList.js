import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
  IconButton,
  Button,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { GetAllUsers, DeleteUser } from "../../services/users-service";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogConfirm } from "../utils/Alerts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Swal from "sweetalert2";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [idDelete, setIdDelete] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const displayedData = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const tableHeads = ["Imagen", "Nombre", "Email", "Rol", "Creacion", "Accion"];

  const handleOpenConfirm = () => setOpenConfirm(true);

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const firstCapital = (str) => {
    const resp = str.charAt(0).toUpperCase() + str.slice(1);
    return resp;
  };

  const HandleDeleteUser = (id) => {
    DeleteUser(id)
      .then((json) => {
        if (json.status == 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Usuario eliminado!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((err) => console.log(err));

    GetAllUsers()
      .then((json) => {
        setUsers(json.response);
      })
      .catch((err) => console.log(err));
    handleCloseConfirm();
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleInputChange = ({ target }) => {
    setSearch(target.value);
    if (target.value === "") {
      GetAllUsers()
        .then((json) => {
          setUsers(json.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const UserRow = ({ user }) => {
    return (
      <TableRow>
        <TableCell align="center">
          <img width="150px" src={user.foto} alt={user.Nombre} />
        </TableCell>
        <TableCell align="center">
          <Typography variant="h5">{user.nombre}</Typography>
          <Typography variant="h5">{user.apellido}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="h5">{user.correo}</Typography>
          {/*<Typography variant="h5">{`@${user.correo.split("@")[1]}`}</Typography>*/}
        </TableCell>
        <TableCell align="center">
          <Typography variant="h5">{user.rol}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="h5">{user.fechaCreacion}</Typography>
        </TableCell>
        <TableCell>
          <IconButton color="primary" aria-label="delete">
            <Link to="/admin/users/add" className="linkFix">
              <EditIcon
                sx={{ fontSize: 35 }}
                onClick={() => {
                  localStorage.setItem("id", user.id);
                  console.log(localStorage.getItem("id"));
                }}
              />
            </Link>
          </IconButton>
          <IconButton color="error" aria-label="delete">
            <DeleteIcon
              sx={{ fontSize: 35 }}
              onClick={() => {
                setIdDelete(user.id);
                handleOpenConfirm();
              }}
            />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  const SortType = () => {
    if (search !== "") {
      return users
        .filter(
          (user) =>
            user.email.includes(search.toLowerCase()) ||
            user.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((user, index) => (
          <TableBody>
            <UserRow user={user} key={index} />
          </TableBody>
        ));
    } else if (filter !== "Todos") {
      return users
        .filter((user) => user.role === filter)
        .map((user, index) => (
          <TableBody>
            <UserRow user={user} key={index} />
          </TableBody>
        ));
    } else {
      return users.map((user, index) => (
        <TableBody>
          <UserRow user={user} key={index} />
        </TableBody>
      ));
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      localStorage.removeItem("id");
    }
    GetAllUsers()
      .then((json) => {
        setUsers(json.response);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box sx={{ mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <ArrowBackIcon
          sx={{ mt: 3, fontSize: 55 }}
          onClick={() => navigate(-1)}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{ fontSize: 65, fontWeight: 300, mr: 3 }}
            textAlign="center"
          >
            Filtrar
          </Typography>
          <Box
            sx={{
              display: "flex",
              mt: 3,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <FormControl>
              <TextField
                label="Buscar"
                id="search"
                value={search}
                onChange={handleInputChange}
                size="large"
                fullWidth
              />
            </FormControl>

            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={filter}
                  fullWidth
                  label="Rol"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="Todos">Todos</MenuItem>
                  <MenuItem value="admin">Admins</MenuItem>
                  <MenuItem value="client">Clientes</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
        <Link to="/admin/users/add" className="linkFix">
          <Box sx={{ mt: 4 }}>
            <Button
              color="success"
              variant="contained"
              endIcon={<AddCircleIcon />}
            >
              Agregar Usuario
            </Button>
          </Box>
        </Link>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TableContainer component={Paper} sx={{ width: "95%" }}>
          <Table
            aria-label="simple table"
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          >
            <TableHead>
              <TableRow>
                {tableHeads.map((head, index) => (
                  <TableCell align="center" key={index}>
                    <Typography variant="h4">{head}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {/* Users List */}
            {displayedData.map((user, index) => (
              <TableBody>
                <UserRow user={user} key={index} />
              </TableBody>
            ))}
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
        <DialogConfirm
          open={openConfirm}
          handleClose={handleCloseConfirm}
          title="¿Quieres borrar este usuario?"
          action={() => HandleDeleteUser(idDelete)}
        />
      </Box>
    </Box>
  );
};

export default Users;
