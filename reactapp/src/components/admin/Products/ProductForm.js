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
import { fileUpload } from "../../helpers/fileUpload";
import {
  createProduct,
  getOne,
  updateProduct,
} from "../../../services/products-service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const Form = () => {
  const [product, setProduct] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    categoria: "",
    foto: "",
    cantidad: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const categoryState = useSelector((state) => state.categories);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      product.foto = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const [btnInfo, setBtnInfo] = useState("");

  const handleInputChange = ({ target }) => {
    setProduct({
      ...product,
      [target.name]: target.value,
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    let id = localStorage.getItem("id");
    if (id) {
      getOne(id)
        .then((response) => {
          setProduct(response.response);
          setBtnInfo("Guardar Cambios");
        })
        .catch((err) => console.log(err));
    } else {
      setBtnInfo("Agregar");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let id = localStorage.getItem("id");
    if (!id) {
      createProduct(product)
        .then((response) => {
          if (response.status == 201) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Producto Creado!",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((err) => console.log(err));
      navigate(-1);
    } else {
      updateProduct(product, id)
        .then(() => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Producto Editado!",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((err) => console.log(err));
      navigate(-1);
    }
  };
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
      <Box sx={{ position: "absolute", bottom: "90%", left: "1%" }}>
        <ArrowBackIcon sx={{ fontSize: 55 }} onClick={() => navigate(-1)} />
      </Box>
      <Typography variant="h2" textAlign="center" sx={{ mb: 1 }}>
        {localStorage.getItem("id") ? "Editar Producto" : "Agregar Producto"}
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
                value={product.nombre}
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Precio"
                fullWidth
                multiline
                type="number"
                name="precio"
                onChange={handleInputChange}
                value={product.precio}
              />
              <TextField
                id="filled-multiline-static"
                label="Descripcion"
                multiline
                rows={4}
                fullWidth
                type="text"
                name="descripcion"
                variant="filled"
                onChange={handleInputChange}
                value={product.descripcion}
              />
              <FormControl>
                <InputLabel id="category">Categoria</InputLabel>
                <Select
                  label="Categoria"
                  id="category"
                  name="categoria"
                  value={product.categoria}
                  onChange={handleInputChange}
                >
                  {categoryState.categories.map((category, index) => (
                    <MenuItem key={index} value={category.codigo}>
                      {category.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                id="outlined-multiline-flexible"
                label="Cantidad"
                fullWidth
                multiline
                type="number"
                name="cantidad"
                onChange={handleInputChange}
                value={product.cantidad}
              />
              <TextField
                name="cover"
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
