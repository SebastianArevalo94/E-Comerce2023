import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import { fileUpload } from "../helpers/fileUpload";
import {
    CreateCategory,
    GetOneCategory,
    EditCategory
} from "../../services/categories.service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";

const CategoryForm = () => {

    const navigate = useNavigate();

    const [title, setTitle] = useState("Agregar Categoria");
    const [buttonInfo, setButtonInfo] = useState("Agregar");

    const [category, setCategory] = useState({
        nombre: "",
        codigo: 0,
        id: 0
    })

    const handleInputChange = ({ target }) => {
        setCategory({
            ...category,
            [target.name]: target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = localStorage.getItem("id");
        if (!id) {
            CreateCategory(category)
                .then((response) => {
                    if (response.status == 201) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Categoria Creada!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                })
                .catch((err) => console.log(err));
            navigate(-1);
        } else {
            EditCategory(category, id)
                .then((response) => {
                    if (response.status == 200) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Categoria Editada!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    navigate(-1);
                })
                .catch((err) => console.log(err));


        }
    };

    useEffect(() => {
        const id = localStorage.getItem("id");
        if (id) {
            setTitle("Editar Categoria");
            setButtonInfo("Actualizar");
            GetOneCategory(id).then((response) => {
                if (response.status == 200) {
                    setCategory(response.response)
                }
            })
        }
    }, [])

    return (

        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 15,
                flexDirection: "column",
                position: "relative",
            }}
        >
            <Box sx={{ position: "absolute", bottom: "90%", left: "1%" }}>
                <ArrowBackIcon sx={{ fontSize: 55 }} onClick={() => navigate(-1)} />
            </Box>
            <Typography variant="h2" textAlign="center" sx={{ mt:7,  mb: 1 }}>
                {title}
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <form onSubmit={handleSubmit}>
                    <Card sx={{ width: 400 }}>
                        <CardContent
                            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                        >
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Nombre"
                                fullWidth
                                type="text"
                                name="nombre"
                                value={category.nombre}
                                onChange={handleInputChange}
                            />

                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                            >
                                {buttonInfo}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </Box>

        </Box>
    )

}

export default CategoryForm