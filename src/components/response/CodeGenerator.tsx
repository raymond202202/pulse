import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequestStore } from '../../stores/requestStore'
import { generateCode, type CodeLanguage } from '../../lib/codeGen'
import { Check, Code, Copy, X } from 'lucide-react'

const LANGUAGES: { value: CodeLanguage; label: string }[] = [
  { value: 'curl', label: 'cURL' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'httpie', label: 'HTTPie' },
]

interface Props {
  onClose: () => void
}

export function CodeGenerator({ onClose }: Props) {
  const { t } = useTranslation()
  const { request } = useRequestStore()
  const [lang, setLang] = useState<CodeLanguage>('curl')
  const [copied, setCopied] = useState(false)

  const code = generateCode(request, lang)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="codegen-overlay" onClick={onClose}>
      <div className="codegen-modal" onClick={(e) => e.stopPropagation()}>
        <div className="codegen-header">
          <div className="codegen-title">
            <Code size={14} />
            {t('generateCode')}
          </div>
          <button onClick={onClose} className="codegen-close">
            <X size={14} />
          </button>
        </div>

        <div className="codegen-langs">
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              onClick={() => { setLang(l.value); setCopied(false) }}
              className={`codegen-lang-btn ${lang === l.value ? 'active' : ''}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <pre className="codegen-code">{code}</pre>

        <div className="codegen-footer">
          <button onClick={handleCopy} className="codegen-copy-btn">
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? t('copied') : t('copyCode')}
          </button>
        </div>
      </div>
    </div>
  )
}
