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
import { getAllAsync, GetAllCategories } from "../../../redux/async-redux";
import { DialogConfirm } from "../../utils/Alerts";
import {
  getByCategory,
  deleteProduct,
  getByName,
} from "../../../services/products-service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CategoryIcon from "@mui/icons-material/Category";
import { setCategories } from "../../../redux/categorySlice";
import { DeleteCC } from "../../../services/credit-card.service";
import {
  DeleteCategory,
  GetCategoryByName,
} from "../../../services/categories.service";

const Category = () => {
  const tableHeads = ["Codigo", "Nombre", "Accion"];
  const categoryState = useSelector((state) => state.categories);
  const [openDelete, setOD] = useState(false);
  const [idDelete, setIDD] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOD = () => {
    setOD(!openDelete);
  };

  const handleClose = () => {
    setOD(false);
  };

  const _DeleteCategory = () => {
    DeleteCategory(idDelete).then(() => {
      handleClose();
      dispatch(GetAllCategories());
    });
  };

  const handleSearch = (event) => {
    if (event.target.value.length == 0) {
      dispatch(GetAllCategories());
    } else {
      GetCategoryByName(event.target.value)
        .then((resp) => {
          dispatch(setCategories({ data: resp.response }));
          //console.log(resp)
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    dispatch(GetAllCategories());
    localStorage.removeItem("id");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CategoryRow = ({ category }) => {
    return (
      <TableRow>
        <TableCell align="center">
          <Typography variant="h5">{category.codigo}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="h5">{category.nombre}</Typography>
        </TableCell>
        <TableCell align="center">
          <IconButton color="primary" aria-label="delete">
            <Link to="/admin/category/add" className="linkFix">
              <EditIcon
                color="secondary"
                sx={{ fontSize: 35 }}
                onClick={() => {
                  localStorage.setItem("id", category.id);
                }}
              />
            </Link>
          </IconButton>
          <IconButton color="error" aria-label="delete">
            <DeleteIcon
              sx={{ fontSize: 35 }}
              onClick={() => {
                setIDD(category.id);
                setOD(true);
              }}
            />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ mt: 10, display: "flex", flexDirection: "column" }}>
      <DialogConfirm
        open={openDelete}
        handleClose={handleClose}
        title={"Deseas eliminar la categoria"}
        action={_DeleteCategory}
      />

      <Box sx={{ position: "absolute", top: "15%", left: "2%" }}>
        <ArrowBackIcon sx={{ fontSize: 55 }} onClick={() => navigate(-1)} />
      </Box>

      <Typography sx={{ fontSize: 65, fontWeight: 300 }} textAlign="center">
        Categorias
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 2 }}>
        <FormControl
          sx={
            {
              /*mt: 3 */
            }
          }
        >
          <TextField
            label="Buscar"
            id="search"
            size="large"
            fullWidth
            onChange={handleSearch}
          />
        </FormControl>

        <Box sx={{ mt: 1 }}>
          <Link to="/admin/category/add" className="linkFix">
            <Button
              color="success"
              variant="contained"
              endIcon={<AddCircleIcon />}
            >
              Agregar Categoria
            </Button>
          </Link>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ width: "85%", margin: "auto", mt: 4 }}
      >
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
            {categoryState.categories.map((category, index) => (
              <CategoryRow category={category} key={index} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Category;
