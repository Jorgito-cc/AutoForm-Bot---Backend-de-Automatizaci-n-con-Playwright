// fill_form_playwright.js — versión final 100% simulada (sin navegador ni Playwright)
// 🚀 Compatible con Railway y entornos sin Chromium.

// 📥 Argumentos: [formUrl, cantidad]
const args = process.argv.slice(2);
const FORM_URL =
  args[0] ||
  "https://docs.google.com/forms/d/e/1FAIpQLSeeCjfRO8QhykI_xXNCW8diQNoJkNj8oGVSs1C2OI3x7aXAjQ/viewform?usp=header";
const N_SUBMISSIONS = parseInt(args[1]) || 1;

// --- Datos de ejemplo / muestras para randomizar ---
const emails = [
  "test1@example.com",
  "test2@example.com",
  "test3@example.com",
  "prueba.usuario+1@gmail.com",
];
const edades = ["18-25", "26-35", "36-45", "46 años o más"];
const generos = ["Femenino", "Masculino", "Prefiero no decirlo"];
const departamentos = [
  "Santa Cruz",
  "Beni",
  "Pando",
  "Cochabamba",
  "Chuquisaca",
  "Tarija",
  "La Paz",
  "Potosí",
  "Oruro",
  "Extranjero",
];
const ocupaciones = [
  "Estudiante",
  "Trabajador/a independiente",
  "Empleado/a público o privado",
  "Productor/a artesanal",
  "Jubilado/a",
  "Ama de casa",
];
const ingresos = ["Bajo", "Medio", "Medio alto", "Alto"];
const dispositivos = ["Celular", "Computadora / Laptop", "Tablet"];
const importanciaVista = [
  "Poco importante",
  "Nada importante",
  "Importante",
  "Muy importante",
];
const conexion = [
  "Muy intermitente / solo datos móviles",
  "Baja (lenta o intermitente)",
  "Media (estable, velocidad moderada)",
  "Alta (estable y rápida)",
];
const frecuencia = ["Nunca", "Rara vez", "A veces", "Seguido", "Muy seguido"];
const confianzaFactores = [
  "Opiniones de otros usuarios",
  "Fotos reales de productos",
  "Presencia en redes sociales",
  "Datos claros de contacto",
];
const aspectosNegativos = [
  "Lento al cargar",
  "Difícil de navegar",
  "Demasiado texto",
  "Colores o tipografía incómodos",
  "Falta de información",
];
const plataformas = [
  "TikTok",
  "Facebook Marketplace",
  "WhatsApp / WhatsApp Business",
  "Instagram (posts o tiendas)",
  "Tienda online (sitio web de una marca)",
  "Apps de delivery/marketplace (PedidosYa, Glovo, etc.)",
  "Ferias/mercados virtuales",
  "No he comprado online",
];
const pagos = [
  "Transferencia bancaria",
  "Pago por QR",
  "Tarjeta de débito/crédito",
  "Pago contra entrega",
];
const primeraPantalla = [
  "Productos destacados",
  "Información del proyecto o marca",
  "Ofertas y promociones",
  "Categorías claras de productos",
];
const interesTradicional = [
  "Muy interesada",
  "Interesada",
  "Indiferente",
  "Poco interesada",
  "Nada interesada",
];
const tiposProductos = [
  "Cosmética natural",
  "Medicina tradicional",
  "Productos de alimento (totaí, posoé, miel, etc.)",
  "Artesanías",
];
const motivos = [
  "Apoyar a las productoras locales",
  "Ahorro de tiempo y comodidad",
  "Dificultad para conseguirlos en mi ciudad",
  "Información sobre el producto y su origen",
  "Precio o promociones",
];
const valores = [
  "Tradición cultural",
  "Calidad artesanal",
  "Sostenibilidad ambiental",
  "Apoyo a la economía local",
  "Precio accesible",
];
const preocupaciones = [
  "Que el producto no sea auténtico",
  "Que el pago no sea seguro",
  "Que el envío sea lento o costoso",
  "Que el producto no sea de buena calidad",
  "Que no haya información suficiente",
];
const entregas = [
  "Envío a domicilio a cualquier ciudad del país",
  "Retiro en un punto de entrega local",
  "Entrega solo en ciudades principales",
  "Envío por correo nacional",
];
const contenidoInfluye = [
  "Publicaciones de redes sociales",
  "Recomendaciones de influencers o creadores locales",
  "Opiniones y reseñas de otros usuarios",
  "Videos demostrativos o tutoriales",
  "Publicidad pagada",
];
const conocePesoe = [
  "Sí, lo conozco y lo he utilizado",
  "Sí, lo conozco pero no lo he utilizado",
  "He escuchado hablar de él",
  "No lo conozco, pero me gustaría saber más",
  "No lo conozco y no me interesa",
];

// --- Helpers ---
function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickN(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

// --- Modo simulación ---
(async () => {
  console.log("🧩 Modo simulación (sin abrir Chromium)");
  console.log(`🔗 URL: ${FORM_URL}`);
  console.log(`🧮 Envíos simulados: ${N_SUBMISSIONS}\n`);

  for (let i = 1; i <= N_SUBMISSIONS; i++) {
    console.log(`📤 Simulando envío ${i}/${N_SUBMISSIONS}...`);

    const registro = {
      email: rand(emails),
      edad: rand(edades),
      genero: rand(generos),
      departamento: rand(departamentos),
      ocupacion: rand(ocupaciones),
      ingreso: rand(ingresos),
      dispositivo: rand(dispositivos),
      importancia: rand(importanciaVista),
      conexion: rand(conexion),
      frecuencia: rand(frecuencia),
      confianza: pickN(confianzaFactores, 2),
      aspectos: pickN(aspectosNegativos, 3),
      plataformas: pickN(plataformas, 2),
      pago: rand(pagos),
      primeraPantalla: rand(primeraPantalla),
      interesTradicional: rand(interesTradicional),
      tiposProductos: pickN(tiposProductos, 2),
      motivos: pickN(motivos, 3),
      valores: pickN(valores, 2),
      preocupaciones: pickN(preocupaciones, 2),
      entrega: rand(entregas),
      contenidoInfluye: rand(contenidoInfluye),
      conocePesoe: rand(conocePesoe),
      timestamp: new Date().toISOString(),
    };

    console.log("📋 Datos generados:", registro);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Espera 1 seg
    console.log(`✅ Envío ${i} completado.\n`);
  }

  console.log("🏁 Simulación finalizada correctamente (sin navegador).");
})();
