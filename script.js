// REGISTRO
function registrar() {
let nombre = document.getElementById("regNombre").value;
let correo = document.getElementById("regCorreo").value;
let telefono = document.getElementById("regTelefono").value;
let password = document.getElementById("regPassword").value;

let password2 = document.getElementById("regPassword2").value;

if(password !== password2){
    document.getElementById("registroMensaje").innerText = "Las contraseñas no coinciden";
    return;
}

let usuario = {nombre, correo, telefono, password};
localStorage.setItem("usuario", JSON.stringify(usuario));

document.getElementById("registroMensaje").innerText = "Registro exitoso";
}

// LOGIN
function login() {
let correo = document.getElementById("loginCorreo").value;
let password = document.getElementById("loginPassword").value;

let usuario = JSON.parse(localStorage.getItem("usuario"));

if(usuario && usuario.correo === correo && usuario.password === password){
    localStorage.setItem("sesion", "activa");
    document.getElementById("loginMensaje").innerText = "Inicio exitoso";
    setTimeout(()=> window.location="dashboard.html",1000);
}else{
    document.getElementById("loginMensaje").innerText = "Datos incorrectos";
}
}

// DASHBOARD
function cargarUsuario(){
let usuario = JSON.parse(localStorage.getItem("usuario"));
if(usuario){
document.getElementById("bienvenida").innerText = "Bienvenido, " + usuario.nombre;
}
}

function logout(){
localStorage.removeItem("sesion");
window.location="login.html";
}

// CITAS PRO 

function agendarCita(){
let fecha = document.getElementById("citaFecha").value;
let hora = document.getElementById("citaHora").value;
let esp = document.getElementById("citaEspecialidad").value;

let citas = JSON.parse(localStorage.getItem("citas")) || [];
let editIndex = localStorage.getItem("editandoCita");

let msg = document.getElementById("citaMensaje");

if(editIndex !== null){
    citas[editIndex] = {fecha, hora, esp, estado:"Agendada"};
    localStorage.removeItem("editandoCita");
    msg.innerText = "Cita reagendada correctamente 🔄";
} else {
    citas.push({
        fecha, 
        hora, 
        esp, 
        estado:"Agendada",
        doctor: "Dr. Juan Pérez"
    });
    msg.innerText = "Cita agendada exitosamente ✅";
}

localStorage.setItem("citas", JSON.stringify(citas));

// limpiar formulario
document.getElementById("citaFecha").value = "";
document.getElementById("citaHora").value = "";
document.getElementById("citaEspecialidad").selectedIndex = 0;

setTimeout(()=>{
    msg.innerText = "";
},3000);

mostrarCitas();
}

function mostrarCitas(){
let citas = JSON.parse(localStorage.getItem("citas")) || [];
let lista = document.getElementById("listaCitas");
lista.innerHTML="";

citas.forEach((cita,i)=>{

let div = document.createElement("div");
div.className = "cita";

// 🔥 SI ESTÁ CANCELADA → ESTILO
if(cita.estado === "Cancelada"){
    div.classList.add("cancelada");
}

div.innerHTML = `
<div class="${cita.estado === "Cancelada" ? "estado-cancelado" : "estado-activo"}">
● ${cita.estado.toUpperCase()}
</div>

<h4>${cita.esp}</h4>

<p class="doctor">${cita.doctor || "Dr. Juan Pérez"}</p>

<p>📅 ${cita.fecha} ⏰ ${cita.hora}</p>

<div class="acciones">
${cita.estado !== "Cancelada" ? `
<button id="btnReagendar${i}" class="btn-reagendar">Reagendar</button>
<button id="btnCancelar${i}" class="btn-cancelar">Cancelar</button>
` : `
<span class="texto-cancelado">Cita cancelada</span>
`}
</div>
`;

// 🔁 REAGENDAR (SOLO SI NO ESTÁ CANCELADA)
if(cita.estado !== "Cancelada"){
div.querySelector(`#btnReagendar${i}`).onclick = function(){

    document.getElementById("formCita").classList.remove("hidden");

    document.getElementById("citaFecha").value = cita.fecha;
    document.getElementById("citaHora").value = cita.hora;
    document.getElementById("citaEspecialidad").value = cita.esp;

    localStorage.setItem("editandoCita", i);
};

// ❌ CANCELAR (NO BORRA, SOLO CAMBIA ESTADO)
div.querySelector(`#btnCancelar${i}`).onclick = function(){

    citas[i].estado = "Cancelada";

    localStorage.setItem("citas", JSON.stringify(citas));
    mostrarCitas();
};
}

lista.appendChild(div);

});
}

// BOTON CERRAR FORM
function cerrarForm(){
let form = document.getElementById("formCita");
let btn = document.getElementById("btnMostrarForm");

form.classList.add("hidden");
btn.innerText = "+ Agendar Nueva Cita";

// limpiar campos
document.getElementById("citaFecha").value = "";
document.getElementById("citaHora").value = "";
document.getElementById("citaEspecialidad").selectedIndex = 0;

localStorage.removeItem("editandoCita");
}

// AUTO CARGA
if(document.getElementById("listaCitas")){
mostrarCitas();
}

// HISTORIA DESCARGAR PDF

function descargarPDF(){

let contenido = `
<html>
<head>
<title>Historia Clínica</title>
</head>
<body>

<h2>Historia Clínica</h2>

<h3>Medicina General</h3>
<p><strong>Fecha:</strong> 2025-03-15</p>
<p><strong>Doctor:</strong> Dr. María González</p>

<p><strong>Diagnóstico:</strong> Resfriado común</p>
<p><strong>Tratamiento:</strong> Paracetamol 500mg cada 6 horas</p>

<hr>

<h3>Cardiología</h3>
<p><strong>Fecha:</strong> 2025-02-20</p>
<p><strong>Doctor:</strong> Dr. Carlos López</p>

<p><strong>Diagnóstico:</strong> Hipertensión leve</p>
<p><strong>Tratamiento:</strong> Enalapril 10mg</p>

</body>
</html>
`;

let blob = new Blob([contenido], {type:"application/pdf"});
let url = URL.createObjectURL(blob);

let a = document.createElement("a");
a.href = url;
a.download = "historia_clinica.pdf";
a.click();

document.getElementById("mensajeDescarga").innerText =
"Historia clínica descargada correctamente 📄";
}

// SOPORTE

function enviarSoporte(){

let nombre = document.getElementById("soporteNombre").value;
let correo = document.getElementById("soporteCorreo").value;
let mensaje = document.getElementById("soporteMensaje").value;

let respuesta = document.getElementById("soporteRespuesta");

// VALIDACIÓN
if(nombre === "" || correo === "" || mensaje === ""){
    respuesta.innerText = "Por favor completa todos los campos ⚠️";
    return;
}

// GUARDAR MENSAJE (SIMULACIÓN BD)
let mensajes = JSON.parse(localStorage.getItem("mensajesSoporte")) || [];

mensajes.push({
    nombre,
    correo,
    mensaje,
    fecha: new Date().toLocaleString()
});

localStorage.setItem("mensajesSoporte", JSON.stringify(mensajes));

// MENSAJE EN PANTALLA
respuesta.innerText = "Mensaje enviado correctamente ✅";

// LIMPIAR FORM
document.getElementById("soporteNombre").value = "";
document.getElementById("soporteCorreo").value = "";
document.getElementById("soporteMensaje").value = "";

// QUITAR MENSAJE DESPUÉS DE 3 SEGUNDOS
setTimeout(()=>{
    respuesta.innerText = "";
},3000);
}

// PERFIL

function cargarPerfil(){
let u = JSON.parse(localStorage.getItem("usuario"));

if(u){
document.getElementById("perfilNombreTexto").innerText = u.nombre;
document.getElementById("perfilCorreo").value = u.correo;
document.getElementById("perfilTelefono").value = u.telefono;
}
}

function guardarPerfil(){
let u = JSON.parse(localStorage.getItem("usuario"));

u.nombre = document.getElementById("perfilNombre").value;
u.correo = document.getElementById("perfilCorreo").value;
u.telefono = document.getElementById("perfilTelefono").value;

localStorage.setItem("usuario", JSON.stringify(u));

document.getElementById("perfilMensaje").innerText="Datos actualizados";
}

// TOGGLE FORM
function toggleForm(){
let form = document.getElementById("formCita");
let btn = document.getElementById("btnMostrarForm");

if(form.classList.contains("hidden")){
    form.classList.remove("hidden");
    btn.innerText = "Cerrar";
} else {
    form.classList.add("hidden");
    btn.innerText = "+ Agendar Nueva Cita";
}
}