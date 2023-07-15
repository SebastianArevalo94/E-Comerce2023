import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { GetOneUser, EditUser } from "../../../services/users-service";
import { CreateUser } from "../../../services/users-service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fileUpload } from "../../helpers/fileUpload";
import Swal from "sweetalert2";

const Form = () => {
    const [user, setUser] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        contrasenia: "",
        rol: "",
        foto: ""
    });

    const [btnInfo, setBtnInfo] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = ({ target }) => {
        setUser({
            ...user,
            [target.name]: target.value,
        });
    };

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setIsLoading(true);
        setBtnInfo("Subiendo imagen...");
        const file = e.target.files[0];
        fileUpload(file)
            .then((resp) => {
                user.Foto = resp;
                setIsLoading(false);
                setBtnInfo("Agregar");
            })
            .catch((error) => {
                console.warn(error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = localStorage.getItem("id");
        if (!id) {
            CreateUser(user)
                .then((json) => {
                    if (json.status == 200) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Usuario Agregado!",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        navigate(-1);
                    }
                })
                .catch((err) => console.log(err));
        } else {
            EditUser(user, id)
                .then((json) => {
                    if (json.status == 200) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Usuario Editado!",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                    navigate(-1);
                })
                .catch((err) => console.log(err));
        }
    };

    useEffect(() => {
        const id = localStorage.getItem("id");
        if (id) {
            GetOneUser(id)
                .then((json) => {
                    setUser(json.response);
                    setBtnInfo("Guardar Cambios");
                })
                .catch((err) => console.log(err));
        } else {
            setBtnInfo("Agregar");
        }
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 10,
                flexDirection: "column",
                position: "relative",
            }}
        >
            <Box sx={{ position: "absolute", top: "-2%", left: "1%" }}>
                <ArrowBackIcon sx={{ fontSize: 55 }} onClick={() => navigate(-1)} />
            </Box>
            <Typography variant="h2" textAlign="center" sx={{ mb: 1 }}>
                {localStorage.getItem("id") ? "Editar Usuario" : "Agregar Usuario"}
            </Typography>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <form onSubmit={handleSubmit}>
                    <Card sx={{ width: 400 }}>
                        <CardContent
                            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                        >
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Nombre"
                                fullWidth
                                type="text"
                                name="nombre"
                                onChange={handleInputChange}
                                value={user.nombre}
                            />
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Apellido"
                                fullWidth
                                type="text"
                                name="apellido"
                                onChange={handleInputChange}
                                value={user.apellido}
                            />
                            <TextField
                                id="filled-multiline-static"
                                label="Correo"
                                fullWidth
                                type="text"
                                name="correo"
                                onChange={handleInputChange}
                                value={user.correo}
                            />
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Contraseña"
                                fullWidth
                                type="text"
                                name="contrasenia"
                                onChange={handleInputChange}
                                value={user.contrasenia}
                            />
                            <FormControl>
                                <InputLabel id="role">Categoria</InputLabel>
                                <Select
                                    label="Rol"
                                    id="Rol"
                                    name="rol"
                                    value={user.rol}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="1">Admin</MenuItem>
                                    <MenuItem value="2">Client</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                name="Foto"
                                type="file"
                                fullWidth
                                onChange={handleFileChange}
                            />
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                                disabled={isLoading}
                            >
                                {btnInfo}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </Box>
        </Box>
    );
};

export default Form;
