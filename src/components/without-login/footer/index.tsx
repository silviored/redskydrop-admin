import './styles.css';

type FooterProps = {
  className?: string;
};
export function Footer({ className }: FooterProps) {
  return (
    <footer className='container-footer'>
      <div>
        <p className={'text-white ' + className}>
          &copy; {process.env.NEXT_PUBLIC_COMPANY_NAME}
        </p>
      </div>
    </footer>
  );
}
