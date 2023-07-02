import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAsync, getByCategoryAsync, GetAllCategories } from "../../redux/async-redux";
import {
    Box,
    Card,
    Button,
    CardContent,
    Typography,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { addItem } from "../../redux/shopCartSlice";
import { AlertDialog, AlertSnack, InfoProduct } from "../utils/Alerts";
import InfoIcon from "@mui/icons-material/Info";
import { setItems } from "../../redux/shopCartSlice";
import { getLS } from "../helpers/localStorage";
import { sortProducts, setProducts } from "../../redux/productSlice";
import { GetAll, setCategories } from "../../redux/categorySlice";
import { getByCategory, getOne, getByName } from "../../services/products-service";

const Main = () => {
    const dispatch = useDispatch();
    const productState = useSelector((state) => state.products);
    const shopCartState = useSelector((state) => state.shopCart);
    const categoryState = useSelector((state) => state.categories);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [productName, setProductName] = useState("");
    const [product, setProduct] = useState({});
    const [filter, setFilter] = useState(0);
    const [sort, setSort] = useState("");

    const handleSucessClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSuccess(false);
    };

    const toggleInfo = () => {
        setOpenInfo(true);
    };

    const handleCloseInfo = () => {
        setOpenInfo(false);
    };

    const fetchProduct = (id) => {
        setLoadingProduct(true);
        getOne(id)
            .then((json) => {
                setProduct(json.response);
                setLoadingProduct(false);
            })
            .catch((err) => console.log(err));
    };

    const handleFilterChange = (event) => {
        setLoadingProduct(true);
        if (event.target.value == 0) {
            dispatch(getAllAsync());
        } else {
            getByCategory(event.target.value)
                .then((json) => {
                    dispatch(setProducts({ data: json.response }));
                    setLoadingProduct(false);
                })
                .catch((err) => console.log(err));
        }
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);
        dispatch(
            sortProducts({ type: event.target.value, array: productState.products })
        );
    };

    const ProductCard = ({ product }) => {
        return (
            <Card
                sx={{
                    width: 320,
                    maxWidth: "sm",
                    p: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box sx={{ m: "auto" }}>
                        <img src={product.foto} alt="Cover" width="200px" />
                    </Box>
                    <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="h5" textAlign="center">
                            {product.nombre}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                mt: 2,
                                gap: 3,
                            }}
                        >
                            <Typography sx={{ fontSize: 21 }} textAlign="center">
                                Precio: {product.precio}
                            </Typography>
                            <Typography sx={{ fontSize: 21 }} textAlign="center">
                                Categoria: {product.nombreCategoria}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 3,
                                p: 2,
                            }}
                        >
                            <Button
                                variant="contained"
                                color="success"
                                endIcon={<ShoppingCartIcon />}
                                onClick={() => handleAddItem(product)}
                            >
                                Agregar
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                endIcon={<InfoIcon />}
                                onClick={() => {
                                    fetchProduct(product.id);
                                    toggleInfo();
                                }}
                            >
                                Detalle
                            </Button>
                        </Box>
                    </CardContent>
                </Box>
            </Card>
        );
    };

    const handleSearch = ({ target }) => {
        setLoadingProduct(true);
        if (target.value.length == 0) {
            dispatch(getAllAsync());
            return false;
        }
        getByName(target.value)
            .then((json) => {
                dispatch(setProducts({ data: json.response }));
                setLoadingProduct(false);
            })
            .catch((err) => console.log(err));
    };

    const sortType = [
        "Precio mayor a menor",
        "Precio menor a mayor",
        "Alfabeticamente [A-Z]",
        "Alfabeticamente [Z-A]",
    ];

    useEffect(() => {
        dispatch(getAllAsync());
        dispatch(setItems(getLS()));
        dispatch(GetAllCategories());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkItemInCart = (item) => {
        const itemFind = shopCartState.shopCart.find(
            (cartItem) => cartItem.id === item.id
        );
        if (itemFind) {
            setOpenDialog(!openDialog);
            setProductName(item.nombre);
        } else {
            setOpenSuccess(!openSuccess);
        }
    };

    const handleAddItem = (item) => {
        dispatch(addItem(item));
        checkItemInCart(item);
    };

    return (
        <>
            <Box sx={{ mt: 7.8 }}>
                <AlertDialog
                    open={openDialog}
                    productName={productName}
                    handleClose={setOpenDialog}
                />
                <AlertSnack
                    open={openSuccess}
                    alertContent="Producto Agregado al carrito!"
                    handleClose={handleSucessClose}
                    severity="success"
                    width="250px"
                />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", mt: 5 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Typography sx={{ fontSize: 65, fontWeight: 300 }} textAlign="center">
                        Buscar
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
                                label="Escribe tu busqueda"
                                id="search"
                                size="large"
                                fullWidth
                                onChange={handleSearch}
                                sx={{ mt: 3 }}
                            />
                        </FormControl>

                        <Box sx={{ minWidth: 120, mt: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel id="category">Categoria</InputLabel>
                                <Select
                                    labelId="category"
                                    id="category"
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

                        <Box sx={{ minWidth: 120, mt: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel id="sort">Ordenar</InputLabel>
                                <Select
                                    labelId="sort"
                                    id="sort"
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
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 3,
                        m: 2,
                    }}
                >
                    {/* Products List */}
                    {

                        productState.products.length > 0 ? (

                            productState.products.map((product, index) => (
                                <ProductCard product={product} key={index} />
                            ))
                        ) : (<h1>No Products Found</h1>)
                    }
                    <InfoProduct
                        open={openInfo}
                        handleClose={handleCloseInfo}
                        product={product}
                        loading={loadingProduct}
                    />
                </Box>
            </Box>
        </>
    );
};

export default Main;
