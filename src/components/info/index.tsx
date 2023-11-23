type Info = {
  label: string;
  content: string | number;
  className?: string;
};


export function Info({ content, label, className }: Info) {
  return (
    <div className={className}>
      <label>{label}</label>
      <p>{content}</p>
    </div>
  );
}