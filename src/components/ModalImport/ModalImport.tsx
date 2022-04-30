import { useEffect, useReducer } from 'react'

import { ImportOpts } from '../../options'
import { Button } from '../Button/Button'

import styles from './ModalImport.module.css'

type Action = {
  type: 'setFromFormat';
  fromFormat: string;
}

const reducer = (state: ImportOpts, action: Action): ImportOpts => {
  switch (action.type) {
    case 'setFromFormat': {
      const { fromFormat } = action
      return { ...state, fromFormat }
    }
  }
}

const initialOpts: ImportOpts = {
  fromFormat: new URLSearchParams(document.location.search).get('detectedFormat') || 'docx'
}

const submit = async (importOpts: ImportOpts) => {
  await window.ipcApi?.importFile(importOpts)
  window.close()
}

const cancel = () => {
  window.ipcApi?.importFile('closingWindow')
  window.close()
}

export const ModalImport = () => {
  const [importOpts, dispatch] = useReducer(reducer, initialOpts)

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        submit(importOpts)
      } else if (e.key === 'Escape') {
        cancel()
      }
    }
    document.body.addEventListener('keydown', keyHandler)
    return () => document.body.removeEventListener('keydown', keyHandler)
  }, [importOpts])

  return (
    <div className={styles.root}>
      <p className={styles.text}>Which format do you want to import from?</p>
      <select
        autoFocus
        value={importOpts.fromFormat}
        onChange={e => dispatch({type: 'setFromFormat', fromFormat: e.target.value })}
        >
        {formats.map(({name, value}) =>
          <option value={value} key={value}>{name}</option>) }
      </select>
      <Button onClick={() => submit(importOpts)} variant='primary'>Import</Button>
      <Button onClick={() => cancel()} variant='secondary'>Cancel</Button>
    </div>
  )
}

// see also list of standalone output formats in export.ts
const formats = [
  { name: 'HTML (html)',                       value: 'html' }
, { name: 'LaTeX (latex)',                     value: 'latex' }
, { name: 'ConTeXt (context)',                 value: 'context' }
]
