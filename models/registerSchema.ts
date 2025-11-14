import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es obligatorio"),
  surname: Yup.string().required("El apellido es obligatorio"),
  birthdate: Yup.string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Formato DD/MM/YYYY")
    .required("La fecha de nacimiento es obligatoria"),
  email: Yup.string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es obligatoria"),
});
