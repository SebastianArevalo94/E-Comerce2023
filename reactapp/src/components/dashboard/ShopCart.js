import {
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Paper,
    TableBody,
    Typography,
    Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deleteAll, deleteOne, setItems, addCuantity, substractCuantity } from "../../redux/shopCartSlice";
import { AlertSnack, DialogConfirm } from "../utils/Alerts";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { getLS } from "../helpers/localStorage";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';

const ShopCart = () => {
    const state = useSelector((state) => state.shopCart);
    const [total, setTotal] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleted, setOpenDeleted] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openDeleteAllConfirm, setOpenDeleteAllConfirm] = useState(false);
    const [openRedAlert, setORA] = useState(false);
    const [redAlertMsg, setRAM] = useState("");
    const [idToDelete, setIdToDelete] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClose = (event, reason, which) => {
        if (reason === "clickaway") {
            return;
        }
        which === "clean" ? setOpenDialog(false) : setOpenDeleted(false);
    };

    const tableHeads = ["Imagen", "Nombre", "Precio", "Cantidad", "Subtotal"];

    const handleCloseConfirm = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenConfirm(false);
    };

    const handleCloseDeleteAllConfirm = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenDeleteAllConfirm(false);
    };

    const calcTotal = () => {
        let total = 0;
        const shopCartLS = JSON.parse(localStorage.getItem("shopCart"));
        shopCartLS.forEach(item => {
            total += item.precio * item.unidades;
        });
        setTotal(total.toFixed(2))
    };

    const handleCleanCart = () => {
        setOpenDialog(!openDialog);
        dispatch(deleteAll());
        calcTotal();
        setORA(true)
        setRAM(`Carrito vaciado`);
    };

    const handleDeleteOne = (id) => {
        const produdctDeleted = state.shopCart.filter(i => i.id == id)[0];
        dispatch(deleteOne(id));
        setOpenConfirm(false);
        setORA(true)
        setRAM(`Producto "${produdctDeleted.nombre}" eliminado del carrito`);
        calcTotal();
    };

    const addUnity = (id) => {
        dispatch(addCuantity(id))
        calcTotal();
    }

    const substractUnity = (id) => {
        dispatch(substractCuantity(id))
        calcTotal();
    }

    //handle alert Deleted Product from Cart

    const handleCloseRA = () => {
        setORA(false)
    }


    useEffect(() => {
        calcTotal();
        dispatch(setItems(getLS()));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box sx={{ position: "relative" }}>
            <AlertSnack
                open={openRedAlert}
                alertContent={redAlertMsg}
                handleClose={handleCloseRA}
                severity="error"
                width="350px"
            />
            {state.shopCart.length > 0 ? (
                <>
                    <Box sx={{ position: "absolute", top: "15%", left: "2%" }}>
                        <ArrowBackIcon sx={{ fontSize: 55 }} onClick={() => navigate(-1)} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography sx={{ mt: 10 }} variant="h2" textAlign="center">
                            Carrito
                        </Typography>
                        <ShoppingCartOutlinedIcon sx={{ fontSize: 75, mt: 10 }} />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            mt: 3,
                        }}
                    >
                        <TableContainer
                            component={Paper}
                            sx={{ width: "85%", minWidth: 700 }}
                        >
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
                                    {state.shopCart.map((product, index) => (
                                        <TableRow key={index} sx={{ position: "relative" }}>
                                            <TableCell align="center">
                                                <img
                                                    src={product.foto}
                                                    width="140px"
                                                    alt={product.nombre}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography sx={{ fontSize: 25 }}>
                                                    {product.nombre}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography sx={{ fontSize: 30 }} textAlign="center">
                                                    {product.precio}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: "flex" }}>
                                                    <IconButton color="success" size="large" onClick={() => addUnity(product.id)}>
                                                        <AddIcon />
                                                    </IconButton>
                                                    <Typography sx={{ fontSize: 30 }} textAlign="center">
                                                        {product.unidades}
                                                    </Typography>
                                                    <IconButton color="error" component="label" size="large" onClick={() => substractUnity(product.id)}>
                                                        <RemoveIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography sx={{ fontSize: 30 }} textAlign="center">
                                                    {(product.precio * product.unidades).toFixed(2)}
                                                </Typography>
                                            </TableCell>
                                            <AlertSnack
                                                open={openDeleted}
                                                handleClose={() => handleClose("deleteOne")}
                                                alertContent={`Juego ${product.nombre} eliminado!`}
                                            />
                                            <DialogConfirm
                                                open={openConfirm}
                                                handleClose={handleCloseConfirm}
                                                action={() => handleDeleteOne(idToDelete)}
                                                title="¿Deseas eliminar este producto del carrito?"
                                            />
                                            <Button
                                                sx={{ position: "absolute", top: "75%", right: "3%" }}
                                                color="error"
                                                variant="contained"
                                                endIcon={<DeleteIcon />}
                                                onClick={() => {
                                                    setIdToDelete(product.id);
                                                    setOpenConfirm(true);
                                                }}
                                            >
                                                Eliminar
                                            </Button>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Paper sx={{ width: "65%", minWidth: 700, mt: 2 }}>
                            <Box
                                sx={{ display: "flex", justifyContent: "space-evenly", p: 2 }}
                            >
                                <Typography sx={{ fontSize: 30 }} textAlign="center">
                                    Precio total a pagar ${total}
                                </Typography>
                                <DialogConfirm
                                    open={openDeleteAllConfirm}
                                    handleClose={handleCloseDeleteAllConfirm}
                                    action={() => handleCleanCart()}
                                    title="¿Deseas eliminar todos los productos del carrito?"
                                />
                                <Link to="/payment" className="linkFix">
                                    <Button
                                        color="success"
                                        variant="contained"
                                    >
                                        Ir a Pagar
                                    </Button>
                                </Link>
                                <Button
                                    color="error"
                                    variant="contained"
                                    size="large"
                                    onClick={() => setOpenDeleteAllConfirm(true)}
                                >
                                    Vaciar Carrito
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </>
            ) : (
                <>
                    <Box sx={{ position: "absolute", top: "20.1%", left: "2%" }}>
                        <ArrowBackIcon sx={{ fontSize: 55 }} onClick={() => navigate(-1)} />
                    </Box>
                    <ArrowBackIcon sx={{ fontSize: 55 }} onClick={() => navigate(-1)} />
                    <Typography sx={{ mt: "15%" }} variant="h2" textAlign="center">
                        No hay items en el carrito
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 3 }}>
                        <Link to="/" className="linkFix">
                            <Button color="primary" variant="contained" size="large">
                                Agregar Productos
                            </Button>
                        </Link>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default ShopCart;