"use client"
import './styles.css'
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Form } from '../_components/form';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/keys';
import { ApiService } from '@/services';
import { Loading } from '@/components/loading';

export default function BrandView() {
  const navigation = useRouter()
  const query = useSearchParams()
  const product_id = query.get('product_id')
  const { data: product, isLoading } = useQuery<ProductResponseApi>(
    QUERY_KEYS.PRODUCTS.GET(product_id || ''),
    async () => ApiService.Product.get({ id: product_id as string }),
    {
      enabled: !!product_id
    }
  );


  if (product_id && isLoading) {
    return <Loading />
  }

  return (
    <div className='bg-white rounded-2xl shadow-2xl container-details-product'>
      <div className='container-header'>
        <div className='container-button'>
        <button onClick={() => { navigation.push(ROUTES.PRODUCTS.LIST)}} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
          Listar
        </button>
        </div>
      </div>
      <Form type='create' product={product} isEditMode={!!product_id}/>
    </div>
  )
}