import './styles.css'

type TextProps = {
  label?: string
  value?: string | number
}

export function Text({ label, value }: TextProps) {
  return (
    <div>
      <label>{label}</label>
      <p>{value}</p>
    </div>
  )
}