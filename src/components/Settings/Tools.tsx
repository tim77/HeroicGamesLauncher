import React from 'react'
import { WineProps } from '../../types'
const { ipcRenderer, remote } = window.require('electron')
const {
  dialog: { showOpenDialog },
} = remote

interface Props {
  wineVersion: WineProps
  winePrefix: string
}

export default function Tools({ wineVersion, winePrefix }: Props) {
  const callTools = (tool: string, exe?: string) =>
    ipcRenderer.send('callTool', {
      tool,
      wine: wineVersion.bin,
      prefix: winePrefix,
      exe,
    })

  const handleRunExe = async () => {
    let exe = ''
    const { filePaths } = await showOpenDialog({
      title: 'Select EXE to Run',
      buttonLabel: 'Select',
      properties: ['openFile'],
      filters: ['exe', 'msi'],
    })
    if (filePaths[0]) {
      exe = filePaths[0]
      return callTools('runExe', exe)
    }
    return
  }

  function dropHandler(ev: any) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault()

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[0].kind === 'file') {
        const exe = ev.dataTransfer.items[0].getAsFile().path

        return callTools('runExe', exe)
      }
    }
    return
  }

  function dragOverHandler(ev: any) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault()
  }

  return (
    <>
      <div className="settingsTools">
        <div className="toolsWrapper">
          <span className="tools" onClick={() => callTools('winecfg')}>
            Winecfg
          </span>
          <span className="tools" onClick={() => callTools('winetricks')}>
            Winetricks
          </span>
          <span
            draggable
            onDrop={(ev) => dropHandler(ev)}
            onDragOver={(ev) => dragOverHandler(ev)}
            className="tools drag"
            onClick={() => handleRunExe()}
          >
            Run EXE inside prefix <br />
            <span>You can drag and Drop files here</span>
          </span>
        </div>
      </div>
    </>
  )
}
