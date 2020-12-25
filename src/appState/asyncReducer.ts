// import { ipcRenderer } from 'electron'

import { PureAction } from './pureReducer'

export type Action = PureAction | {
  type: 'printPreview';
}

// modelled after https://gist.github.com/astoilkov/013c513e33fe95fa8846348038d8fe42#solution-3
export const asyncReducer = (
  dispatch: React.Dispatch<PureAction>
) => (async (action: Action): Promise<void> => {
  switch (action.type) {
    case 'printPreview': {
      return
    }
    case 'setText': {
      // ipcRenderer.send('setWindowDirty')
      // renderPreview(state)
      return dispatch(action)
    }
    default: {
      return dispatch(action)
    }
  }
})
