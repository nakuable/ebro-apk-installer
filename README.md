# 🚗 EBRO S700 & Desay SV | WebUSB Sideload Hub

Instalador web de aplicaciones para coches **EBRO S700** y plataformas multimedia **Desay SV** (Chery Tiggo 7 Pro Max, Haval, GWM, etc.) basado en el estándar **WebUSB**.

Permite instalar cualquier aplicación (.apk) o release de GitHub en la pantalla multimedia del coche **directamente desde el navegador (Google Chrome o Edge)**, sin necesidad de instalar Python, Java, drivers ni el SDK de Android (ADB) en el ordenador.

---

## ⚡ ¿Cómo funciona el bypass de instalación?

Las plataformas multimedia Desay SV bloquean el comando estándar `adb install` / `pm install` devolviendo el error `SecurityException: Restriction prevents installing` (-115).

Esta herramienta elude la restricción de forma nativa:
1. Se conecta mediante el protocolo **WebADB / WebUSB** directamente desde el navegador a la conexión USB del coche.
2. Inyecta en memoria el micro-módulo Java `dex_shell_helper.dex` en `/data/local/tmp/`.
3. Invoca la máquina virtual del sistema (`app_process`) con los flags de sesión `0x116`, abriendo una sesión nativa en el servicio `PackageInstaller` del sistema operativo Android del coche.
4. Escribe el APK directamente y concede los permisos esenciales (ubicación, ventanas flotantes, etc.).

---

## 🚀 Cómo publicar esta web en GitHub Pages (en 2 minutos)

No necesitas usar comandos de git en la consola si no quieres; puedes hacerlo directamente desde la web de GitHub:

1. **Crea un repositorio en GitHub:**
   * Entra en [github.com/new](https://github.com/new).
   * Nombre del repositorio: `ebro-sideload` (o el que prefieras).
   * Márcalo como **Público** y pulsa **Create repository**.

2. **Sube los archivos de esta carpeta:**
   * Pulsa en **uploading an existing file** (subir archivos existentes).
   * Arrastra los archivos de esta carpeta:
     * `index.html`
     * `style.css`
     * `app.js`
     * `dex_shell_helper.dex`
     * `ehbeta-v214.apk`
   * Haz clic en **Commit changes**.

3. **Activa GitHub Pages:**
   * En tu repositorio, entra en **Settings** (Configuración) ➔ pestaña **Pages** (en el menú lateral izquierdo).
   * En **Build and deployment** ➔ **Branch**: selecciona `main` (o `master`) y la carpeta `/(root)`.
   * Haz clic en **Save**.

En unos segundos, tendrás tu propio instalador disponible en:
`https://<tu-usuario>.github.io/ebro-sideload/`

---

## 📱 Cómo usar el instalador

1. Conecta tu portátil al puerto USB del EBRO con un cable USB.
2. Abre tu página de GitHub Pages en **Google Chrome** o **Microsoft Edge** (en Windows, Mac o Linux).
3. Asegúrate de no tener ningún comando `adb.exe` abierto en tu ordenador (WebUSB requiere acceso exclusivo al USB).
4. Pulsa el botón **"⚡ Conectar Coche por USB"** y selecciona el dispositivo en la ventana emergente de Chrome.
5. Elige la aplicación a instalar:
   * **Desde el Catálogo:** Pulsa en *Ebro Horizon Beta*, *Floating Dock*, o *SmartTube*.
   * **Desde GitHub:** Introduce cualquier repositorio (ej. `yuliskov/SmartTube` o un link directo al `.apk`).
   * **Arrastrar y Soltar:** Arrastra cualquier archivo `.apk` de tu ordenador al navegador.
6. ¡Listo! La barra de progreso mostrará la subida y en unos segundos la app aparecerá instalada en la pantalla de tu coche.

---

## 🔒 Privacidad y Seguridad
* **100% en el navegador (Client-Side):** Ni los archivos ni tus credenciales se envían a ningún servidor externo.
* Las claves criptográficas RSA de ADB se generan de forma segura en tu propio navegador usando la API Web Crypto (`IndexedDB`).
