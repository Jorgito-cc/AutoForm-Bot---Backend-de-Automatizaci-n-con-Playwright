const { chromium } = require('playwright');

// ⚠️ Pega aquí la URL pública de tu nuevo formulario (usa el enlace "Enviar" > "Link")
const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfQuGOn74PltlWgFW73k0WMJWydE_dsmq8NHvfpNCOgNT8Vbw/viewform?usp=header';

const N_SUBMISSIONS = 100;     // Número de veces que se enviará
const HEADLESS = false;      // false = muestra el navegador
const DELAY_MS = 1000;       // pausa entre envíos
const SUBMIT_TIMEOUT = 10000;

(async () => {
  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (let i = 0; i < N_SUBMISSIONS; i++) {
    try {
      console.log(`=== Envío ${i + 1} / ${N_SUBMISSIONS} ===`);
      await page.goto(FORM_URL, { waitUntil: 'networkidle' });

      // helper simple para elegir radio por texto visible
      async function chooseRadio(questionText, optionText) {
        const container = page.locator(`xpath=//div[contains(., "${questionText}")]`).first();
        if (await container.count() === 0) {
          console.warn(`Pregunta no encontrada: ${questionText}`);
          return;
        }
        const opt = container.locator(`text="${optionText}"`).first();
        if (await opt.count() > 0) {
          await opt.click();
          console.log(`Seleccionado "${optionText}"`);
        } else {
          console.warn(`Opción no encontrada: ${optionText}`);
        }
      }

      // --- Rellenar tu pregunta ---
      const opciones = ['2', '3'];
      const random = opciones[Math.floor(Math.random() * opciones.length)];
      await chooseRadio('cuanto es 1+1', random);

      // --- Enviar formulario ---
      const submitBtn = page.locator('text=Enviar').first();
      await submitBtn.click();
      await page.waitForTimeout(1000);

      // Esperar confirmación
      try {
        await page.waitForSelector('text=/respuesta registrada|enviad/i', { timeout: SUBMIT_TIMEOUT });
        console.log('✅ Envío confirmado.');
      } catch {
        console.warn('⚠️ No se detectó texto de confirmación (puede ser otra página).');
      }

      await page.waitForTimeout(DELAY_MS);

    } catch (err) {
      console.error('Error en envío', i + 1, err.message);
      await page.screenshot({ path: `error_envio_${i + 1}.png`, fullPage: true });
    }
  }

  await browser.close();
  console.log('🎉 Todos los envíos finalizados.');
})();
