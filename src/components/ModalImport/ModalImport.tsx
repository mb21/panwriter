import { useEffect, useState } from 'react'
import { Button } from '../Button/Button'

import styles from './ModalImport.module.css'

export const ModalImport = () => {
  const [format, setFormat] = useState()

  const submit = async (format: string) => {
    await window.ipcApi?.importFile(format)
    window.close()
  }

  const cancel = () => {
    window.ipcApi?.importFile('closingWindow')
    window.close()
  }

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        submit(format)
      } else if (e.key === 'Escape') {
        cancel()
      }
    }
    document.body.addEventListener('keydown', keyHandler)
    return () => document.body.removeEventListener('keydown', keyHandler)
  }, [format])

  return (
    <div className={styles.root}>
      <p className={styles.text}>To which format do you want to export to clipboard?</p>
      <select autoFocus value={format} onChange={e => setFormat(e.target.value)}>
        { formats.map(({name, value}) =>
            <option value={value} key={value}>{name}</option>) }
      </select>
      <Button onClick={() => submit(format)} variant='primary'>Export</Button>
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
