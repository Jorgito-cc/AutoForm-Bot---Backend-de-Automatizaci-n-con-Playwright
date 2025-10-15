// fill_form_playwright.js
// Node.js + Playwright script para rellenar Google Forms repetidamente (pruebas).
// Ajusta N_SUBMISSIONS, HEADLESS, DELAY_MS y los arreglos de datos según necesites.

//const { chromium } = require('playwright');
import { chromium } from "playwright";

//const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeeCjfRO8QhykI_xXNCW8diQNoJkNj8oGVSs1C2OI3x7aXAjQ/viewform?usp=header';


//const N_SUBMISSIONS = 150;      // número de envíos de prueba


const args = process.argv.slice(2);
const FORM_URL = args[0] || "https://docs.google.com/forms/..."; // valor por defecto
const N_SUBMISSIONS = parseInt(args[1]) || 1; // cantidad dinámica

const HEADLESS = true;         // false para ver la ejecución en pantalla
const DELAY_MS = 1000;         // pausa entre envíos (ms)
const SUBMIT_TIMEOUT = 15000;  // tiempo máximo para esperar el envío (ms)

// --- Datos de ejemplo / muestras para randomizar ---
const emails = [
  'test1@example.com', 'test2@example.com', 'test3@example.com',
  'prueba.usuario+1@gmail.com'
];

const edades = ['18-25','26-35','36-45','46 años o más'];
const generos = ['femenino','Masculino','Prefiero no decirlo'];
const departamentos = ['Santa Cruz','Beni','Pando','Cochabamba','Chuquisaca','Tarija','La Paz','Potosi','Oruro','Extranjero'];
const ocupaciones = ['Estudiante','Trabajador/a  independiente','Empleado /a público o privado','Productor/a artesanal','Jubilado/a','Ama de casa'];
const ingresos = ['Bajo','Medio','Medio alto','Alto'];
const dispositivos = ['Celular','Computadora / Lapto','Tablet'];
const importanciaVista = ['Poco importante','Nada importante','Importante','Muy importante'];
const conexion = ['Muy intermitente / solo datos móviles','Baja (lenta o intermitente)','Media (estable, velocidad moderada)','Alta (estable y rápida)'];
const frecuencia = ['Nunca','Rara vez','A veces','Seguido','Muy seguido'];
const confianzaFactores = ['Opiniones de otros usuarios','Fotos reales de productos','Presencia en redes sociales','Datos claros de contacto'];
const aspectosNegativos = ['Lento al cargar','Difícil de navegar','Demasiado texto','Colores o tipografía incómodos','Falta de información'];
const plataformas = ['TikTok','Facebook Marketplace','WhatsApp / WhatsApp Business','Instagram (posts o tiendas)','Tienda online (sitio web de una marca)','Apps de delivery/marketplace (PedidosYa, Glovo, etc.)','Ferias/mercados virtuales','No he comprado online'];
const pagos = ['Transferencia bancaria','Pago por QR','Tarjeta de débito/crédito','Pago contra entrega'];
const primeraPantalla = ['Productos destacados','Información del proyecto o marca','Ofertas y promociónes','Categorias claras de productos.'];
const interesTradicional = ['Muy interesada','Interesada','Indiferente','Poco interesada','Nada interesada'];
const tiposProductos = ['Cosmetica natural','Medicina tradicional','Productos de alimento (totaí, posoé, miel, etc).','Artesanías'];
const motivos = ['Apoyar a las productoras locales','Ahorro de tiempo y comodidad','Dificultad para conseguirlos en mi ciudad','Información sobre el producto y su origen','Precio o promociones'];
const valores = ['Tradición cultural','Calidad artesanal','Sostenibilidad ambiental','Apoyo a la economía local','Precio accesible.'];
const preocupaciones = ['Que el producto no sea auténtico','Que el pago no sea seguro','Que el envío sea lento o costoso','Que el producto no sea de buena calidad','Que no haya información suficiente'];
const entregas = ['Envío a domicilio a cualquier ciudad del país','Retiro en un punto de entrega local','Entrega solo en ciudades principales','Envío por correo nacional'];
const contenidoInfluye = ['Publicaciones de redes sociales','Recomendaciones de influencers o creadores locales','Opiniones y reseñas de otros usuarios','Videos demostrativos o tutoriales','Publicidad pagada'];
const conocePesoe = ['Sí, lo conozco y lo he utilizado','Sí, lo conozco pero no lo he utilizado','He escuchado hablar de él','No lo conozco, pero me gustaría saber más','No lo conozco y no me interesa'];

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function pickN(arr, n){ // pick up to n distinct random values
  const copy = [...arr];
  const out = [];
  for(let i=0;i<n && copy.length>0;i++){
    const idx = Math.floor(Math.random()*copy.length);
    out.push(copy.splice(idx,1)[0]);
  }
  return out;
}

(async () => {
  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (let i = 0; i < N_SUBMISSIONS; i++){
    try {
      console.log(`=== Envío ${i+1} / ${N_SUBMISSIONS} ===`);
      await page.goto(FORM_URL, { waitUntil: 'networkidle' });

      // --- Ejemplo de cómo rellenar: Aproximo los labels usando el texto de tu pregunta ---
      // IMPORTANTE: Si tu formulario usa textos ligeramente distintos (acentos, mayúsculas),
      // ajusta las constantes con el aria-label exacto que muestra el DOM del form.

      // Helper para llenar input text por aria-label
      async function fillTextByLabel(label, value){
        const sel = `input[aria-label="${label}"], textarea[aria-label="${label}"], div[aria-label="${label}"] input`;
        const el = await page.$(sel);
        if(el){
          await el.fill(value.toString());
          return true;
        } else {
          // intentar encontrar por placeholder o por label visible
          const alt = await page.locator(`text=${label}`).first();
          if(await alt.count() > 0){
            // nada garantizado; fallback: ignorar
            return false;
          }
          return false;
        }
      }

      // Helper para elegir radio por texto de opción (busca el botón con la etiqueta visible)
      async function chooseRadio(questionText, optionText){
        // Encuentra la sección (contener) por el texto exacto de la pregunta
        const container = page.locator(`xpath=//div[contains(., "${questionText}")]`).first();
        if(await container.count() === 0) return false;
        // dentro del container, busca la etiqueta de opción mediante texto y click
        const opt = container.locator(`text="${optionText}"`).first();
        if(await opt.count() > 0){
          await opt.click();
          return true;
        }
        return false;
      }

      // Helper para checkboxes: click en hasta N opciones por texto
      async function checkOptions(questionText, optionTexts){
        const container = page.locator(`xpath=//div[contains(., "${questionText}")]`).first();
        if(await container.count() === 0) return false;
        for(const t of optionTexts){
          const opt = container.locator(`text="${t}"`).first();
          if(await opt.count() > 0){
            await opt.click();
            await page.waitForTimeout(150);
          }
        }
        return true;
      }

      // --- Rellenamos con datos aleatorios de ejemplo ---
      // (1) Edad: radio
      await chooseRadio('¿Cuál es tu rango de edad?', rand(edades));

      // (2) Género:
      await chooseRadio('¿Cuál es tu género?', rand(generos));

      // (3) Dónde vives:
      await chooseRadio('¿Dónde vives actualmente?', rand(departamentos));

      // (4) Ocupación:
      await chooseRadio('¿Cuál es su ocupación actual?', rand(ocupaciones));

      // (5) Nivel de ingresos mensuales:
      await chooseRadio('Nivel de ingresos mensuales', rand(ingresos));

      // (6) Dispositivo:
      await chooseRadio('¿Desde que dispositivo sueles navegar o comprar en línea?', rand(dispositivos));

      // (7) Importancia que funcione en dispositivo:
      await chooseRadio('¿Qué tan importante considera  que el sitio se vea bien y funcione correctamente en su dispositivo?', rand(importanciaVista));

      // (8) Calidad de conexión:
      await chooseRadio('¿Calidad de tu conexión a internet (según tu experiencia)?', rand(conexion));

      // (9) Frecuencia de compras:
      await chooseRadio('¿Con que frecuencias realiza compras en líneas?', rand(frecuencia));

      // (10) Factores que generan confianza (hasta 2): checkbox
      await checkOptions('¿Qué factores le generan confianza al comprar en un sitio web?', pickN(confianzaFactores, 2));

      // (11) Aspectos que desagradan (hasta 3): checkbox
      await checkOptions('¿Qué aspectos le desagradan o dificultan el uso de un sitio web?', pickN(aspectosNegativos, 3));

      // (12) Plataformas (multi): checkbox
      await checkOptions('¿En qué plataformas digitales suele realizar compras o buscar productos?', pickN(plataformas, 2));

      // (13) Forma de pago:
      await chooseRadio('¿Qué forma de pago prefiere al comprar en línea?', rand(pagos));

      // (14) Qué espera encontrar en la primera pantalla:
await chooseRadio('Cuando visita una tienda en línea', rand(primeraPantalla));

      // (15) Interés por productos tradicionales:
      await chooseRadio('¿Qué tanto te interesan los productos tradicionales (totaí, pesoé, medicina tradicional) para comprar en línea?', rand(interesTradicional));

      // (16) Tipo de productos (hasta 2):
      await checkOptions('¿Qué tipo de productos naturales o Artesanales les interesa comprar en línea?', pickN(tiposProductos, 2));

      // (17) Motivos para comprar (hasta 3):
      await checkOptions('¿Cuál sería tu principal motivo para comprar estos productos online?', pickN(motivos, 3));

      // (18) Valores asociados:
      await checkOptions('¿Qué valores asocia a los productos hechos por mujeres indígenas?', pickN(valores, 2));

      // (19) Preocupaciones (hasta 2):
      await checkOptions('¿Qué te preocupa más al comprar productos tradicionales por internet?', pickN(preocupaciones, 2));

      // (20) Tipo de entrega:
      await chooseRadio('¿Qué tipo de entrega prefieres para estos productos?', rand(entregas));

      // (21) Contenido que influye:
      await chooseRadio('¿Qué tipo de contenido digital le influye más para decidir una compra?', rand(contenidoInfluye));

      // (22) Conoce pesoé:
      await chooseRadio('¿Conoce o ha utilizado el producto natural llamado pesoé?', rand(conocePesoe));

      // Opcional: correo electrónico si existe una pregunta "Correo electrónico" o similar
      // Ajusta el label si tu form dice "Correo electrónico" u "Email" o "Correo".
      const possibleEmailLabels = ['Correo electrónico','Correo electronico','Email','Dirección de correo'];
      let emailSet = false;
      for(const lab of possibleEmailLabels){
        const picked = await fillTextByLabel(lab, rand(emails));
        if(picked){ emailSet = true; break; }
      }
      if(emailSet) console.log('Email rellenado');

      // --- Enviar ---
      // Botón "Enviar" suele tener texto 'Enviar' o 'Submit' (español: Enviar)
      const submitBtn = page.locator('xpath=//div[contains(@role,"button") and (normalize-space()="Enviar" or normalize-space()="Submit") ]').first();
      if (await submitBtn.count() > 0) {
        await submitBtn.click();
      } else {
        // alternativa: buscar botón por texto
        const btnAlt = page.locator('text=Enviar').first();
        if (await btnAlt.count() > 0) await btnAlt.click();
        else {
          console.warn('No se encontró botón "Enviar" — intenta ajustar el selector.');
        }
      }

      // Esperar confirmación de envío: aparece texto tipo "Tu respuesta ha sido registrada."
      try {
        await page.waitForTimeout(1000);
await page.waitForSelector('text=/Gracias por participar|Tu respuesta|registrad|enviad/i', {
  timeout: SUBMIT_TIMEOUT,
});
        console.log('Envío confirmado (texto "Tu respuesta" detectado).');
      } catch (e) {
        // fallback: esperar unos segundos y seguir
        console.warn('No detectada confirmación textual. Continuando...');
      }

      // Espera entre envíos
      await page.waitForTimeout(DELAY_MS);

    } catch (err) {
      console.error('Error en envío', i+1, err.message);
      await page.screenshot({ path: `error_subida_${i+1}.png`, fullPage: true });
    }
  }

  await browser.close();
  console.log('Todos los envíos finalizados.');
})();