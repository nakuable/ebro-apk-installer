// =========================================================================
// EBRO S700 & Desay SV | WebUSB Sideload Hub
// Bypass OEM installer restrictions natively in browser via WebUSB + JDWP/DEX
// =========================================================================

import { Adb } from "https://esm.sh/@yume-chan/adb";
import { AdbDaemonWebUsbDeviceManager } from "https://esm.sh/@yume-chan/adb-daemon-webusb";
import AdbWebCredentialStore from "https://esm.sh/@yume-chan/adb-credential-web";

export const DEX_HELPER_BASE64 = "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D1o9ArN/HXhLAAAAAQAAAA0AAAABAAAAKAAAAAIAAAApAAAAAQAAADQAAAACAAAAAQAxAAEAAAAAAAAAAwAAACkAAQABAAAAAQAAADMAAAABAAAAKQAAAAIAAAAoADYAAQAAADYAAAACAAAAHgAeAAEAAAABAAAAAQAAADUAAAACAAAAKQA1AAEAAAAEAAAABwAAAAAACgApABEABwApABAAAAABAAAAAgAAAAEAAAALAAAAAgAAAA0AAAABAAAAGAAAAAEAAAAbAAAAAQAAABwAAAACAAAAKAAAAAEAAAAsAAAAAwAAADQAAAAAAAAAAQAAADcAAAAGIGJ5dGVzAAkgZmxhZ3M9MHgACSBtZXNzYWdlPQAHLS1mbGFncwACMHgABjxpbml0PgACPjsAD0FQSyBub3QgZm91bmQ6IAAsQ291bGQgbm90IG9idGFpbiBDb250ZXh0IGZyb20gQWN0aXZpdHlUaHJlYWQADURFRkFVTFRfRkxBR1MAD0ZhaWx1cmUgc3RhdHVzPQABSQACSUwAA0lMSQASSU5TVEFMTF9BTExPV19URVNUACFJTlNUQUxMX0dSQU5UX1JVTlRJTUVfUEVSTUlTU0lPTlMAEElOU1RBTExfSU5URVJOQUwAGElOU1RBTExfUkVQTEFDRV9FWElTVElORwABSgADSkxJAAFMAAJMSQACTEoAA0xKTAACTEwABExMSkoAA0xMTAAXTE1vbmppU2hlbGxJbnN0YWxsZXIkMTsAK0xNb25qaVNoZWxsSW5zdGFsbGVyJExvY2FsSW50ZW50UmVjZWl2ZXIkMTsAKUxNb25qaVNoZWxsSW5zdGFsbGVyJExvY2FsSW50ZW50UmVjZWl2ZXI7ABVMTW9uamlTaGVsbEluc3RhbGxlcjsAAkxaABlMYW5kcm9pZC9jb250ZW50L0NvbnRleHQ7ACFMYW5kcm9pZC9jb250ZW50L0lJbnRlbnRSZWNlaXZlcjsAJExhbmRyb2lkL2NvbnRlbnQvSUludGVudFNlbmRlciRTdHViOwAfTGFuZHJvaWQvY29udGVudC9JSW50ZW50U2VuZGVyOwAYTGFuZHJvaWQvY29udGVudC9JbnRlbnQ7AB5MYW5kcm9pZC9jb250ZW50L0ludGVudFNlbmRlcjsALUxhbmRyb2lkL2NvbnRlbnQvcG0vUGFja2FnZUluc3RhbGxlciRTZXNzaW9uOwAzTGFuZHJvaWQvY29udGVudC9wbS9QYWNrYWdlSW5zdGFsbGVyJFNlc3Npb25QYXJhbXM7ACVMYW5kcm9pZC9jb250ZW50L3BtL1BhY2thZ2VJbnN0YWxsZXI7ACNMYW5kcm9pZC9jb250ZW50L3BtL1BhY2thZ2VNYW5hZ2VyOwATTGFuZHJvaWQvb3MvQnVuZGxlOwAUTGFuZHJvaWQvb3MvSUJpbmRlcjsAE0xhbmRyb2lkL29zL0xvb3BlcjsAIkxkYWx2aWsvYW5ub3RhdGlvbi9FbmNsb3NpbmdDbGFzczsAHkxkYWx2aWsvYW5ub3RhdGlvbi9Jbm5lckNsYXNzOwAhTGRhbHZpay9hbm5vdGF0aW9uL01lbWJlckNsYXNzZXM7AB1MZGFsdmlrL2Fubm90YXRpb24vU2lnbmF0dXJlOwAaTGRhbHZpay9hbm5vdGF0aW9uL1Rocm93czsADkxqYXZhL2lvL0ZpbGU7ABlMamF2YS9pby9GaWxlSW5wdXRTdHJlYW07ABVMamF2YS9pby9JbnB1dFN0cmVhbTsAFkxqYXZhL2lvL091dHB1dFN0cmVhbTsAFUxqYXZhL2lvL1ByaW50U3RyZWFtOwATTGphdmEvbGFuZy9Cb29sZWFuOwAYTGphdmEvbGFuZy9DaGFyU2VxdWVuY2U7ABFMamF2YS9sYW5nL0NsYXNzOwAVTGphdmEvbGFuZy9FeGNlcHRpb247ACRMamF2YS9sYW5nL0lsbGVnYWxBcmd1bWVudEV4Y2VwdGlvbjsAIUxqYXZhL2xhbmcvSWxsZWdhbFN0YXRlRXhjZXB0aW9uOwATTGphdmEvbGFuZy9JbnRlZ2VyOwAgTGphdmEvbGFuZy9JbnRlcnJ1cHRlZEV4Y2VwdGlvbjsAEExqYXZhL2xhbmcvTG9uZzsAIExqYXZhL2xhbmcvTm9TdWNoRmllbGRFeGNlcHRpb247ACFMamF2YS9sYW5nL05vU3VjaE1ldGhvZEV4Y2VwdGlvbjsAEkxqYXZhL2xhbmcvT2JqZWN0OwASTGphdmEvbGFuZy9TdHJpbmc7ABlMamF2YS9sYW5nL1N0cmluZ0J1aWxkZXI7ABJMamF2YS9sYW5nL1N5c3RlbTsAFUxqYXZhL2xhbmcvVGhyb3dhYmxlOwAfTGphdmEvbGFuZy9yZWZsZWN0L0NvbnN0cnVjdG9yOwAZTGphdmEvbGFuZy9yZWZsZWN0L0ZpZWxkOwAaTGphdmEvbGFuZy9yZWZsZWN0L01ldGhvZDsAKkxqYXZhL3V0aWwvY29uY3VycmVudC9MaW5rZWRCbG9ja2luZ1F1ZXVlOwAqTGphdmEvdXRpbC9jb25jdXJyZW50L0xpbmtlZEJsb2NraW5nUXVldWU8AB9MamF2YS91dGlsL2NvbmN1cnJlbnQvVGltZVVuaXQ7ABNMb2NhbEludGVudFJlY2VpdmVyABhNb25qaVNoZWxsSW5zdGFsbGVyLmphdmEAB1NFQ09ORFMAB1N1Y2Nlc3MABFRZUEUANFRpbWVkIG91dCB3YWl0aW5nIGZvciBQYWNrYWdlSW5zdGFsbGVyIGNvbW1pdCByZXN1bHQAPVVzYWdlOiBNb25qaVNoZWxsSW5zdGFsbGVyIDxhcGstcGF0aC1vbi1kZXZpY2U+IFstLWZsYWdzIEhFWF0AAVYAAlZJAAhWSUxMTExMTAACVkoAAlZMAANWTEkABFZMSUkAAlZaAAFaAAJaTAACW0IAEltMamF2YS9sYW5nL0NsYXNzOwATW0xqYXZhL2xhbmcvT2JqZWN0OwATW0xqYXZhL2xhbmcvU3RyaW5nOwAHYWJhbmRvbgAKYWNjZXNzJDEwMAALYWNjZXNzRmxhZ3MADWFkZFN1cHByZXNzZWQAGmFuZHJvaWQuYXBwLkFjdGl2aXR5VGhyZWFkAB9hbmRyb2lkLmNvbnRlbnQucG0uZXh0cmEuU1RBVFVTACdhbmRyb2lkLmNvbnRlbnQucG0uZXh0cmEuU1RBVFVTX01FU1NBR0UABmFwcGVuZAARYXBwbHlJbnN0YWxsRmxhZ3MABmF0dGFjaAAIYmFzZS5hcGsABWNsb3NlAAZjb21taXQADWNyZWF0ZVNlc3Npb24AE2NyZWF0ZVN5c3RlbUNvbnRleHQAEmN1cnJlbnRBcHBsaWNhdGlvbgAGZXF1YWxzAANlcnIABGV4aXQAB2Zvck5hbWUABWZzeW5jAAhnZXRDbGFzcwAWZ2V0RGVjbGFyZWRDb25zdHJ1Y3RvcgAQZ2V0RGVjbGFyZWRGaWVsZAARZ2V0RGVjbGFyZWRNZXRob2QABmdldEludAALZ2V0SW50RXh0cmEAD2dldEludGVudFNlbmRlcgAJZ2V0TWV0aG9kABNnZXRQYWNrYWdlSW5zdGFsbGVyABFnZXRQYWNrYWdlTWFuYWdlcgAJZ2V0UmVzdWx0AA5nZXRTdHJpbmdFeHRyYQANZ2V0U3VwZXJjbGFzcwAQZ2V0U3lzdGVtQ29udGV4dAAMaW5zdGFsbEZsYWdzAAZpbnZva2UABmlzRmlsZQAGbGVuZ3RoAAxtTG9jYWxTZW5kZXIAB21SZXN1bHQABG1haW4AF21vbmppOiBpbnN0YWxsIGZhaWxlZDogAA9tb25qaTogc2Vzc2lvbj0ANm1vbmppOiBzeXN0ZW1NYWluIGZhaWxlZCwgdHJ5aW5nIEFjdGl2aXR5VGhyZWFkIGN0b3I6IAA/bW9uamk6IHdhcm5pbmc6IGNvdWxkIG5vdCBzZXQgaW5zdGFsbEZsYWdzOyByZWx5aW5nIG9uIGRlZmF1bHRzAA1tb25qaTogd3JvdGUgAAhteUxvb3BlcgAEbmFtZQALbmV3SW5zdGFuY2UABW9mZmVyAAtvcGVuU2Vzc2lvbgAJb3BlbldyaXRlAANvdXQACXBhcnNlTG9uZwAEcG9sbAARcHJlcGFyZU1haW5Mb29wZXIAD3ByaW50U3RhY2tUcmFjZQAHcHJpbnRsbgAEcmVhZAAHcmVwbGFjZQAEc2VuZAANc2V0QWNjZXNzaWJsZQAPc2V0SW5zdGFsbEZsYWdzAAZzZXRJbnQAB3NldFNpemUACnN5c3RlbU1haW4ABnRoaXMkMAALdG9IZXhTdHJpbmcACHRvU3RyaW5nAAV2YWx1ZQAHdmFsdWVPZgAFd3JpdGUAnAF+fkQ4eyJiYWNrZW5kIjoiZGV4IiwiY29tcGlsYXRpb24tbW9kZSI6ImRlYnVnIiwiaGFzLWNoZWNrc3VtcyI6ZmFsc2UsIm1pbi1hcGkiOjI2LCJzaGEtMSI6ImZhY2VkZjQxYmJkMjhiNTYzZDFlOWUwOWM1ZjcyZDdjNWNhNTk4ZDUiLCJ2ZXJzaW9uIjoiOC4yLjItZGV2In0AAhMBqQEYBQIUAmUkCBCTAR4CEwGpARgEAhQCZQQAkwEeAhcBqQEcARggAhcBqQEcARgkAhYBqQEcAxdMFyUXBwIUAmUEGpMBF04CFQGpARwBGAQAAQEBAJAgAICABJQTAQGwEwACAwIBEgESAoKABIAVAYCgBLQVAYgg6BQFAJwUAQDkEwUABAADGgEaARoBGgEaB4GABJQYAQqsGAEKzBUBCewZBSQWAQQEJAABBBAEAgAAAAIAAABHHwAATh8AAAIAAABYHwAAXx8AAAEAAABoHwAAAQAAAHEfAAABAAAAeh8AAAIAAABHHwAAhx8AAAEAAACRHwAA/B8AAAAAAAAAAAAAAAAAAAggAAAAAAAAAAAAAAAAAAAsIAAAAQAAAAIAAAAAAAAAAgAAACQgAAAFAAAAFCAAAAYAAAAcIAAAOCAAAAAAAAACAAAAAAAAAAgAAAAUIAAACQAAABQgAAARAAAAAAAAAAEAAAAAAAAAAQAAAK0AAABwAAAAAgAAADgAAAAkAwAAAwAAADQAAAAEBAAABAAAAA0AAAB0BgAABQAAAEcAAADcBgAABgAAAAQAAAAUCQAAASAAAAsAAACUCQAAAyAAAAoAAADREAAAARAAABsAAACgEQAAAiAAAK0AAACKEgAABCAAAAkAAABHHwAAACAAAAMAAACaHwAABSAAAAEAAADsHwAAAxAAAAcAAAD8HwAABiAAAAQAAABAIAAAABAAAAEAAACoIAAA";

// UI Elements
const btnConnect = document.getElementById("btn-connect");
const statusPill = document.getElementById("status-pill");
const statusText = document.getElementById("status-text");
const deviceDetails = document.getElementById("device-details");
const valModel = document.getElementById("val-model");
const valFirmware = document.getElementById("val-firmware");
const valSoC = document.getElementById("val-soc");
const valAndroid = document.getElementById("val-android");

const terminal = document.getElementById("terminal-body");
const btnClearLogs = document.getElementById("btn-clear-logs");

const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const progressPercent = document.getElementById("progress-percent");

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const btnBrowse = document.getElementById("btn-browse");

const inputGithubUrl = document.getElementById("input-github-url");
const btnInstallGithub = document.getElementById("btn-install-github");

// State
let currentAdb = null;
let credentialStore = null;
let isBusy = false;

// Logger
export function log(message, type = "info") {
  const line = document.createElement("div");
  line.className = `log-line log-${type}`;
  const time = new Date().toLocaleTimeString();
  line.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-msg">${escapeHtml(message)}</span>`;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

btnClearLogs.addEventListener("click", () => {
  terminal.innerHTML = "";
  log("Consola reiniciada.", "info");
});

function setProgress(percent, label = "") {
  progressContainer.style.display = "block";
  progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  progressPercent.textContent = `${Math.round(percent)}%`;
  if (label) progressText.textContent = label;
}

function hideProgress() {
  progressContainer.style.display = "none";
  progressBar.style.width = "0%";
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Ensure DEX Helper is uploaded to /data/local/tmp/
async function ensureDexHelper(adb) {
  log("Verificando dex_shell_helper en el sistema del coche...");
  try {
    const check = await adb.subprocess.noneProtocol.spawnWaitText("ls -l /data/local/tmp/dex_shell_helper.dex");
    if (check.includes("dex_shell_helper.dex") && check.includes("8568")) {
      log("dex_shell_helper.dex ya está presente en el coche.", "success");
      return;
    }
  } catch (e) {
    // File missing, proceed to push
  }

  log("Inyectando dex_shell_helper.dex en /data/local/tmp/...");
  const dexBytes = base64ToUint8Array(DEX_HELPER_BASE64);
  const sync = await adb.sync();
  try {
    const blob = new Blob([dexBytes]);
    await sync.write({
      filename: "/data/local/tmp/dex_shell_helper.dex",
      file: blob.stream(),
    });
  } finally {
    await sync.dispose();
  }

  await adb.subprocess.noneProtocol.spawnWaitText("chmod 644 /data/local/tmp/dex_shell_helper.dex");
  log("dex_shell_helper.dex inyectado y permisos 644 configurados.", "success");
}

// Push File with Progress
async function pushFile(adb, remotePath, fileOrBlob, label = "Transfiriendo") {
  const total = fileOrBlob.size;
  let sent = 0;
  setProgress(0, `${label} (0 / ${formatBytes(total)})...`);

  const progressStream = fileOrBlob.stream().pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        sent += chunk.byteLength;
        const pct = (sent / total) * 100;
        setProgress(pct, `${label} (${formatBytes(sent)} / ${formatBytes(total)})...`);
        controller.enqueue(chunk);
      },
    })
  );

  const sync = await adb.sync();
  try {
    await sync.write({
      filename: remotePath,
      file: progressStream,
    });
  } finally {
    await sync.dispose();
  }
  setProgress(100, "Transferencia completada.");
}

// Install APK using Native Shell Bypass
export async function installApk(fileOrBlob, appName = "Aplicación") {
  if (!currentAdb) {
    log("Error: Primero debes conectar el coche con el botón 'Conectar Coche por USB'.", "error");
    alert("Por favor, conecta primero el coche mediante USB.");
    return false;
  }
  if (isBusy) {
    log("Hay otra operación en curso. Espera a que termine.", "warning");
    return false;
  }

  isBusy = true;
  const tempRemoteApk = "/data/local/tmp/web_sideload.apk";

  try {
    log(`Iniciando instalación de: ${appName} (${formatBytes(fileOrBlob.size)})`, "info");
    await ensureDexHelper(currentAdb);

    log("Transfiriendo archivo APK al coche...");
    await pushFile(currentAdb, tempRemoteApk, fileOrBlob, `Subiendo ${appName}`);

    await currentAdb.subprocess.noneProtocol.spawnWaitText(`chmod 644 ${tempRemoteApk}`);

    log("Ejecutando bypass de instalación en segundo plano (MonjiShellInstaller flags 0x116)...", "info");
    const installCmd = `CLASSPATH=/data/local/tmp/dex_shell_helper.dex app_process /data/local/tmp MonjiShellInstaller ${tempRemoteApk} --flags 0x116`;
    const result = await currentAdb.subprocess.noneProtocol.spawnWaitText(installCmd);
    log(`Respuesta del instalador: ${result.trim()}`, result.includes("Success") ? "success" : "warning");

    if (result.includes("Success")) {
      log(`🎉 ¡${appName} instalado con éxito en el EBRO S700!`, "success");
      alert(`🎉 ¡${appName} se ha instalado correctamente en la pantalla del coche!`);
    } else {
      log(`Fallo en la instalación: ${result}`, "error");
      alert(`La instalación no devolvió 'Success':\n${result}`);
    }

    // Cleanup
    await currentAdb.subprocess.noneProtocol.spawnWaitText(`rm -f ${tempRemoteApk}`);
    log("Archivos temporales limpiados.", "info");
    return true;
  } catch (err) {
    log(`Error durante la instalación: ${err.message || err}`, "error");
    console.error(err);
    alert(`Error al instalar: ${err.message || err}`);
    return false;
  } finally {
    hideProgress();
    isBusy = false;
  }
}

// Connect USB
async function connectUsb() {
  if (!navigator.usb) {
    const msg = "Tu navegador no soporta WebUSB. Usa Google Chrome o Microsoft Edge en Windows, Mac o Linux.";
    log(msg, "error");
    alert(msg);
    return;
  }

  try {
    log("Iniciando solicitud WebUSB...");
    log("Selecciona el dispositivo 'DesaySV' o 'Android' en el cuadro de diálogo del navegador.", "info");

    const manager = AdbDaemonWebUsbDeviceManager.BROWSER;
    const device = await manager.requestDevice();
    if (!device) {
      log("No se seleccionó ningún dispositivo USB.", "warning");
      return;
    }

    log(`Dispositivo seleccionado: ${device.raw?.productName || "Desay SV Multimedia"}`);
    log("Conectando al daemon ADB por USB...");
    const connection = await device.connect();

    if (!credentialStore) {
      credentialStore = new AdbWebCredentialStore();
    }

    log("Autenticando claves RSA con el coche...");
    currentAdb = await Adb.authenticate({
      connection,
      credentialStore,
    });

    log("✅ ¡Conectado con éxito al sistema multimedia!", "success");

    // Read properties
    statusPill.className = "status-pill connected";
    statusText.textContent = "Conectado al EBRO";
    btnConnect.textContent = "✔ Coche Conectado";
    btnConnect.disabled = true;
    deviceDetails.style.display = "grid";

    try {
      const model = (await currentAdb.subprocess.noneProtocol.spawnWaitText("getprop ro.product.model")).trim();
      const firmware = (await currentAdb.subprocess.noneProtocol.spawnWaitText("getprop ro.build.display.id")).trim();
      const platform = (await currentAdb.subprocess.noneProtocol.spawnWaitText("getprop ro.board.platform")).trim();
      const android = (await currentAdb.subprocess.noneProtocol.spawnWaitText("getprop ro.build.version.release")).trim();

      valModel.textContent = model || "EBRO S700 / Desay SV";
      valFirmware.textContent = firmware || "Desay SV Platform";
      valSoC.textContent = platform ? `${platform} (Snapdragon 8155)` : "Qualcomm 8155";
      valAndroid.textContent = `Android ${android || "11"}`;

      log(`Vehículo detectado: ${model} | Firmware: ${firmware} | SoC: ${platform} | Android ${android}`, "info");
    } catch (propErr) {
      log("Conectado (no se pudieron leer algunas propiedades): " + propErr.message, "warning");
    }

    await ensureDexHelper(currentAdb);
  } catch (err) {
    log(`Error al conectar por WebUSB: ${err.message || err}`, "error");
    console.error(err);
    if (String(err).includes("claim") || String(err).includes("exclusive") || String(err).includes("busy")) {
      alert("El puerto USB está ocupado por otro programa (como 'adb.exe' en la consola de tu PC).\nCierra la consola o desconecta/reconecta el cable USB.");
    } else {
      alert("No se pudo conectar al coche por WebUSB:\n" + (err.message || err));
    }
  }
}

btnConnect.addEventListener("click", connectUsb);

// Drag and Drop
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-hover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-hover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-hover");
  if (e.dataTransfer.files.length > 0) {
    handleFile(e.dataTransfer.files[0]);
  }
});

btnBrowse.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

function handleFile(file) {
  if (!file.name.toLowerCase().endsWith(".apk")) {
    alert("El archivo seleccionado no es un archivo .apk válido.");
    return;
  }
  if (confirm(`¿Deseas instalar '${file.name}' (${formatBytes(file.size)}) en el coche?`)) {
    installApk(file, file.name);
  }
}

// GitHub Releases Installer
btnInstallGithub.addEventListener("click", async () => {
  let url = inputGithubUrl.value.trim();
  if (!url) {
    alert("Introduce la URL de un repositorio de GitHub (ej: yuliskov/SmartTube o enlace directo a un .apk).");
    return;
  }

  // Direct APK URL
  if (url.toLowerCase().endsWith(".apk")) {
    log(`Descargando APK directo desde: ${url}...`, "info");
    try {
      setProgress(20, "Descargando APK...");
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const blob = await res.blob();
      const filename = url.split("/").pop() || "github_app.apk";
      await installApk(blob, filename);
    } catch (e) {
      log(`Error al descargar APK: ${e.message}`, "error");
      alert(`No se pudo descargar el APK directo:\n${e.message}`);
    } finally {
      hideProgress();
    }
    return;
  }

  // GitHub Repo (e.g. yuliskov/SmartTube or https://github.com/yuliskov/SmartTube)
  let repo = url;
  if (repo.includes("github.com/")) {
    repo = repo.split("github.com/")[1].split("/").slice(0, 2).join("/");
  }

  log(`Consultando última versión de GitHub para: ${repo}...`, "info");
  try {
    setProgress(30, "Consultando API de GitHub...");
    const apiUrl = `https://api.github.com/repos/${repo}/releases/latest`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Repositorio no encontrado o límite de API alcanzado (HTTP ${res.status})`);
    const releaseData = await res.json();

    const apkAssets = (releaseData.assets || []).filter((a) => a.name.toLowerCase().endsWith(".apk"));
    if (apkAssets.length === 0) {
      throw new Error("No se encontraron archivos .apk en la última release de este repositorio.");
    }

    // Prioritize arm64-v8a or universal
    let targetAsset = apkAssets.find((a) => a.name.includes("arm64") || a.name.includes("v8a")) || apkAssets[0];
    log(`Encontrado asset compatible: ${targetAsset.name} (${formatBytes(targetAsset.size)})`, "success");

    setProgress(50, `Descargando ${targetAsset.name}...`);
    const apkRes = await fetch(targetAsset.browser_download_url);
    if (!apkRes.ok) throw new Error(`Error descargando el APK (HTTP ${apkRes.status})`);
    const apkBlob = await apkRes.blob();

    await installApk(apkBlob, targetAsset.name);
  } catch (err) {
    log(`Error al obtener release de GitHub: ${err.message}`, "error");
    alert(`No se pudo obtener el APK de GitHub:\n${err.message}`);
  } finally {
    hideProgress();
  }
});

// Community Catalog Install Buttons
document.querySelectorAll(".btn-catalog-install").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const repo = btn.getAttribute("data-repo");
    const directUrl = btn.getAttribute("data-url");
    const appName = btn.getAttribute("data-name");

    if (directUrl) {
      log(`Descargando ${appName}...`, "info");
      try {
        setProgress(30, `Descargando ${appName}...`);
        const res = await fetch(directUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        await installApk(blob, appName);
      } catch (e) {
        log(`Error al descargar ${appName}: ${e.message}`, "error");
        alert(`Error al descargar ${appName}:\n${e.message}`);
      } finally {
        hideProgress();
      }
    } else if (repo) {
      inputGithubUrl.value = repo;
      btnInstallGithub.click();
    }
  });
});