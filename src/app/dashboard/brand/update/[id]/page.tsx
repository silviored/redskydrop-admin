"use client"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import './styles.css'
import { QUERY_KEYS } from '@/constants/keys';
import { ApiService } from '@/services';
import { Loading } from '@/components/loading';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Form } from '../../_components/form';
import { toast } from 'react-toastify';



export default function ProductView({ params }: { params: { id: string}}) {
  const queryClient = useQueryClient()
  const navigation = useRouter()
  const { data: brand, isLoading } = useQuery<BrandResponseApi>(
    QUERY_KEYS.BRANDS.GET(params.id),
    async () => ApiService.Brand.get({ id: params.id })
  );

  const updateBrand = useMutation({
    mutationFn: async (brand: BrandRequestApi) => {
      await ApiService.Brand.update({ ...brand, id: Number(params.id)  })
    },
    onSuccess: (_data, brand) => {
      queryClient.setQueryData<BrandRequestApi>(
        QUERY_KEYS.BRANDS.UPDATE(params.id),
        (oldBrand) => {
          if (!oldBrand) return
          return brand
        },
      )

      toast.success(`A marca ${brand.nome} foi atualizado com sucesso!`)

      navigation.push(ROUTES.BRANDS.LIST)
    },
    onError: (_error, brand) => {
      toast.error(`Erro ao editar ${brand.nome}!`)
    },
  })

  if (isLoading || !brand) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl container-details-product'>
      <div className='container-header'>
        <div className='container-button'>
        <button onClick={() => { navigation.push(ROUTES.BRANDS.LIST)}} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
          Listar
        </button>
        </div>
      </div>
      <Form brand={brand} isEditMode onSave={async brand => {
        updateBrand.mutate(brand)
      }} />
    </div>
  )
}