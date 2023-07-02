import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
    Snackbar,
    Alert,
    Box,
    Card,
    CardContent,
    TextField,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormControl, InputLabel } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export const AlertDialog = ({ open, productName, handleClose }) => {
    return open ? (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" textAlign="center">
                {"El producto ya esta en el carrito"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Ya has agregado el producto "{productName}" al carrito.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleClose(!open)}
                >
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    ) : (
        ""
    );
};

export const AlertSnack = ({ open, handleClose, alertContent, severity, width }) => {
    return (
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: width }}>
                {alertContent}
            </Alert>
        </Snackbar>
    );
};

export const AlertInfo = ({ show, severity, content }) => {
    return (
        <Box>{show ? <Alert severity={severity}> {content} </Alert> : ""}</Box>
    );
};

export const DialogConfirm = ({ open, handleClose, title, action, showCancel = true }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogActions sx={{ display: "flex", justifyContent: "space-evenly" }}>
                <Button color="success" variant="contained" onClick={action}>
                    Aceptar
                </Button>
                {
                    showCancel ? (
                        <Button color="error" variant="contained" onClick={handleClose}>
                            Cancelar
                        </Button>
                    ) : ""
                }
            </DialogActions>
        </Dialog>
    );
};

export const CreditCardDialog = ({
    open,
    cc,
    selectedExpiry,
    handleExpiry,
    handleClose,
    handleChange,
    handleSubmit,
    title
}) => {
    return open ? (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle textAlign="center">{title}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Card sx={{ width: 400 }}>
                        <CardContent
                            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                        >
                            {/*<TextField*/}
                            {/*    id="outlined-multiline-flexible"*/}
                            {/*    label="Id"*/}
                            {/*    fullWidth*/}
                            {/*    type="text"*/}
                            {/*    name="id"*/}
                            {/*    onChange={handleChange}*/}
                            {/*    value={cc.Id_User}*/}
                            {/*/>*/}
                            <TextField
                                id="outlined-multiline-flexible"
                                label="CardHolder"
                                fullWidth
                                type="text"
                                name="CardHolder"
                                onChange={handleChange}
                                value={cc.CardHolder}
                            />
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Numero"
                                fullWidth
                                type="number"
                                name="Numero"
                                onChange={handleChange}
                                value={cc.Numero}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    value={selectedExpiry}
                                    onChange={handleExpiry}
                                    label="Fecha de Expiracion"
                                    views={['year', 'month']}
                                    disablePast={true}
                                />
                            </LocalizationProvider>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="CCV"
                                fullWidth
                                type="number"
                                name="Ccv"
                                onChange={handleChange}
                                value={cc.Ccv}
                            />
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Tipo"
                                fullWidth
                                type="text"
                                name="Tipo"
                                onChange={handleChange}
                                value={cc.Tipo}
                            />
                            <Button variant="contained" color="success" type="submit">
                                Guardar
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </DialogContent>
        </Dialog>
    ) : (
        ""
    );
};

export const InfoProduct = ({ open, handleClose, product, loading }) => {
    const HandleLoading = () => {
        return loading ? (
            <Paper
                elevation={3}
                sx={{ width: 200, display: "flex", justifyContent: "center", p: 5 }}
            >
                <CircularProgress />
            </Paper>
        ) : (
            <>
                <DialogTitle textAlign="center">{product.nombre}</DialogTitle>
                <DialogContent>HOLA</DialogContent>
            </>
        );
    };
    return open ? (
        <Dialog onClose={handleClose} open={open}>
            <HandleLoading />
        </Dialog>
    ) : (
        ""
    );
};
