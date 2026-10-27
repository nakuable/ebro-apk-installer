// =========================================================================
// EBRO S700 & Desay SV | WebUSB Sideload Hub
// Bypass OEM installer restrictions natively in browser via WebUSB + JDWP/DEX
// =========================================================================

import { Adb, AdbDaemonTransport } from "https://esm.sh/@yume-chan/adb@2.6.4";
import { AdbDaemonWebUsbDeviceManager } from "https://esm.sh/@yume-chan/adb-daemon-webusb@2.3.2?deps=@yume-chan/adb@2.6.4,@yume-chan/stream-extra@2.6.1";
import AdbWebCredentialStore from "https://esm.sh/@yume-chan/adb-credential-web@2.1.0?deps=@yume-chan/adb@2.6.4,@yume-chan/stream-extra@2.6.1";

export const DEX_HELPER_BASE64 = "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D1o9ArN/HXhLAAAAAQAAAA0AAAABAAAAKAAAAAIAAAApAAAAAQAAADQAAAACAAAAAQAxAAEAAAAAAAAAAwAAACkAAQABAAAAAQAAADMAAAABAAAAKQAAAAIAAAAoADYAAQAAADYAAAACAAAAHgAeAAEAAAABAAAAAQAAADUAAAACAAAAKQA1AAEAAAAEAAAABwAAAAAACgApABEABwApABAAAAABAAAAAgAAAAEAAAALAAAAAgAAAA0AAAABAAAAGAAAAAEAAAAbAAAAAQAAABwAAAACAAAAKAAAAAEAAAAsAAAAAwAAADQAAAAAAAAAAQAAADcAAAAGIGJ5dGVzAAkgZmxhZ3M9MHgACSBtZXNzYWdlPQAHLS1mbGFncwACMHgABjxpbml0PgACPjsAD0FQSyBub3QgZm91bmQ6IAAsQ291bGQgbm90IG9idGFpbiBDb250ZXh0IGZyb20gQWN0aXZpdHlUaHJlYWQADURFRkFVTFRfRkxBR1MAD0ZhaWx1cmUgc3RhdHVzPQABSQACSUwAA0lMSQASSU5TVEFMTF9BTExPV19URVNUACFJTlNUQUxMX0dSQU5UX1JVTlRJTUVfUEVSTUlTU0lPTlMAEElOU1RBTExfSU5URVJOQUwAGElOU1RBTExfUkVQTEFDRV9FWElTVElORwABSgADSkxJAAFMAAJMSQACTEoAA0xKTAACTEwABExMSkoAA0xMTAAXTE1vbmppU2hlbGxJbnN0YWxsZXIkMTsAK0xNb25qaVNoZWxsSW5zdGFsbGVyJExvY2FsSW50ZW50UmVjZWl2ZXIkMTsAKUxNb25qaVNoZWxsSW5zdGFsbGVyJExvY2FsSW50ZW50UmVjZWl2ZXI7ABVMTW9uamlTaGVsbEluc3RhbGxlcjsAAkxaABlMYW5kcm9pZC9jb250ZW50L0NvbnRleHQ7ACFMYW5kcm9pZC9jb250ZW50L0lJbnRlbnRSZWNlaXZlcjsAJExhbmRyb2lkL2NvbnRlbnQvSUludGVudFNlbmRlciRTdHViOwAfTGFuZHJvaWQvY29udGVudC9JSW50ZW50U2VuZGVyOwAYTGFuZHJvaWQvY29udGVudC9JbnRlbnQ7AB5MYW5kcm9pZC9jb250ZW50L0ludGVudFNlbmRlcjsALUxhbmRyb2lkL2NvbnRlbnQvcG0vUGFja2FnZUluc3RhbGxlciRTZXNzaW9uOwAzTGFuZHJvaWQvY29udGVudC9wbS9QYWNrYWdlSW5zdGFsbGVyJFNlc3Npb25QYXJhbXM7ACVMYW5kcm9pZC9jb250ZW50L3BtL1BhY2thZ2VJbnN0YWxsZXI7ACNMYW5kcm9pZC9jb250ZW50L3BtL1BhY2thZ2VNYW5hZ2VyOwATTGFuZHJvaWQvb3MvQnVuZGxlOwAUTGFuZHJvaWQvb3MvSUJpbmRlcjsAE0xhbmRyb2lkL29zL0xvb3BlcjsAIkxkYWx2aWsvYW5ub3RhdGlvbi9FbmNsb3NpbmdDbGFzczsAHkxkYWx2aWsvYW5ub3RhdGlvbi9Jbm5lckNsYXNzOwAhTGRhbHZpay9hbm5vdGF0aW9uL01lbWJlckNsYXNzZXM7AB1MZGFsdmlrL2Fubm90YXRpb24vU2lnbmF0dXJlOwAaTGRhbHZpay9hbm5vdGF0aW9uL1Rocm93czsADkxqYXZhL2lvL0ZpbGU7ABlMamF2YS9pby9GaWxlSW5wdXRTdHJlYW07ABVMamF2YS9pby9JbnB1dFN0cmVhbTsAFkxqYXZhL2lvL091dHB1dFN0cmVhbTsAFUxqYXZhL2lvL1ByaW50U3RyZWFtOwATTGphdmEvbGFuZy9Cb29sZWFuOwAYTGphdmEvbGFuZy9DaGFyU2VxdWVuY2U7ABFMamF2YS9sYW5nL0NsYXNzOwAVTGphdmEvbGFuZy9FeGNlcHRpb247ACRMamF2YS9sYW5nL0lsbGVnYWxBcmd1bWVudEV4Y2VwdGlvbjsAIUxqYXZhL2xhbmcvSWxsZWdhbFN0YXRlRXhjZXB0aW9uOwATTGphdmEvbGFuZy9JbnRlZ2VyOwAgTGphdmEvbGFuZy9JbnRlcnJ1cHRlZEV4Y2VwdGlvbjsAEExqYXZhL2xhbmcvTG9uZzsAIExqYXZhL2xhbmcvTm9TdWNoRmllbGRFeGNlcHRpb247ACFMamF2YS9sYW5nL05vU3VjaE1ldGhvZEV4Y2VwdGlvbjsAEkxqYXZhL2xhbmcvT2JqZWN0OwASTGphdmEvbGFuZy9TdHJpbmc7ABlMamF2YS9sYW5nL1N0cmluZ0J1aWxkZXI7ABJMamF2YS9sYW5nL1N5c3RlbTsAFUxqYXZhL2xhbmcvVGhyb3dhYmxlOwAfTGphdmEvbGFuZy9yZWZsZWN0L0NvbnN0cnVjdG9yOwAZTGphdmEvbGFuZy9yZWZsZWN0L0ZpZWxkOwAaTGphdmEvbGFuZy9yZWZsZWN0L01ldGhvZDsAKkxqYXZhL3V0aWwvY29uY3VycmVudC9MaW5rZWRCbG9ja2luZ1F1ZXVlOwAqTGphdmEvdXRpbC9jb25jdXJyZW50L0xpbmtlZEJsb2NraW5nUXVldWU8AB9MamF2YS91dGlsL2NvbmN1cnJlbnQvVGltZVVuaXQ7ABNMb2NhbEludGVudFJlY2VpdmVyABhNb25qaVNoZWxsSW5zdGFsbGVyLmphdmEAB1NFQ09ORFMAB1N1Y2Nlc3MABFRZUEUANFRpbWVkIG91dCB3YWl0aW5nIGZvciBQYWNrYWdlSW5zdGFsbGVyIGNvbW1pdCByZXN1bHQAPVVzYWdlOiBNb25qaVNoZWxsSW5zdGFsbGVyIDxhcGstcGF0aC1vbi1kZXZpY2U+IFstLWZsYWdzIEhFWF0AAVYAAlZJAAhWSUxMTExMTAACVkoAAlZMAANWTEkABFZMSUkAAlZaAAFaAAJaTAACW0IAEltMamF2YS9sYW5nL0NsYXNzOwATW0xqYXZhL2xhbmcvT2JqZWN0OwATW0xqYXZhL2xhbmcvU3RyaW5nOwAHYWJhbmRvbgAKYWNjZXNzJDEwMAALYWNjZXNzRmxhZ3MADWFkZFN1cHByZXNzZWQAGmFuZHJvaWQuYXBwLkFjdGl2aXR5VGhyZWFkAB9hbmRyb2lkLmNvbnRlbnQucG0uZXh0cmEuU1RBVFVTACdhbmRyb2lkLmNvbnRlbnQucG0uZXh0cmEuU1RBVFVTX01FU1NBR0UABmFwcGVuZAARYXBwbHlJbnN0YWxsRmxhZ3MABmF0dGFjaAAIYmFzZS5hcGsABWNsb3NlAAZjb21taXQADWNyZWF0ZVNlc3Npb24AE2NyZWF0ZVN5c3RlbUNvbnRleHQAEmN1cnJlbnRBcHBsaWNhdGlvbgAGZXF1YWxzAANlcnIABGV4aXQAB2Zvck5hbWUABWZzeW5jAAhnZXRDbGFzcwAWZ2V0RGVjbGFyZWRDb25zdHJ1Y3RvcgAQZ2V0RGVjbGFyZWRGaWVsZAARZ2V0RGVjbGFyZWRNZXRob2QABmdldEludAALZ2V0SW50RXh0cmEAD2dldEludGVudFNlbmRlcgAJZ2V0TWV0aG9kABNnZXRQYWNrYWdlSW5zdGFsbGVyABFnZXRQYWNrYWdlTWFuYWdlcgAJZ2V0UmVzdWx0AA5nZXRTdHJpbmdFeHRyYQANZ2V0U3VwZXJjbGFzcwAQZ2V0U3lzdGVtQ29udGV4dAAMaW5zdGFsbEZsYWdzAAZpbnZva2UABmlzRmlsZQAGbGVuZ3RoAAxtTG9jYWxTZW5kZXIAB21SZXN1bHQABG1haW4AF21vbmppOiBpbnN0YWxsIGZhaWxlZDogAA9tb25qaTogc2Vzc2lvbj0ANm1vbmppOiBzeXN0ZW1NYWluIGZhaWxlZCwgdHJ5aW5nIEFjdGl2aXR5VGhyZWFkIGN0b3I6IAA/bW9uamk6IHdhcm5pbmc6IGNvdWxkIG5vdCBzZXQgaW5zdGFsbEZsYWdzOyByZWx5aW5nIG9uIGRlZmF1bHRzAA1tb25qaTogd3JvdGUgAAhteUxvb3BlcgAEbmFtZQALbmV3SW5zdGFuY2UABW9mZmVyAAtvcGVuU2Vzc2lvbgAJb3BlbldyaXRlAANvdXQACXBhcnNlTG9uZwAEcG9sbAARcHJlcGFyZU1haW5Mb29wZXIAD3ByaW50U3RhY2tUcmFjZQAHcHJpbnRsbgAEcmVhZAAHcmVwbGFjZQAEc2VuZAANc2V0QWNjZXNzaWJsZQAPc2V0SW5zdGFsbEZsYWdzAAZzZXRJbnQAB3NldFNpemUACnN5c3RlbU1haW4ABnRoaXMkMAALdG9IZXhTdHJpbmcACHRvU3RyaW5nAAV2YWx1ZQAHdmFsdWVPZgAFd3JpdGUAnAF+fkQ4eyJiYWNrZW5kIjoiZGV4IiwiY29tcGlsYXRpb24tbW9kZSI6ImRlYnVnIiwiaGFzLWNoZWNrc3VtcyI6ZmFsc2UsIm1pbi1hcGkiOjI2LCJzaGEtMSI6ImZhY2VkZjQxYmJkMjhiNTYzZDFlOWUwOWM1ZjcyZDdjNWNhNTk4ZDUiLCJ2ZXJzaW9uIjoiOC4yLjItZGV2In0AAhMBqQEYBQIUAmUkCBCTAR4CEwGpARgEAhQCZQQAkwEeAhcBqQEcARggAhcBqQEcARgkAhYBqQEcAxdMFyUXBwIUAmUEGpMBF04CFQGpARwBGAQAAQEBAJAgAICABJQTAQGwEwACAwIBEgESAoKABIAVAYCgBLQVAYgg6BQFAJwUAQDkEwUABAADGgEaARoBGgEaB4GABJQYAQqsGAEKzBUBCewZBSQWAQQEJAABBBAEAgAAAAIAAABHHwAATh8AAAIAAABYHwAAXx8AAAEAAABoHwAAAQAAAHEfAAABAAAAeh8AAAIAAABHHwAAhx8AAAEAAACRHwAA/B8AAAAAAAAAAAAAAAAAAAggAAAAAAAAAAAAAAAAAAAsIAAAAQAAAAIAAAAAAAAAAgAAACQgAAAFAAAAFCAAAAYAAAAcIAAAOCAAAAAAAAACAAAAAAAAAAgAAAAUIAAACQAAABQgAAARAAAAAAAAAAEAAAAAAAAAAQAAAK0AAABwAAAAAgAAADgAAAAkAwAAAwAAADQAAAAEBAAABAAAAA0AAAB0BgAABQAAAEcAAADcBgAABgAAAAQAAAAUCQAAASAAAAsAAACUCQAAAyAAAAoAAADREAAAARAAABsAAACgEQAAAiAAAK0AAACKEgAABCAAAAkAAABHHwAAACAAAAMAAACaHwAABSAAAAEAAADsHwAAAxAAAAcAAAD8HwAABiAAAAQAAABAIAAAABAAAAEAAACoIAAA";

// UI Elements
const btnConnect = document.getElementById("btn-connect");
const btnConnectLocal = document.getElementById("btn-connect-local");
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

// Uninstaller UI Elements
const btnRefreshPackages = document.getElementById("btn-refresh-packages");
const btnReadAppsEmpty = document.getElementById("btn-read-apps-empty");
const packagesList = document.getElementById("packages-list");
const searchPackages = document.getElementById("search-packages");
const btnClearSearch = document.getElementById("btn-clear-search");
const badgeUninstallCount = document.getElementById("badge-uninstall-count");
const chipCount3rd = document.getElementById("chip-count-3rd");
const chipCountCat = document.getElementById("chip-count-cat");
const chipCountSys = document.getElementById("chip-count-sys");
const chipCountAll = document.getElementById("chip-count-all");
const filterChips = document.querySelectorAll(".filter-chip");

const inputManualPackage = document.getElementById("input-manual-package");
const btnManualUninstall = document.getElementById("btn-manual-uninstall");
const checkManualUser0 = document.getElementById("check-manual-user0");
const checkManualKeepdata = document.getElementById("check-manual-keepdata");

// Modal Elements
const modalUninstall = document.getElementById("modal-uninstall");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnModalCancel = document.getElementById("btn-modal-cancel");
const btnModalConfirm = document.getElementById("btn-modal-confirm");
const modalAppIcon = document.getElementById("modal-app-icon");
const modalAppName = document.getElementById("modal-app-name");
const modalAppPkg = document.getElementById("modal-app-pkg");
const modalAppBadges = document.getElementById("modal-app-badges");
const modalAdminWarning = document.getElementById("modal-admin-warning");
const modalOptUser0 = document.getElementById("modal-opt-user0");
const modalOptKeepdata = document.getElementById("modal-opt-keepdata");

// State
let currentAdb = null;
let credentialStore = null;
let isBusy = false;
let isConnecting = false;
let installedPackages = [];
let activeAdminComponents = [];
let activeFilter = "third-party";
let currentSearchQuery = "";
let pendingUninstallData = null;

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

// Almacén de credenciales estándar WebCrypto + IndexedDB (usamos "HABRO ADB", compatible con la clave del coche)
// Las claves se generan y almacenan de forma 100% transparente en el navegador sin intervención del usuario.
const ADB_STORE_NAME = "HABRO ADB";

// Ejecución de comandos Shell ADB: implementa el flujo recomendado por Ya-WebADB (shellProtocol || noneProtocol)
export async function execAdbShell(adb, cmd) {
  if (!adb) throw new Error("ADB no está conectado.");

  if (adb.isLocalAdb) {
    const out = await adb.runCmd(cmd);
    return { stdout: out, stderr: "", exitCode: 0, output: out.trim() };
  }

  const service = adb.subprocess.shellProtocol || adb.subprocess.noneProtocol;
  const isShellV2 = Boolean(adb.subprocess.shellProtocol);

  const process = await service.spawn(["sh", "-c", cmd]);

  let stdout = "";
  let stderr = "";

  if (isShellV2 && process.stdout) {
    const stdoutReader = process.stdout.pipeThrough(new TextDecoderStream()).getReader();
    const readStdout = (async () => {
      try {
        while (true) {
          const { done, value } = await stdoutReader.read();
          if (done) break;
          stdout += value;
        }
      } finally {
        stdoutReader.releaseLock();
      }
    })();

    const readStderr = (async () => {
      if (!process.stderr) return;
      const stderrReader = process.stderr.pipeThrough(new TextDecoderStream()).getReader();
      try {
        while (true) {
          const { done, value } = await stderrReader.read();
          if (done) break;
          stderr += value;
        }
      } finally {
        stderrReader.releaseLock();
      }
    })();

    await Promise.all([readStdout, readStderr]);
    let exitCode = 0;
    try {
      exitCode = await process.exited;
    } catch (_) {}
    const output = (stdout + (stderr ? "\n" + stderr : "")).trim();
    return { stdout, stderr, exitCode, output };
  } else {
    // noneProtocol fallback
    const outputStream = process.output || process.stdout;
    if (outputStream) {
      const reader = outputStream.pipeThrough(new TextDecoderStream()).getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          stdout += value;
        }
      } finally {
        reader.releaseLock();
      }
    }
    try {
      await process.exited;
    } catch (_) {}
    return { stdout, stderr: "", exitCode: 0, output: stdout.trim() };
  }
}

export async function execAdbShellText(adb, cmd) {
  const res = await execAdbShell(adb, cmd);
  return res.output;
}

// Ensure DEX Helper is uploaded to /data/local/tmp/
async function ensureDexHelper(adb) {
  log("Verificando dex_shell_helper en el sistema del coche...");
  try {
    const check = await execAdbShellText(adb, "ls -l /data/local/tmp/dex_shell_helper.dex");
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
      permission: 0o644,
      mtime: Math.floor(Date.now() / 1000),
    });
  } finally {
    await sync.dispose();
  }

  await execAdbShellText(adb, "chmod 644 /data/local/tmp/dex_shell_helper.dex");
  log("dex_shell_helper.dex inyectado y permisos 644 configurados.", "success");
}

// Push File with Progress (directo con ADB Sync, permiso 0o644 y timestamp mtime)
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
      permission: 0o644,
      mtime: Math.floor(Date.now() / 1000),
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

    await execAdbShellText(currentAdb, `chmod 644 ${tempRemoteApk}`);
    await execAdbShellText(currentAdb, "setprop persist.sys.sv.isl true").catch(() => {});

    log("Ejecutando instalación en el vehículo (MonjiShellInstaller flags 0x116)...", "info");
    const installCmd = `CLASSPATH=/data/local/tmp/dex_shell_helper.dex app_process /data/local/tmp MonjiShellInstaller ${tempRemoteApk} --flags 0x116`;
    let result = "";
    try {
      result = await execAdbShellText(currentAdb, installCmd);
    } catch (e) {
      result = e.message || "";
    }
    log(`Respuesta MonjiShellInstaller: ${result.trim()}`, result.includes("Success") ? "success" : "warning");

    // Fallback Desay SV: método de instalación por stream directo (idéntico a FrostNav)
    if (!result.includes("Success")) {
      log("Probando método nativo Desay SV (cat | pm install -r -d -g)...", "info");
      try {
        await execAdbShellText(currentAdb, "setprop persist.sys.sv.isl true");
        const fallbackCmd = `cat ${tempRemoteApk} | pm install -r -d -g -S $(stat -c%s ${tempRemoteApk})`;
        const fbResult = await execAdbShellText(currentAdb, fallbackCmd);
        log(`Respuesta Desay SV streaming: ${fbResult.trim()}`, fbResult.includes("Success") ? "success" : "warning");
        if (fbResult.includes("Success")) {
          result = "Success";
        }
      } catch (fbErr) {
        log(`Error en método streaming: ${fbErr.message || fbErr}`, "warning");
      }
    }

    if (result.includes("Success")) {
      log(`🎉 ¡${appName} instalado con éxito en el EBRO S700!`, "success");
      alert(`🎉 ¡${appName} se ha instalado correctamente en la pantalla del coche!`);
      // Auto-grant permissions to all 3rd party apps (Unlokit style)
      try {
        const grantAllCmd = `for pkg in $(pm list packages -3 | sed 's/package://'); do dumpsys package $pkg | grep -oE 'android.permission.[A-Z_]+' | sort -u | while read p; do pm grant $pkg $p 2>/dev/null; done; for op in SYSTEM_ALERT_WINDOW REQUEST_INSTALL_PACKAGES PROJECT_MEDIA WRITE_SETTINGS GET_USAGE_STATS MANAGE_EXTERNAL_STORAGE LEGACY_STORAGE; do appops set $pkg $op allow 2>/dev/null; done; cmd appops set $pkg AUTO_REVOKE_PERMISSIONS_IF_UNUSED ignore 2>/dev/null; dumpsys deviceidle whitelist +$pkg 2>/dev/null; done`;
        await execAdbShellText(currentAdb, grantAllCmd);
        log(`⚡ Permisos completos concedidos automáticamente a la nueva app.`, "info");
      } catch (_) {}
      // Refresh package list and catalog badges
      fetchInstalledPackages(false).catch(() => {});
    } else {
      log(`Fallo en la instalación: ${result}`, "error");
      alert(`La instalación no devolvió 'Success':\n${result}`);
    }

    // Cleanup
    await execAdbShellText(currentAdb, `rm -f ${tempRemoteApk}`);
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

// Timeout helper for async operations
function withTimeout(promise, ms, label = "Operación") {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} agotó el tiempo de espera (${ms / 1000}s)`)), ms)
    ),
  ]);
}

// Local helper to resolve API base URL whether on http://localhost:8085 or file://
function getApiUrl(endpoint) {
  if (window.location.protocol === "file:") {
    return "http://localhost:8085" + endpoint;
  }
  return endpoint;
}

function b64ToUint8Array(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Universal WebADB Credential Store (Clean & 100% standard for Git / Production)
class SmartAdbCredentialStore {
  constructor(name = "HABRO ADB") {
    this.name = name;
    this.fallbackStore = new AdbWebCredentialStore(name);
  }

  async generateKey() {
    return await this.fallbackStore.generateKey();
  }

  async *iterateKeys() {
    // 1. Clave personalizada opcional importada por el usuario en su navegador (localStorage)
    try {
      const customKeyB64 = localStorage.getItem("ebro_custom_adbkey");
      if (customKeyB64) {
        const keyBytes = b64ToUint8Array(customKeyB64.trim());
        yield {
          buffer: keyBytes,
          name: `${this.name}_Custom@${window.location.hostname || "localhost"}`
        };
      }
    } catch (_) {}

    // 2. Claves estándar del navegador gestionadas en IndexedDB (idéntico a HABRO/FrostNav)
    try {
      for await (const k of this.fallbackStore.iterateKeys()) {
        yield k;
      }
    } catch (err) {
      console.warn("No se pudieron iterar claves en IndexedDB:", err);
    }
  }
}

// Local ADB Bridge Client (compatible with currentAdb interface)
class AdbLocalClient {
  constructor(deviceInfo) {
    this.deviceInfo = deviceInfo;
    this.isLocalAdb = true;
    this.subprocess = {
      noneProtocol: {
        spawnWaitText: async (cmd) => this.runCmd(cmd),
      },
      shellProtocol: {
        spawn: async (args) => {
          const cmd = Array.isArray(args) ? args.slice(2).join(" ") : String(args);
          const out = await this.runCmd(cmd);
          return {
            stdout: new ReadableStream({
              start(ctrl) {
                ctrl.enqueue(new TextEncoder().encode(out));
                ctrl.close();
              }
            }),
            stderr: new ReadableStream({
              start(ctrl) { ctrl.close(); }
            }),
            exited: Promise.resolve(0),
          };
        }
      }
    };
  }

  async runCmd(cmd) {
    const res = await fetch(getApiUrl("/api/adb/shell"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cmd, serial: this.deviceInfo.serial }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return (data.output || "");
  }

  async getProp(name) {
    return (await this.runCmd(`getprop ${name}`)).trim();
  }

  async sync() {
    return {
      write: async ({ filename, file }) => {
        const reader = file.getReader();
        const chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        const blob = new Blob(chunks);
        const res = await fetch(
          getApiUrl(`/api/adb/push?dest=${encodeURIComponent(filename)}&serial=${encodeURIComponent(this.deviceInfo.serial)}`),
          {
            method: "POST",
            body: blob,
          }
        );
        const json = await res.json();
        if (!json.success) throw new Error("Fallo al transferir archivo por ADB: " + (json.output || ""));
      },
      dispose: async () => {},
    };
  }
}

// Check local ADB status on server
async function checkLocalAdbStatus() {
  try {
    const res = await fetch(getApiUrl("/api/adb/status"));
    if (!res.ok) return;
    const data = await res.json();
    if (data.available && data.devices && data.devices.length > 0) {
      const dev = data.devices[0];
      log(`🚗 ADB Local detectó tu EBRO conectado: ${dev.model} (Serial: ${dev.serial})`, "success");
      if (btnConnectLocal) {
        btnConnectLocal.style.display = "inline-flex";
        btnConnectLocal.innerHTML = `<span>💻 Conectar por ADB Local (${dev.serial})</span>`;
        btnConnectLocal.onclick = () => connectLocalAdb(dev);
      }
    }
  } catch (e) {
    // Silent if not running local server
  }
}

// Connect via Local ADB Bridge
async function connectLocalAdb(deviceInfo) {
  if (isConnecting) return;
  isConnecting = true;
  btnConnect.disabled = true;
  if (btnConnectLocal) btnConnectLocal.disabled = true;
  log(`Conectando vía ADB Consola Local a ${deviceInfo.model} (${deviceInfo.serial})...`, "info");
  statusText.textContent = "Conectando por ADB Local...";

  try {
    currentAdb = new AdbLocalClient(deviceInfo);
    log(`✅ ¡Conexión ADB Local establecida con ${deviceInfo.serial}!`, "success");
    await onDeviceConnected();
  } catch (e) {
    log(`Error al conectar por ADB Local: ${e.message || e}`, "error");
    currentAdb = null;
    alert("Error al conectar por ADB Local: " + (e.message || e));
    if (btnConnectLocal) btnConnectLocal.disabled = false;
    btnConnect.disabled = false;
  } finally {
    isConnecting = false;
  }
}

// Called when either WebUSB or Local ADB connects successfully
async function onDeviceConnected() {
  statusPill.className = "status-pill connected";
  statusText.textContent = "Conectado al EBRO";
  btnConnect.textContent = "✔ Coche Conectado";
  btnConnect.disabled = true;
  if (btnConnectLocal) btnConnectLocal.style.display = "none";
  deviceDetails.style.display = "grid";

  try {
    let model = "";
    let firmware = "";
    let platform = "";
    let android = "";

    try {
      model = (await currentAdb.getProp("ro.product.model")).trim();
      firmware = (await currentAdb.getProp("ro.build.display.id")).trim();
      platform = (await currentAdb.getProp("ro.board.platform")).trim();
      android = (await currentAdb.getProp("ro.build.version.release")).trim();
    } catch (_) {
      model = (await execAdbShellText(currentAdb, "getprop ro.product.model")).trim();
      firmware = (await execAdbShellText(currentAdb, "getprop ro.build.display.id")).trim();
      platform = (await execAdbShellText(currentAdb, "getprop ro.board.platform")).trim();
      android = (await execAdbShellText(currentAdb, "getprop ro.build.version.release")).trim();
    }

    valModel.textContent = model || "EBRO S700 / Desay SV";
    valFirmware.textContent = firmware || "Desay SV Platform";
    valSoC.textContent = platform ? `${platform} (Snapdragon 8155)` : "Qualcomm 8155";
    valAndroid.textContent = `Android ${android || "11"}`;

    log(`Vehículo detectado: ${model} | Firmware: ${firmware} | SoC: ${platform} | Android ${android}`, "info");
  } catch (propErr) {
    log("Conectado (no se pudieron leer algunas propiedades): " + propErr.message, "warning");
  }

  // DesaySV sideload platform flag from EvilBorsch
  try {
    await execAdbShellText(currentAdb, "setprop persist.sys.sv.isl true");
  } catch (e) {}

  await ensureDexHelper(currentAdb);
  fetchInstalledPackages(false).catch(() => {});
}

// Connect WebUSB using exact HABRO / FrostNav / standard yume-chan flow
async function connectUsb() {
  if (isConnecting) return;

  if (!navigator.usb) {
    const msg = "Tu navegador no soporta WebUSB. Usa Google Chrome o Microsoft Edge en Windows, Mac o Linux (requiere HTTPS o http://localhost).";
    log(msg, "error");
    alert(msg);
    return;
  }

  if (window.isSecureContext === false) {
    const msg = "WebUSB requiere un contexto seguro (HTTPS o http://localhost). No funciona sobre HTTP con dirección IP.";
    log(msg, "error");
    alert(msg);
    return;
  }

  isConnecting = true;
  btnConnect.disabled = true;
  btnConnect.innerHTML = '<span>⏳ Conectando...</span>';
  statusPill.className = "status-pill";
  statusText.textContent = "Solicitando dispositivo USB...";

  // Si se ejecuta en local o sobre file://, intentar liberar adb.exe para no bloquear WebUSB
  try {
    const killUrl = getApiUrl("/api/adb/kill");
    await fetch(killUrl, { method: "POST" });
  } catch (_) {}

  let authInterval = null;

  try {
    log("Iniciando solicitud WebUSB...", "info");
    log("💡 Selecciona tu vehículo ('SA8155', 'DesaySV' o 'Android') en la ventana emergente de Chrome/Edge.", "info");

    const manager = AdbDaemonWebUsbDeviceManager.BROWSER;
    if (!manager) {
      throw new Error("WebUSB no está soportado en este navegador.");
    }

    // 1. Selector de dispositivo del navegador (Chrome / Edge abre el modal nativo)
    let device = null;
    try {
      device = await manager.requestDevice();
    } catch (err) {
      if (err.name === "NotFoundError" || String(err).includes("No device selected")) {
        log("Selección de dispositivo cancelada por el usuario.", "warning");
        return;
      }
      throw err;
    }

    if (!device) {
      const existing = await manager.getDevices();
      if (existing && existing.length > 0) {
        device = existing.slice().sort((a, b) => (b.serial ? 1 : 0) - (a.serial ? 1 : 0))[0];
      }
    }

    if (!device) {
      log("No se seleccionó ningún dispositivo USB.", "warning");
      return;
    }

    const prodName = device.raw?.productName || "SA8155";
    const devSerial = device.serial || device.raw?.serialNumber || "SA8155";
    const displayLabel = `${prodName} ${devSerial ? `(SN: ${devSerial})` : ""}`.trim();

    log(`Dispositivo seleccionado: ${displayLabel}. Abriendo canal USB...`, "info");
    statusText.textContent = "Abriendo canal USB...";

    // 2. Conectar al canal USB (open WebUSB interface)
    const connection = await device.connect();
    const epIn = connection.inEndpoint?.endpointNumber;
    const epOut = connection.outEndpoint?.endpointNumber;
    log(`Canal USB abierto (IN=${epIn}, OUT=${epOut}). Negociando handshake ADB...`, "info");

    // 3. Autenticación con Smart Credential Store
    // Presenta en primer lugar la clave RSA ya autorizada del PC (~/.android/adbkey)
    // para que el coche la valide de inmediato sin requerir diálogo en pantalla.
    if (!credentialStore) {
      credentialStore = new SmartAdbCredentialStore("HABRO ADB");
    }

    log("Negociando clave de autenticación ADB con el coche...", "info");
    log("💡 Si es la primera vez que conectas este navegador al coche:", "info");
    log("👉 Sal de Apple CarPlay / Android Auto y ve a Ajustes o pantalla principal del coche.", "info");
    log("👉 Si aparece el aviso '¿Permitir depuración USB?', marca 'Permitir siempre' y pulsa 'Aceptar'.", "info");

    statusPill.className = "status-pill authorizing";
    let secondsLeft = 90;
    statusText.textContent = `Acepta en la pantalla (${secondsLeft}s)...`;
    btnConnect.innerHTML = `<span>⏳ Esperando (${secondsLeft}s)...</span>`;

    authInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        statusText.textContent = `Acepta en la pantalla (${secondsLeft}s)...`;
        btnConnect.innerHTML = `<span>⏳ Esperando (${secondsLeft}s)...</span>`;
      }
    }, 1000);

    const transport = await withTimeout(
      AdbDaemonTransport.authenticate({
        serial: device.serial || devSerial,
        connection,
        credentialStore,
      }),
      90000,
      "La autorización ADB en la pantalla del coche"
    );

    clearInterval(authInterval);
    authInterval = null;

    const adb = new Adb(transport);
    currentAdb = adb;
    log(`✅ ¡Conexión ADB verificada con éxito en ${displayLabel}!`, "success");

    await onDeviceConnected();
  } catch (err) {
    if (authInterval) clearInterval(authInterval);
    log(`Error al conectar por WebUSB: ${err.message || err}`, "error");
    console.error(err);
    const errLower = String(err.message || err).toLowerCase();
    if (errLower.includes("claiminterface") || errLower.includes("used by another") || errLower.includes("already in use")) {
      log("⚠️ El puerto USB está bloqueado por otro proceso (adb.exe). Cierra cualquier consola y vuelve a pulsar Conectar.", "error");
      alert("El puerto USB está en uso por otro programa en tu ordenador.\n\nCierra cualquier consola con adb y vuelve a pulsar 'Conectar Coche por USB'.");
    } else if (errLower.includes("agotó el tiempo") || errLower.includes("timeout")) {
      alert("Tiempo de espera agotado (90s).\n\nNo se autorizó la depuración USB en la pantalla del coche a tiempo.\n\nAsegúrate de tener la pantalla del coche encendida y pulsa 'Aceptar' en el diálogo emergente.");
    } else {
      alert("Error al conectar por WebUSB:\n" + (err.message || err));
    }
  } finally {
    if (authInterval) clearInterval(authInterval);
    isConnecting = false;
    if (!currentAdb) {
      btnConnect.disabled = false;
      btnConnect.innerHTML = '<span>⚡ Conectar por WebUSB</span>';
      statusPill.className = "status-pill";
      statusText.textContent = "Desconectado";
    }
  }
}

btnConnect.addEventListener("click", connectUsb);

// Auto-sync local adb status (works on localhost and file:// with server.ps1 running)
setTimeout(checkLocalAdbStatus, 500);

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

// =========================================================================
// App Uninstaller & Package Manager Module
// =========================================================================

// Dictionary of Known Android Automotive & Sideloaded Apps
const KNOWN_PACKAGES = {
  "com.ebro.horizon.beta": { name: "Ebro Horizon Beta", icon: "🏎️", category: "EBRO Custom", isCatalog: true },
  "com.ebro.cardash": { name: "Ebro Horizon Dash", icon: "🏎️", category: "EBRO Custom", isCatalog: true },
  "com.teamsun.floatingdock": { name: "Floating Dock", icon: "🔘", category: "TR4314 / Desay", isCatalog: true },
  "com.teamsun.dock": { name: "Floating Dock", icon: "🔘", category: "TR4314 / Desay", isCatalog: true },
  "com.liskovsoft.videomanager": { name: "SmartTube", icon: "📺", category: "Multimedia", isCatalog: true },
  "com.liskovsoft.smarttubetv.beta": { name: "SmartTube Beta", icon: "📺", category: "Multimedia", isCatalog: true },
  "com.google.android.youtube": { name: "YouTube", icon: "▶️", category: "Multimedia" },
  "com.spotify.music": { name: "Spotify", icon: "🎵", category: "Música" },
  "com.waze": { name: "Waze Navegación", icon: "🚗", category: "Navegación" },
  "com.google.android.apps.maps": { name: "Google Maps", icon: "🗺️", category: "Navegación" },
  "org.videolan.vlc": { name: "VLC Media Player", icon: "🎬", category: "Multimedia" },
  "com.aurora.store": { name: "Aurora Store", icon: "🛍️", category: "Tienda de Apps" },
  "com.apkpure.aegon": { name: "APKPure Store", icon: "📦", category: "Tienda de Apps" },
  "com.termux": { name: "Termux Terminal", icon: "💻", category: "Herramientas" },
  "moe.shizuku.privileged.api": { name: "Shizuku", icon: "⚡", category: "Sistema" },
  "com.android.chrome": { name: "Google Chrome", icon: "🌐", category: "Navegador" },
  "org.mozilla.firefox": { name: "Firefox", icon: "🦊", category: "Navegador" },
  "net.dinglisch.android.taskerm": { name: "Tasker", icon: "⚙️", category: "Automatización" },
  "com.estrongs.android.pop": { name: "ES File Explorer", icon: "📁", category: "Archivos" },
  "com.mixplorer": { name: "MiXplorer", icon: "📁", category: "Archivos" },
  "com.android.vending": { name: "Google Play Store", icon: "🛍️", category: "Google Services" },
  "com.google.android.gms": { name: "Google Play Services", icon: "🧩", category: "Google Services" },
};

function formatPackageName(pkg) {
  if (!pkg) return "Desconocida";
  const parts = pkg.split(".").filter(Boolean);
  const last = parts[parts.length - 1];
  const secondLast = parts.length > 2 ? parts[parts.length - 2] : "";
  let name = (secondLast && !["com", "android", "org", "net"].includes(secondLast) ? `${secondLast} ` : "") + last;
  return name
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function copyToClipboard(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnElement.innerHTML;
    btnElement.innerHTML = "✔";
    btnElement.title = "¡Copiado!";
    setTimeout(() => {
      btnElement.innerHTML = originalText;
      btnElement.title = "Copiar paquete";
    }, 1500);
  }).catch(() => {
    // Fallback if clipboard API restricted
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  });
}

// Fetch all installed packages from the vehicle
export async function fetchInstalledPackages(verbose = false) {
  if (!currentAdb) {
    if (isConnecting) {
      log("La conexión con el vehículo está en curso. Espera un momento...", "info");
      return;
    }
    if (verbose) {
      log("Error: Conecta primero el coche por USB para leer las apps instaladas.", "warning");
      alert("Por favor, conecta primero el coche mediante USB.");
    }
    return;
  }

  try {
    btnRefreshPackages?.classList.add("refreshing");
    if (btnReadAppsEmpty) btnReadAppsEmpty.disabled = true;

    if (verbose) log("Leyendo aplicaciones instaladas desde el sistema del coche...", "info");

    if (packagesList) {
      packagesList.innerHTML = `
        <div class="empty-state">
          <div class="refresh-icon" style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔄</div>
          <h4>Consultando gestor de paquetes de Android...</h4>
          <p>Leyendo paquetes de usuario y sistema vía ADB.</p>
        </div>
      `;
    }

    // 1. Fetch 3rd party packages
    let thirdPartyText = "";
    try {
      thirdPartyText = await execAdbShellText(currentAdb, "pm list packages -3");
    } catch (e) {
      console.warn("pm list packages -3 error:", e);
    }

    const thirdPartySet = new Set(
      thirdPartyText
        .split("\n")
        .map((l) => l.trim().replace(/^package:/, ""))
        .filter((l) => l.length > 0)
    );

    // 2. Fetch all packages
    let allPackagesText = "";
    try {
      allPackagesText = await execAdbShellText(currentAdb, "pm list packages");
    } catch (e) {
      console.warn("pm list packages error:", e);
    }

    const allPkgList = allPackagesText
      .split("\n")
      .map((l) => l.trim().replace(/^package:/, ""))
      .filter((l) => l.length > 0);

    // 3. Fetch active device admins
    activeAdminComponents = [];
    try {
      const adminsText = await execAdbShellText(currentAdb, "dpm list-active-admins");
      activeAdminComponents = adminsText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.includes("/"));
    } catch (e) {
      console.warn("dpm list-active-admins error:", e);
    }

    // 4. Build array of packages
    installedPackages = allPkgList.map((pkg) => {
      const isThirdParty = thirdPartySet.has(pkg);
      const isSystem = !isThirdParty;
      const known = KNOWN_PACKAGES[pkg];
      const hasAdmin = activeAdminComponents.some((admin) => admin.includes(pkg));
      const adminComp = activeAdminComponents.find((admin) => admin.includes(pkg)) || null;

      const isCatalog = Boolean(
        known?.isCatalog ||
        pkg.includes("ebro") ||
        pkg.includes("horizon") ||
        pkg.includes("floatingdock") ||
        pkg.includes("smarttube")
      );

      return {
        id: pkg,
        name: known?.name || formatPackageName(pkg),
        icon: known?.icon || (isCatalog ? "🏎️" : isThirdParty ? "📦" : "⚙️"),
        category: known?.category || (isThirdParty ? "App de Terceros" : "Sistema Android"),
        isThirdParty,
        isSystem,
        isCatalog,
        hasAdmin,
        adminComponent: adminComp,
      };
    });

    // Sort: Catalog first, then 3rd-party alphabetically, then system
    installedPackages.sort((a, b) => {
      if (a.isCatalog && !b.isCatalog) return -1;
      if (!a.isCatalog && b.isCatalog) return 1;
      if (a.isThirdParty && !b.isThirdParty) return -1;
      if (!a.isThirdParty && b.isThirdParty) return 1;
      return a.name.localeCompare(b.name);
    });

    // Update Counts
    const thirdPartyCount = installedPackages.filter((p) => p.isThirdParty).length;
    const catalogCount = installedPackages.filter((p) => p.isCatalog).length;
    const systemCount = installedPackages.filter((p) => p.isSystem).length;
    const totalCount = installedPackages.length;

    if (chipCount3rd) chipCount3rd.textContent = thirdPartyCount;
    if (chipCountCat) chipCountCat.textContent = catalogCount;
    if (chipCountSys) chipCountSys.textContent = systemCount;
    if (chipCountAll) chipCountAll.textContent = totalCount;

    if (badgeUninstallCount) {
      badgeUninstallCount.textContent = thirdPartyCount;
      badgeUninstallCount.style.display = thirdPartyCount > 0 ? "inline-block" : "none";
    }

    // Update Catalog status badges in tab-catalog
    updateCatalogInstalledStatus();

    log(`Apps leídas: ${thirdPartyCount} de terceros, ${systemCount} de sistema (${totalCount} totales).`, "info");
    if (activeAdminComponents.length > 0) {
      log(`Administradores de dispositivo activos detectados: ${activeAdminComponents.join(", ")}`, "warning");
    }

    renderPackagesList();
  } catch (err) {
    log(`Error al leer aplicaciones del coche: ${err.message || err}`, "error");
    console.error(err);
    if (packagesList) {
      packagesList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon" style="color: #f56565;">❌</div>
          <h4>Error al leer aplicaciones</h4>
          <p>${escapeHtml(err.message || err)}</p>
          <button id="btn-read-apps-retry" class="btn btn-ghost" style="margin-top: 1rem;">Reintentar</button>
        </div>
      `;
      document.getElementById("btn-read-apps-retry")?.addEventListener("click", () => fetchInstalledPackages(true));
    }
  } finally {
    btnRefreshPackages?.classList.remove("refreshing");
    if (btnReadAppsEmpty) btnReadAppsEmpty.disabled = false;
  }
}

// Update Catalog badges and buttons when apps are installed
function updateCatalogInstalledStatus() {
  document.querySelectorAll(".catalog-card-actions").forEach((actions) => {
    const uninstallBtn = actions.querySelector(".btn-catalog-uninstall");
    if (!uninstallBtn) return;
    const pkgAttr = uninstallBtn.getAttribute("data-pkg");
    if (!pkgAttr) return;
    const pkgCandidates = pkgAttr.split(",").map((s) => s.trim());
    const isInstalled = installedPackages.some((p) => pkgCandidates.includes(p.id));
    
    const card = actions.closest(".app-card");
    let badge = card?.querySelector(".status-installed-badge");
    if (isInstalled) {
      if (!badge && card) {
        badge = document.createElement("span");
        badge.className = "badge-tag tag-user status-installed-badge";
        badge.innerHTML = "✔ Instalada";
        card.querySelector(".app-header .app-info")?.appendChild(badge);
      }
      uninstallBtn.disabled = false;
      uninstallBtn.style.opacity = "1";
    } else {
      if (badge) badge.remove();
    }
  });
}

// Render packages list according to active filter and search query
function renderPackagesList() {
  if (!packagesList) return;

  if (!installedPackages || installedPackages.length === 0) {
    packagesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📱</div>
        <h4>No se han cargado las aplicaciones</h4>
        <p>Conecta tu EBRO S700 por USB y pulsa en <strong>"Leer Apps del Coche"</strong> para listar todas las aplicaciones instaladas.</p>
        <button id="btn-read-apps-empty" class="btn btn-accent" style="margin-top: 1rem;">
          <span>🔄 Leer Aplicaciones Instaladas</span>
        </button>
      </div>
    `;
    document.getElementById("btn-read-apps-empty")?.addEventListener("click", () => fetchInstalledPackages(true));
    return;
  }

  const query = currentSearchQuery.trim().toLowerCase();

  const filtered = installedPackages.filter((pkg) => {
    // Filter chip match
    if (activeFilter === "third-party" && !pkg.isThirdParty) return false;
    if (activeFilter === "catalog" && !pkg.isCatalog) return false;
    if (activeFilter === "system" && !pkg.isSystem) return false;

    // Search query match
    if (query) {
      return pkg.id.toLowerCase().includes(query) || pkg.name.toLowerCase().includes(query);
    }
    return true;
  });

  if (filtered.length === 0) {
    packagesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h4>No se encontraron aplicaciones</h4>
        <p>No hay resultados que coincidan con el filtro activo${query ? ` ni con la búsqueda "${escapeHtml(query)}"` : ""}.</p>
      </div>
    `;
    return;
  }

  packagesList.innerHTML = "";

  filtered.forEach((pkg) => {
    const card = document.createElement("div");
    card.className = "pkg-card";

    let badgesHtml = "";
    if (pkg.isThirdParty) badgesHtml += '<span class="badge-tag tag-user">Terceros</span> ';
    if (pkg.isSystem) badgesHtml += '<span class="badge-tag tag-system">Sistema</span> ';
    if (pkg.isCatalog) badgesHtml += '<span class="badge-tag tag-catalog">Catálogo</span> ';
    if (pkg.hasAdmin) badgesHtml += '<span class="badge-tag tag-admin">Admin Activo</span> ';

    card.innerHTML = `
      <div class="pkg-main">
        <div class="pkg-icon">${pkg.icon}</div>
        <div class="pkg-info">
          <div class="pkg-title-row">
            <span class="pkg-title">${escapeHtml(pkg.name)}</span>
            <div class="pkg-meta">${badgesHtml}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.35rem; margin-top: 0.15rem;">
            <span class="pkg-id">${escapeHtml(pkg.id)}</span>
            <button class="btn-icon-action btn-copy-pkg" title="Copiar nombre de paquete" style="width: 22px; height: 22px; font-size: 0.7rem; border-radius: 4px;">📋</button>
          </div>
        </div>
      </div>
      <div class="pkg-actions">
        <button class="btn-icon-action btn-pkg-launch" title="Abrir en la pantalla del coche (am start)">▶</button>
        <button class="btn-icon-action btn-pkg-perms" title="Conceder todos los permisos (Unlokit / Chery)">⚡</button>
        <button class="btn-icon-action btn-pkg-clear" title="Limpiar datos y caché (pm clear)">🧹</button>
        <button class="btn-icon-action btn-pkg-stop" title="Forzar cierre (am force-stop)">🛑</button>
        <button class="btn btn-danger btn-sm btn-pkg-uninstall">
          <span>🗑️ Desinstalar</span>
        </button>
      </div>
    `;

    // Launch app on screen button
    card.querySelector(".btn-pkg-launch").addEventListener("click", () => {
      launchApp(pkg.id);
    });

    // Grant full permissions button
    card.querySelector(".btn-pkg-perms").addEventListener("click", () => {
      grantAllPermissions(pkg.id);
    });

    // Copy package ID button
    card.querySelector(".btn-copy-pkg").addEventListener("click", (e) => {
      e.stopPropagation();
      copyToClipboard(pkg.id, e.currentTarget);
    });

    // Clear data button
    card.querySelector(".btn-pkg-clear").addEventListener("click", () => {
      clearPackageData(pkg.id, pkg.name);
    });

    // Force stop button
    card.querySelector(".btn-pkg-stop").addEventListener("click", () => {
      forceStopPackage(pkg.id, pkg.name);
    });

    // Uninstall button -> Open Modal
    card.querySelector(".btn-pkg-uninstall").addEventListener("click", () => {
      openUninstallModal(pkg);
    });

    packagesList.appendChild(card);
  });
}

// Modal management
function openUninstallModal(pkgData) {
  pendingUninstallData = pkgData;
  if (modalAppName) modalAppName.textContent = pkgData.name;
  if (modalAppPkg) modalAppPkg.textContent = pkgData.id;
  if (modalAppIcon) modalAppIcon.textContent = pkgData.icon || "📦";
  
  // Badges
  if (modalAppBadges) {
    modalAppBadges.innerHTML = "";
    if (pkgData.isThirdParty) {
      modalAppBadges.innerHTML += '<span class="badge-tag tag-user">Usuario / Sideload</span> ';
    }
    if (pkgData.isSystem) {
      modalAppBadges.innerHTML += '<span class="badge-tag tag-system">Sistema OEM</span> ';
    }
    if (pkgData.isCatalog) {
      modalAppBadges.innerHTML += '<span class="badge-tag tag-catalog">Catálogo</span> ';
    }
  }

  // Admin Warning
  if (modalAdminWarning) {
    modalAdminWarning.style.display = pkgData.hasAdmin ? "flex" : "none";
  }

  // Default option check states
  if (modalOptUser0) modalOptUser0.checked = true;
  if (modalOptKeepdata) modalOptKeepdata.checked = false;

  if (modalUninstall) modalUninstall.style.display = "flex";
}

function closeUninstallModal() {
  if (modalUninstall) modalUninstall.style.display = "none";
  pendingUninstallData = null;
}

// Uninstall a package via ADB
export async function uninstallPackage(pkgId, options = { keepData: false, user0: true }) {
  if (!currentAdb) {
    log("Error: Conecta primero el coche por USB.", "error");
    alert("Por favor, conecta primero el coche mediante USB.");
    return false;
  }
  if (isBusy) {
    log("Hay otra operación en curso. Espera a que termine.", "warning");
    return false;
  }

  isBusy = true;
  try {
    log(`Iniciando desinstalación de paquete: ${pkgId}...`, "info");
    setProgress(20, `Desinstalando ${pkgId}...`);

    // 1. Remove active device admin if present
    const matchingAdmin = activeAdminComponents.find((a) => a.includes(pkgId));
    if (matchingAdmin) {
      log(`Desactivando componente de Administrador de Dispositivo: ${matchingAdmin}...`, "warning");
      try {
        await execAdbShellText(currentAdb, `dpm remove-active-admin ${matchingAdmin}`);
        log(`Permiso de administrador ${matchingAdmin} revocado con éxito.`, "success");
      } catch (adminErr) {
        log(`Aviso al revocar permisos de admin: ${adminErr.message}`, "warning");
      }
    }

    // 2. Build command
    let cmd = "pm uninstall ";
    if (options.keepData) cmd += "-k ";
    if (options.user0) cmd += "--user 0 ";
    cmd += pkgId;

    log(`Ejecutando en Android: ${cmd}`, "info");
    setProgress(50, `Ejecutando ${cmd}...`);

    let output = (await execAdbShellText(currentAdb, cmd)).trim();
    log(`Respuesta del desinstalador: ${output}`, output.includes("Success") ? "success" : "warning");

    // Fallback: If failed and user0 was false, retry with --user 0
    if (!output.includes("Success") && !options.user0) {
      log(`Reintentando con flag --user 0 para saltar restricciones OEM...`, "warning");
      const fallbackCmd = `pm uninstall --user 0 ${pkgId}`;
      output = (await execAdbShellText(currentAdb, fallbackCmd)).trim();
      log(`Respuesta tras reintento: ${output}`, output.includes("Success") ? "success" : "warning");
    }

    if (output.includes("Success")) {
      log(`🎉 ¡Aplicación ${pkgId} desinstalada correctamente!`, "success");
      alert(`🎉 ¡${pkgId} se ha desinstalado con éxito del vehículo!`);
      // Refresh package list
      await fetchInstalledPackages(false);
      return true;
    } else {
      log(`Fallo al desinstalar ${pkgId}: ${output}`, "error");
      alert(`No se pudo desinstalar el paquete:\n${output}\n\nSi es una app de fábrica protegida, es posible que el sistema no permita su eliminación total.`);
      return false;
    }
  } catch (err) {
    log(`Error durante la desinstalación: ${err.message || err}`, "error");
    console.error(err);
    alert(`Error al desinstalar: ${err.message || err}`);
    return false;
  } finally {
    hideProgress();
    isBusy = false;
  }
}

// Clear package data and cache
export async function clearPackageData(pkgId, appName = "") {
  if (!currentAdb) {
    alert("Por favor, conecta primero el coche mediante USB.");
    return;
  }
  const label = appName ? `'${appName}' (${pkgId})` : `'${pkgId}'`;
  if (!confirm(`¿Deseas restablecer y borrar los datos de ${label}?\nSe eliminará la caché y configuración interna de la app sin desinstalarla.`)) {
    return;
  }

  try {
    log(`Limpiando datos de: ${pkgId}...`, "info");
    const res = (await execAdbShellText(currentAdb, `pm clear ${pkgId}`)).trim();
    if (res.includes("Success")) {
      log(`✅ Datos de ${pkgId} eliminados correctamente.`, "success");
      alert(`✅ Se han borrado los datos y caché de ${pkgId}.`);
    } else {
      log(`Resultado al limpiar datos: ${res}`, "warning");
      alert(`Respuesta del sistema: ${res}`);
    }
  } catch (e) {
    log(`Error al limpiar datos: ${e.message}`, "error");
    alert(`Error: ${e.message}`);
  }
}

// Force stop package
export async function forceStopPackage(pkgId, appName = "") {
  if (!currentAdb) {
    alert("Por favor, conecta primero el coche mediante USB.");
    return;
  }
  try {
    log(`Forzando detención de: ${pkgId}...`, "info");
    await execAdbShellText(currentAdb, `am force-stop ${pkgId}`);
    log(`🛑 Proceso de ${pkgId} detenido.`, "success");
  } catch (e) {
    log(`Error al forzar detención: ${e.message}`, "error");
  }
}

// Launch app on car screen (Unlokit method)
export async function launchApp(pkgId) {
  if (!currentAdb) {
    alert("Por favor, conecta primero el coche mediante USB.");
    return;
  }
  log(`Abriendo app en la pantalla del coche: ${pkgId}...`, "info");
  try {
    const cmd = `cmd package resolve-activity --brief -a android.intent.action.MAIN -c android.intent.category.LAUNCHER ${pkgId}`;
    const out = await execAdbShellText(currentAdb, cmd);
    const line = out.split("\n").map((s) => s.trim()).filter(Boolean).reverse().find((l) => l.includes(pkgId + "/"));
    const comp = line ? line.split(/\s+/).pop() : null;

    if (comp) {
      await execAdbShellText(currentAdb, `am start -n ${comp}`);
      log(`🚀 ¡App lanzada en la pantalla!: ${comp}`, "success");
    } else {
      await execAdbShellText(currentAdb, `monkey -p ${pkgId} -c android.intent.category.LAUNCHER 1`);
      log(`🚀 ¡App iniciada en pantalla (vía monkey)!`, "success");
    }
  } catch (err) {
    log(`Error al abrir app: ${err.message || err}`, "error");
    alert(`No se pudo abrir la app:\n${err.message || err}`);
  }
}

// Grant full permissions (Unlokit + EvilBorsch method)
export async function grantAllPermissions(pkgId, isSilent = false) {
  if (!currentAdb) {
    if (!isSilent) alert("Por favor, conecta primero el coche mediante USB.");
    return;
  }
  log(`⚡ Concediendo todos los permisos a ${pkgId} (Unlokit / DesaySV)...`, "info");
  try {
    await execAdbShellText(currentAdb, "setprop persist.sys.sv.isl true").catch(() => {});
    const script = `pkg=${pkgId}; ` +
      `dumpsys package $pkg | grep -oE 'android.permission.[A-Z_]+' | sort -u | while read p; do pm grant $pkg $p 2>/dev/null; done; ` +
      `for op in SYSTEM_ALERT_WINDOW REQUEST_INSTALL_PACKAGES PROJECT_MEDIA WRITE_SETTINGS GET_USAGE_STATS MANAGE_EXTERNAL_STORAGE LEGACY_STORAGE; do appops set $pkg $op allow 2>/dev/null; done; ` +
      `cmd appops set $pkg AUTO_REVOKE_PERMISSIONS_IF_UNUSED ignore 2>/dev/null; ` +
      `dumpsys deviceidle whitelist +$pkg 2>/dev/null; ` +
      `echo "granted:$pkg"`;

    const out = await execAdbShellText(currentAdb, script);
    log(`Permisos aplicados a ${pkgId}: ${out.trim()}`, "success");
    if (!isSilent) {
      alert(`🎉 ¡Todos los permisos han sido concedidos a '${pkgId}'!\n- Ventana flotante (Overlay) permitida\n- Acceso total a almacenamiento\n- Excluido de ahorro de batería\n- Desactivada la revocación automática de permisos`);
    }
  } catch (err) {
    log(`Error al conceder permisos: ${err.message || err}`, "error");
    if (!isSilent) alert(`Error al otorgar permisos: ${err.message || err}`);
  }
}

// Setup Event Listeners
filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.getAttribute("data-filter") || "third-party";
    renderPackagesList();
  });
});

searchPackages?.addEventListener("input", (e) => {
  currentSearchQuery = e.target.value;
  if (btnClearSearch) {
    btnClearSearch.style.display = currentSearchQuery ? "block" : "none";
  }
  renderPackagesList();
});

btnClearSearch?.addEventListener("click", () => {
  if (searchPackages) searchPackages.value = "";
  currentSearchQuery = "";
  btnClearSearch.style.display = "none";
  renderPackagesList();
});

btnRefreshPackages?.addEventListener("click", () => {
  fetchInstalledPackages(true);
});

btnReadAppsEmpty?.addEventListener("click", () => {
  fetchInstalledPackages(true);
});

// Community Catalog Uninstall Buttons
document.querySelectorAll(".btn-catalog-uninstall").forEach((btn) => {
  btn.addEventListener("click", () => {
    const pkgAttr = btn.getAttribute("data-pkg");
    const name = btn.getAttribute("data-name");
    const candidates = pkgAttr.split(",").map((s) => s.trim());
    
    // Check which candidate is installed
    const installed = installedPackages.find((p) => candidates.includes(p.id));
    const targetPkg = installed ? installed.id : candidates[0];

    openUninstallModal({
      id: targetPkg,
      name: name,
      icon: installed ? installed.icon : "📦",
      isThirdParty: true,
      isSystem: false,
      isCatalog: true,
      hasAdmin: activeAdminComponents.some((a) => a.includes(targetPkg)),
    });
  });
});

// Manual Uninstaller Button
btnManualUninstall?.addEventListener("click", () => {
  const pkg = inputManualPackage?.value.trim();
  if (!pkg) {
    alert("Por favor, introduce el nombre de paquete a desinstalar (ej: com.ebro.horizon.beta).");
    inputManualPackage?.focus();
    return;
  }
  const user0 = checkManualUser0 ? checkManualUser0.checked : true;
  const keepData = checkManualKeepdata ? checkManualKeepdata.checked : false;

  openUninstallModal({
    id: pkg,
    name: formatPackageName(pkg),
    icon: "📦",
    isThirdParty: true,
    isSystem: false,
    isCatalog: false,
    hasAdmin: activeAdminComponents.some((a) => a.includes(pkg)),
  });
});

// Modal Close & Confirm Actions
btnCloseModal?.addEventListener("click", closeUninstallModal);
btnModalCancel?.addEventListener("click", closeUninstallModal);
modalUninstall?.addEventListener("click", (e) => {
  if (e.target === modalUninstall) closeUninstallModal();
});

btnModalConfirm?.addEventListener("click", async () => {
  if (!pendingUninstallData) return;
  const pkgId = pendingUninstallData.id;
  const user0 = modalOptUser0 ? modalOptUser0.checked : true;
  const keepData = modalOptKeepdata ? modalOptKeepdata.checked : false;
  closeUninstallModal();
  await uninstallPackage(pkgId, { keepData, user0 });
});

// Auto-trigger fetch when user switches to uninstall tab if already connected
document.querySelector('[data-tab="tab-uninstall"]')?.addEventListener("click", () => {
  if (currentAdb && installedPackages.length === 0) {
    fetchInstalledPackages(false);
  }
});

// =========================================================================
// OTA ADB Activation PIN Calculator (CarotaOTA EngineMode)
// Formula: ((last_6_digits_VIN + 123456) * yyMMdd) mod 1_000_000
// =========================================================================
function initOtaCalculator() {
  const inputVin = document.getElementById("input-ota-vin");
  const inputDate = document.getElementById("input-ota-date");
  const btnToday = document.getElementById("btn-ota-today");
  const btnCopyPin = document.getElementById("btn-copy-pin");
  const vinPreview = document.getElementById("ota-vin-preview");
  const labelVinDigits = document.getElementById("label-vin-digits");
  const labelDateYymmdd = document.getElementById("label-date-yymmdd");
  const digitsContainer = document.getElementById("ota-digits-container");

  if (!inputVin || !inputDate) return;

  const setTodayDate = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    inputDate.value = `${yyyy}-${mm}-${dd}`;
    calculatePin();
  };

  btnToday?.addEventListener("click", (e) => {
    e.preventDefault();
    setTodayDate();
  });

  inputDate.addEventListener("change", calculatePin);
  inputDate.addEventListener("input", calculatePin);
  inputVin.addEventListener("input", calculatePin);

  function calculatePin() {
    const rawVin = (inputVin.value || "").trim().toUpperCase();

    // Extract last 6 digits: either consecutive digits at end or last 6 chars if all digits
    let vin6Str = "";
    const matchDigits = rawVin.match(/\d{6}$/);
    if (matchDigits) {
      vin6Str = matchDigits[0];
    } else {
      const last6 = rawVin.slice(-6);
      if (/^\d{6}$/.test(last6)) {
        vin6Str = last6;
      }
    }

    if (vin6Str) {
      if (labelVinDigits) {
        labelVinDigits.textContent = `Últimos 6: ${vin6Str}`;
        labelVinDigits.className = "ota-helper success";
      }
      if (vinPreview) {
        vinPreview.textContent = `✔ 6 números detectados: ${vin6Str}`;
        vinPreview.className = "ota-helper success";
      }
    } else if (rawVin.length > 0) {
      if (labelVinDigits) {
        labelVinDigits.textContent = "6 dígitos requeridos al final";
        labelVinDigits.className = "ota-helper error";
      }
      if (vinPreview) {
        vinPreview.textContent = "El final del bastidor debe contener 6 números (ej: 267123).";
        vinPreview.className = "ota-helper error";
      }
    } else {
      if (labelVinDigits) {
        labelVinDigits.textContent = "6 dígitos requeridos";
        labelVinDigits.className = "ota-helper";
      }
      if (vinPreview) {
        vinPreview.textContent = "Introduce el VIN completo o solo los últimos 6 números.";
        vinPreview.className = "ota-helper";
      }
    }

    let dateStr = inputDate.value;
    if (!dateStr) {
      setTodayDate();
      dateStr = inputDate.value;
    }

    const [yyyy, mm, dd] = dateStr.split("-");
    const yy = yyyy ? yyyy.slice(-2) : "";
    const yyMMdd = `${yy}${mm}${dd}`;
    if (labelDateYymmdd) {
      labelDateYymmdd.textContent = `yyMMdd: ${yyMMdd}`;
    }

    if (vin6Str && yyMMdd && yyMMdd.length === 6) {
      try {
        const vinNum = BigInt(parseInt(vin6Str, 10));
        const dateNum = BigInt(parseInt(yyMMdd, 10));
        const pinVal = ((vinNum + 123456n) * dateNum) % 1000000n;
        const pinFormatted = String(Number(pinVal)).padStart(6, "0");

        renderDigits(pinFormatted);
        if (btnCopyPin) {
          btnCopyPin.disabled = false;
          btnCopyPin.setAttribute("data-pin", pinFormatted);
          btnCopyPin.innerHTML = `<span>📋 Copiar PIN (${pinFormatted})</span>`;
        }
        return;
      } catch (e) {
        console.error("Error al calcular el PIN OTA:", e);
      }
    }

    renderDigits(null);
    if (btnCopyPin) {
      btnCopyPin.disabled = true;
      btnCopyPin.innerHTML = "<span>📋 Copiar PIN</span>";
    }
  }

  function renderDigits(pin) {
    if (!digitsContainer) return;
    if (!pin) {
      digitsContainer.innerHTML = Array(6)
        .fill(0)
        .map(() => '<div class="ota-digit empty">-</div>')
        .join("");
    } else {
      digitsContainer.innerHTML = pin
        .split("")
        .map((d) => `<div class="ota-digit">${d}</div>`)
        .join("");
    }
  }

  btnCopyPin?.addEventListener("click", () => {
    const pin = btnCopyPin.getAttribute("data-pin");
    if (!pin) return;
    navigator.clipboard.writeText(pin).then(() => {
      const orig = btnCopyPin.innerHTML;
      btnCopyPin.innerHTML = "<span>✔ ¡PIN Copiado!</span>";
      setTimeout(() => {
        btnCopyPin.innerHTML = orig;
      }, 2000);
    });
  });

  setTodayDate();
}

initOtaCalculator();