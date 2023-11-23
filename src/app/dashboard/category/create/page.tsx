"use client"
import './styles.css'
import { ROUTES } from '@/constants/routes';
import { Form } from '../_components/form';
import { useRouter } from 'next/navigation'



export default function ProductView({ params }: { params: { id: string}}) {
  const navigation = useRouter()
  return (
    <div className='bg-white rounded-2xl shadow-2xl container-details-product'>
      <div className='container-header'>
        <div className='container-button'>
        <button style={{ marginRight: 0 }} onClick={() => {
          navigation.push(ROUTES.CATEGORIES.LIST)
        }} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
          Listar
        </button>
        </div>
      </div>
      <Form />
    </div>
  )
}