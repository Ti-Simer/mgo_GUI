const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('customTitlebar', {
    minimize: () => ipcRenderer.invoke('custom-titlebar:minimize-btn'),
    maximize: () => ipcRenderer.invoke('custom-titlebar:maximize-btn'),
    close: () => ipcRenderer.invoke('custom-titlebar:close-btn')
});