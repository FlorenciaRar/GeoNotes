# GeoNotes

Aplicacion para registrar notas geolocalizadas, realizado con React Native + Expo

### Integrantes
- Bordet, Gastón
- Gauthier, Gustavo
- Romero, Ana Belén
- Strugo, Florencia

### Curso
Desarrollo de aplicaciones moviles - Tecnicatura universitaria en desarrollo web - UNER 

### Año 
2025 - Segundo cuatrimestre


## Descripción de las pantallas creadas

### 1- Login: 
Permite ingresar las credenciales del usuario e iniciar sesión.

### 2- Registro: 
Permite al usuario crear credenciales para acceder a la aplicación.

### 3- Home: 
Es la pantalla principal de nuestra app, permite acceder rápidamente a las acciones principales de la app (todas las notas, crear nota, ver mapa) así como ver un preview de las últimas notas creadas.

### 4- Todas las notas
Ver todas las notas generadas por el usuario. Hacer tap en una nota lleva a editar nota, como Google Keep, cada nota se puede borrar y compartir desde las opciones, además, cada nota se puede deslizar a los costados para eliminar.

### 5- Editar nota
Permite visualizar todo el contenido( título, ubicación, contenido e imágenes ) de la nota y editarlo. Se puede establecer una ubicación para la nota ya sea buscándola manualmente o usando la ubicación actual.

### 6- Crear nota
Permite crear una nota, muestra los mismos campos de editar nota pero vacìos.

### 7- Ver nota compartida
Accede a una vista de nota compartida mediante deeplink. Permite ver la ubicación de la nota, título, contenido e imágenes.

### 8- Mapa
Muestra markers en las notas creadas con un tooltip. Además el usuario puede buscar una ubicación en el mapa y crear una nota a partir de la ubicación buscada.

### 8- Configuración
Muestra opciones para personalizar la app o cerrar sesión.

### 9- Personalización:
Muestra todos los temas disponibles para la aplicación y un preview de los elementos para poder previsualizar cómo se verá la aplicación sin salir de esa pantalla.


## Funcionalidades
### Apis del dispositivo:
- Expo ImagePicker: Usa la galería y la cámara para poder sumar imágenes a las notas. 
- Expo Location: Usamos la ubicación para poder tomar la posición actual de usuario como punto para las notas, para ubicar al usuario en el mapa y para poder determinar cuándo deben sonar las notificaciones por cercanía a una nota.
- Expo Notifications: Usamos notificaciones locales para avisarle al usuario cuando una nota se encuentra cerca de su ubicación.

### Apis públicas:
- Imgbb: Utilizado para subir las imágenes de las notas.
- Tinyurl: Para convertir el deeplink de la nota compartida en un link clickeable en redes como whatsapp y mail.
- Nominatim (de openstreetmap) para buscar la dirección, latitud y longitud de un punto a partir de una cadena de texto.

### Otros:
- Styled components + Api de stylesheet para componentes reutilizables y clases en general
- Gesture handler y reanimated: Para el gesto de borrar nota y el pinch + pan de las imágenes de las notas


## Capturas de pantalla
<img width="300" height="642" alt="image" src="https://github.com/user-attachments/assets/afb222a8-c598-400a-9c1e-7ff38538a41a" /> <img width="300" height="642" alt="image" src="https://github.com/user-attachments/assets/4a68f1ed-e5d9-451d-be3a-076a17486a14" /> <img width="300" height="642" alt="image" src="https://github.com/user-attachments/assets/6d1d1aa4-2c53-4ba9-be48-23c977a49ae3" />
<img width="300" height="642" alt="image" src="https://github.com/user-attachments/assets/604646c9-077f-4414-803d-88d80be1e40e" /> <img width="300" height="642" alt="image" src="https://github.com/user-attachments/assets/87511f90-3a2c-43f5-aa41-598da434772e" /> <img width="300" height="642" alt="image" src="https://github.com/user-attachments/assets/5cd2bd64-cbeb-4cf6-9135-691fe6334820" />
<img width="300" height="642" alt="image" src="https://github.com/user-attachments/assets/01b8bbda-c75a-430d-9119-583017b8eba9" /> <img width="300" height="642" alt="image" src="https://github.com/user-attachments/assets/20b10122-3e56-463f-a694-71296d608764" /> <img width="300" height="642" alt="image" src="https://github.com/user-attachments/assets/4ce747fb-0866-4d0c-901a-ec98e65a3ed0" />









