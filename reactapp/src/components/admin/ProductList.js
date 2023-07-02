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
    MenuItem,
    Select,
} from "@mui/material";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllAsync } from "../../redux/async-redux";
import { DialogConfirm } from "../utils/Alerts";
import { getByCategory, deleteProduct, getByName } from "../../services/products-service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CategoryIcon from '@mui/icons-material/Category';
import { sortProducts, setProducts } from "../../redux/productSlice";

const ProductList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const state = useSelector((state) => state.products);
    const categoryState = useSelector((state) => state.categories);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [idDelete, setIdDelete] = useState(null);
    const [filter, setFilter] = useState("Todas");
    const [sort, setSort] = useState("");

    const handleFilterChange = (event) => {
        if (event.target.value == 0) {
            dispatch(getAllAsync());
        } else {
            getByCategory(event.target.value)
                .then((json) => {
                    dispatch(setProducts({ data: json.response }));
                    //setLoadingProduct(false);
                })
                .catch((err) => console.log(err));
        }
    };

    const handleSearch = ({ target }) => {
        //setLoadingProduct(true);
        if (target.value.length == 0) {
            dispatch(getAllAsync());
            return false;
        }
        getByName(target.value)
            .then((json) => {
                dispatch(setProducts({ data: json.response }));
                //setLoadingProduct(false);
            })
            .catch((err) => console.log(err));
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);
        dispatch(sortProducts({ type: event.target.value, array: state.products }));
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleOpen = () => setOpenConfirm(true);

    const sortType = [
        "Precio mayor a menor",
        "Precio menor a mayor",
        "Alfabeticamente [A-Z]",
        "Alfabeticamente [Z-A]",
    ];

    useEffect(() => {
        dispatch(getAllAsync());
        const id = localStorage.getItem("id");
        if (id) {
            localStorage.removeItem("id");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tableHeads = ["Imagen", "Nombre", "Precio", "Categoria", "Accion"];

    const handleDeleteProduct = () => {
        deleteProduct(idDelete)
            .then((response) => {
                if (response.status == 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Producto Eliminado!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                dispatch(getAllAsync());
            })
            .catch((err) => console.log(err));
        handleCloseConfirm();
    };

    const ProductRow = ({ product }) => {
        return (
            <TableRow>
                <TableCell align="center">
                    <img width="150px" src={product.foto} alt={product.name} />
                </TableCell>
                <TableCell align="center">
                    <Typography variant="h5">{product.nombre}</Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography variant="h5">{product.precio}</Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography variant="h5">{product.nombreCategoria}</Typography>
                </TableCell>
                <TableCell>
                    <IconButton color="primary" aria-label="delete">
                        <Link to="/admin/products/add" className="linkFix">
                            <EditIcon
                                color="secondary"
                                sx={{ fontSize: 35 }}
                                onClick={() => {
                                    localStorage.setItem("id", product.id);
                                }}
                            />
                        </Link>
                    </IconButton>
                    <IconButton color="error" aria-label="delete">
                        <DeleteIcon
                            sx={{ fontSize: 35 }}
                            onClick={() => {
                                setIdDelete(product.id);
                                handleOpen();
                            }}
                        />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    };

    const FilterTable = () => {
        return filter !== "Todas" ? (
            <TableBody>
                {state.products
                    .filter((product) => product.categories === filter)
                    .map((product, index) => (
                        <ProductRow product={product} key={index} />
                    ))}
            </TableBody>
        ) : (
            <TableBody>
                {state.products.map((product, index) => (
                    <ProductRow product={product} key={index} />
                ))}
            </TableBody>
        );
    };

    return (
        <Box sx={{ mt: 10 }}>
            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                {/* Go Back Button */}
                <ArrowBackIcon
                    sx={{ fontSize: 55, mt: 1 }}
                    onClick={() => navigate(-1)}
                />
                {/* Buscador */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        mb: 3,
                        flexWrap: "wrap",
                    }}
                >
                    <Typography sx={{ fontSize: 65, fontWeight: 300 }} textAlign="center">
                        Filtrar
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            flexWrap: "wrap",
                        }}
                    >
                        <FormControl>
                            <TextField
                                label="Buscar"
                                id="search"
                                size="large"
                                fullWidth
                                onChange={handleSearch}
                            />
                        </FormControl>

                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    fullWidth
                                    label="Categoria"
                                    onChange={handleFilterChange}
                                >
                                    <MenuItem value="0">
                                        Todas
                                    </MenuItem>
                                    {categoryState.categories.map((item, index) => (
                                        <MenuItem key={index} value={item.codigo}>
                                            {item.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Ordenar</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={sort}
                                    label="Ordenar"
                                    onChange={handleSortChange}
                                >
                                    {sortType.map((item, index) => (
                                        <MenuItem key={index} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
                {/* Add Button */}

                <Box>
                    <Box sx={{ mt: 10 }}>
                        <Link to="/admin/category" className="linkFix">
                            <Button
                                color="primary"
                                variant="contained"
                                endIcon={<CategoryIcon />}
                            >
                                Administar Categorias
                            </Button>
                        </Link>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <Link to="/admin/products/add" className="linkFix">
                            <Button
                                color="success"
                                variant="contained"
                                endIcon={<AddCircleIcon />}
                            >
                                Agregar Producto
                            </Button>
                        </Link>
                    </Box>
                </Box>

            </Box>
            {/* Product Table */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>

                {
                    state.products.length > 0 ? (
                            <TableContainer component={Paper} sx={{ width: "85%" }}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            {tableHeads.map((head, index) => (
                                                <TableCell align="center" key={index}>
                                                    <Typography variant="h4">{head}</Typography>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    {/* DIV */}
                                    <TableBody>
                                        {
                                            state.products.length > 0 ? (
                                                state.products.map((product, index) => (
                                                            <ProductRow product={product} key={index} />
                                                        ))
                                        ) : (<h1>"No products found"</h1>)
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                    ) : <><h1>No products found</h1></>
                }
                <DialogConfirm
                    open={openConfirm}
                    handleClose={handleCloseConfirm}
                    title="¿Quieres borrar este producto?"
                    action={() => handleDeleteProduct(idDelete)}
                />
            </Box>
        </Box>
    );
};

export default ProductList;
