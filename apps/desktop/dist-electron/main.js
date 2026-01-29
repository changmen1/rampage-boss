import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
createRequire(import.meta.url);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let settingsWindow = null;
let width = 200;
let height = 230;
function createWindow() {
  win = new BrowserWindow({
    width,
    height,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    alwaysOnTop: true,
    // 置顶
    frame: false,
    // 无边框
    transparent: true,
    // 透明背景
    hasShadow: false,
    // 无阴影
    resizable: false,
    // 禁止调整大小
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  ipcMain.on("minimize-window", () => {
    win == null ? void 0 : win.minimize();
  });
  ipcMain.on("close-window", () => {
    win == null ? void 0 : win.close();
  });
  ipcMain.on("open-settings", () => {
    if (settingsWindow) {
      settingsWindow.focus();
      return;
    }
    settingsWindow = new BrowserWindow({
      width: 300,
      height: 400,
      title: "设置",
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      maximizable: false,
      webPreferences: {
        preload: path.join(__dirname$1, "preload.mjs")
      }
    });
    const url = VITE_DEV_SERVER_URL ? `${VITE_DEV_SERVER_URL}#/settings` : `${path.join(RENDERER_DIST, "index.html")}#settings`;
    if (VITE_DEV_SERVER_URL) {
      settingsWindow.loadURL(url);
    } else {
      settingsWindow.loadFile(path.join(RENDERER_DIST, "index.html"), { hash: "settings" });
    }
    settingsWindow.on("closed", () => {
      settingsWindow = null;
    });
  });
  ipcMain.on("update-settings", (_event, args) => {
    if (args.type === "opacity") {
      win == null ? void 0 : win.setOpacity(args.value);
    }
  });
  ipcMain.on("attack-flying-kick", () => {
    if (!win) return;
    const [ox, oy] = win.getPosition();
    const [width2, height2] = win.getSize();
    const start = Date.now();
    const duration = 600;
    const timer = setInterval(() => {
      const t = Date.now() - start;
      if (t > duration) {
        clearInterval(timer);
        win == null ? void 0 : win.setBounds({ x: ox, y: oy, width: width2, height: height2 });
        return;
      }
      const x = ox + Math.round(Math.sin(t / 30) * 10);
      const y = oy + Math.round(Math.cos(t / 45) * 6);
      win == null ? void 0 : win.setBounds({
        x,
        y,
        width: width2,
        height: height2
      }, false);
    }, 16);
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
