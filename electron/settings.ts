import { app } from 'electron'
import { sep } from 'path'
const ElectronPreferences = require('electron-preferences');

const defaultDataDir = [app.getPath('appData'), 'PanWriterUserData', ''].join(sep)

export const pandocPreferences = new ElectronPreferences({
    'dataStore': defaultDataDir + 'preferences.json',
     'defaults': {
      'main': {
        'userDataDir': defaultDataDir,
        'autoUpdate' : 'true'
      }
     },
     'sections': [
      {
        'id': 'main',
        'label': 'Main',
        'form': {
          'groups': [
            {
                'label': 'Directories',
                'fields': [
                    {
                        'label': 'User data directory',
                        'key': 'userDataDir',
                        'type': 'directory',
                        'help': 'PanWriter user directory'
                    }
                ]
            },
            {
              'label': 'Updates',
              'fields': [
                {
                    'label': 'Auto Update',
                    'key': 'autoUpdate',
                    'type': 'radio',
                    'options': [{ label: 'Yes', value: 'true' }, {'label': 'No', 'value': 'false'}],
                    'help': 'Automatic upgrade to new versions'
                }
            ]
            }
          ]
        }
      }
     ]
  })
