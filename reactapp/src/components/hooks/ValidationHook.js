import { useState } from "react";
import {
    validateName,
    validateEmail,
    validatePassword,
} from "../helpers/validateUser";

const initialValidateState = {
    Nombre: {
        isValid: null,
        message: "",
    },
    Apellido: {
        isValid: null,
        message: "",
    },
    Correo: {
        isValid: null,
        message: "",
    },
    Contrasenia: {
        isValid: null,
    },
};

export const ValidateHook = (initialUserState) => {
    const [user, setUser] = useState(initialUserState);
    const [validate, setValidate] = useState(initialValidateState);
    const [userValid, setUserValid] = useState(false);
    const inputValidator = (obj) => {
        let array = [];
        Object.values(obj).forEach((prop) => {
            array.push(prop.isValid);
        });
        const validator = (isValid) => {
            return isValid;
        };
        setUserValid(array.every(validator));
    };
    const handleInputChange = ({ target }) => {
        setUser({
            ...user,
            //[target.name]: target.value.replace(/ /g, "")
            [target.name]: target.value
        });
        if (target.name === "Nombre" || target.name === "Apellido") {
            let resp = validateName(target.value);
            setValidate({
                ...validate,
                [target.name]: resp,
            });
        } else if (target.name === "Correo") {
            let resp = validateEmail(target.value);
            setValidate({
                ...validate,
                [target.name]: resp,
            });
        } else if (target.name === "Contrasenia") {
            let resp = validatePassword(target.value);
            setValidate({
                ...validate,
                [target.name]: resp,
            });
        }
        inputValidator(validate);
    };
    const reset = () => {
        setUser(initialUserState);
    };
    return [user, validate, handleInputChange, userValid, setUserValid, reset];
};
