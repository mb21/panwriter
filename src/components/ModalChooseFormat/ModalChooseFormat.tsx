import { useEffect, useState } from 'react'
import { Button } from '../Button/Button'

import tick from './tick.svg'
import styles from './ModalChooseFormat.module.css'

export const ModalChooseFormat = () => {
  const [format, setFormat] = useState(getPreviouslyUsedFormat)
  const [success, setSuccess] = useState(false)

  const submit = async (format: string) => {
    if (window.ipcApi) {
      const success = await window.ipcApi.chooseFormat(format)
      if (success) {
        setSuccess(true)
        setTimeout(() => window.close(), 1500)
        window.localStorage.setItem('modalChooseFormat', JSON.stringify({ format }))
      } else {
        window.close()
      }
    }
  }

  const cancel = () => {
    window.ipcApi?.chooseFormat('closingWindow')
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
      {success
        ? <img className={styles.tick} alt='Success' src={tick} width={100} />
        : <>
            <p className={styles.text}>To which format do you want to export to clipboard?</p>
            <select autoFocus value={format} onChange={e => setFormat(e.target.value)}>
              { formats.map(({name, value}) =>
                  <option value={value} key={value}>{name}</option>) }
            </select>
            <Button onClick={() => submit(format)} variant='primary'>Export</Button>
            <Button onClick={() => cancel()} variant='secondary'>Cancel</Button>
          </>
      }
    </div>
  )
}

const getPreviouslyUsedFormat = (): string => {
  try {
    const prev = window.localStorage.getItem('modalChooseFormat')
    if (prev) {
      return JSON.parse(prev).format
    }
  } catch (e) {
  }
  return 'html'
}

// see also list of standalone output formats in export.ts
const formats = [
  { name: 'HTML (html)',                       value: 'html' }
, { name: 'LaTeX (latex)',                     value: 'latex' }
, { name: 'ConTeXt (context)',                 value: 'context' }
, { name: 'InDesign ICML (icml)',              value: 'icml' }
, { name: 'RTF (rtf)',                         value: 'rtf' }
, { name: 'DocBook XML (docbook)',             value: 'docbook' }
, { name: 'JATS XML (jats)',                   value: 'jats' }
, { name: 'Text Encoding Initiative (tei)',    value: 'tei' }
, { name: 'OPML (opml)',                       value: 'opml' }
, { name: 'FictionBook2 (fb2)',                value: 'fb2' }
, { name: 'groff (ms)',                        value: 'ms' }
, { name: 'GNU Texinfo (texinfo)',             value: 'texinfo' }
, { name: 'Textile (textile)',                 value: 'textile' }
, { name: 'Jira/Confluence (jira)',            value: 'jira' }
, { name: 'DokuWiki (dokuwiki)',               value: 'dokuwiki' }
, { name: 'MediaWiki (mediawiki)',             value: 'mediawiki' }
, { name: 'Muse (muse)',                       value: 'muse' }
, { name: 'ZimWiki (zimwiki)',                 value: 'zimwiki' }
, { name: 'AsciiDoc (asciidoc)',               value: 'asciidoc' }
, { name: 'Emacs Org mode (org)',              value: 'org' }
, { name: 'reStructuredText (rst)',            value: 'rst' }
, { name: 'Markdown (md)',                     value: 'md' }
, { name: 'Plain text (txt)',                  value: 'txt' }
]
