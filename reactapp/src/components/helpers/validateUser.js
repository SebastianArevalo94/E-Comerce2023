export const validateName = (name) => {
  let result = {
    isValid: false,
    message: "",
  };
  if (name !== "") {
    if (name.length >= 3) {
      result.isValid = true;
      result.message = "Nombre valido";
    } else {
      result.message = "El nombre debe tener minimo 3 caracteres.";
    }
  } else {
    result.message = "Introduce un nombre.";
  }
  return result;
};

export const validateEmail = (email) => {
  let result = {
    isValid: false,
    message: "",
  };
  if (email !== "") {
    let hasArroba = false;
    let hasDot = false;
    for (let letter of email) {
      if (!hasArroba) {
        if (letter === "@") {
          hasArroba = true;
        }
      }
      if (!hasDot) {
        if (letter === ".") {
          hasDot = true;
        }
      }
    }

    if (!hasArroba && !hasDot) {
      result.message = "Introduce un correo valido.";
    } else if (!hasArroba && hasDot) {
      result.message = "El email no tiene arroba (@).";
    } else if (hasArroba && !hasDot) {
      result.message = "El email no tiene punto (.).";
    } else if (hasArroba && hasDot) {
      result.isValid = true;
      result.message = "Email Valido";
    }
  } else {
    result.message = "Introduce un email.";
  }
  return result;
};

export const validatePassword = (password) => {
  let result = {
    hasCapital: null,
    hasNumber: null,
    isMin8: null,
    isValid: null,
  };
  const hasCapital = (str) => {
    let hasCapital = false;
    for (let x of str) {
      if (!hasCapital) {
        if (x === x.toUpperCase() && x !== x.toLowerCase()) {
          hasCapital = true;
        }
      }
    }
    return hasCapital;
  };
  const hasNumber = (str) => /\d/.test(str);
  if (password !== "") {
    result.hasCapital = hasCapital(password);
    result.hasNumber = hasNumber(password);
    result.isMin8 = password.length >= 8 ? true : false;
    result.isValid =
      hasCapital(password) && hasNumber(password) && password.length >= 8;
  } else {
    result.message = "Introduce una contraseña";
  }
  return result;
};
