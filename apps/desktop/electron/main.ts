import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let settingsWindow: BrowserWindow | null = null
let width = 200;
let height = 230;

function createWindow() {
  win = new BrowserWindow({
    width: width,
    height: height,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    alwaysOnTop: true, // 置顶
    frame: false,      // 无边框
    transparent: true, // 透明背景
    hasShadow: false,  // 无阴影
    resizable: false,  // 禁止调整大小
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  // 隐藏应用
  ipcMain.on('minimize-window', () => {
    win?.minimize()
  })

  // 关闭应用
  ipcMain.on('close-window', () => {
    win?.close()
  })

  ipcMain.on('open-settings', () => {
    if (settingsWindow) {
      settingsWindow.focus();
      return;
    }

    settingsWindow = new BrowserWindow({
      width: 300,
      height: 400,
      title: '设置',
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      maximizable: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.mjs'),
      },
    });

    const url = VITE_DEV_SERVER_URL
      ? `${VITE_DEV_SERVER_URL}#/settings`
      : `${path.join(RENDERER_DIST, 'index.html')}#settings`;

    if (VITE_DEV_SERVER_URL) {
      settingsWindow.loadURL(url);
    } else {
      settingsWindow.loadFile(path.join(RENDERER_DIST, 'index.html'), { hash: 'settings' });
    }

    settingsWindow.on('closed', () => {
      settingsWindow = null;
    });
  });

  ipcMain.on('update-settings', (_event, args) => {
    if (args.type === 'opacity') {
      win?.setOpacity(args.value);
    }
  });

  // 飞踢
  ipcMain.on('attack-flying-kick', () => {
    if (!win) return;

    const [ox, oy] = win.getPosition();
    const [width, height] = win.getSize();

    const start = Date.now();
    const duration = 600;

    const timer = setInterval(() => {
      const t = Date.now() - start;
      if (t > duration) {
        clearInterval(timer);
        // 结束时回归原始位置并锁定尺寸
        win?.setBounds({ x: ox, y: oy, width, height });
        return;
      }

      const x = ox + Math.round(Math.sin(t / 30) * 10);
      const y = oy + Math.round(Math.cos(t / 45) * 6);

      win?.setBounds({
        x,
        y,
        width,
        height
      }, false);
    }, 16);
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
