import * as Yup from "yup";

export const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .required("El título es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),
  content: Yup.string()
    .required("El contenido es obligatorio")
    .min(5, "Debe tener al menos 5 caracteres"),
  adress: Yup.string().when("useCurrentLocation", {
    is: (val: boolean) => val === false,
    then: (schema) => schema.required("La dirección es obligatoria"),
    otherwise: (schema) => schema,
  }),
  useCurrentLocation: Yup.boolean(),
});
