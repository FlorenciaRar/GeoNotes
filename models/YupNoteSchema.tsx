import * as Yup from "yup";

export const NoteSchema = Yup.object().shape({
  title: Yup.string().required("El título es obligatorio").min(3, "Debe tener al menos 3 caracteres"),
  content: Yup.string().required("El contenido es obligatorio").min(5, "Debe tener al menos 5 caracteres"),
  adress: Yup.string().required("La direccion es obligatoria"),
  latitude: Yup.number().typeError("Latitud inválida").required("Latitud requerida"),
  longitude: Yup.number().typeError("Longitud inválida").required("Longitud requerida"),
});
