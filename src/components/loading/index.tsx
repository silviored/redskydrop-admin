import { TwoSeventyRing } from 'react-svg-spinners';
import './styles.css';

export function Loading() {
  return (
    <div className='container-loading-overlay'>
      <div className='container-loading-spin'>
        <TwoSeventyRing color='#fff' />
      </div>
    </div>
  );
}
