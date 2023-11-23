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
  const { data: product, isLoading } = useQuery<ProductResponseApi>(
    QUERY_KEYS.PRODUCTS.GET(params.id),
    async () => ApiService.Product.get({ id: params.id })
  );

  const updateProduct = useMutation({
    mutationFn: async (product: ProductRequestApi) => {
      const formData = new FormData()
      if(product?.video?.[0]) {
        formData.append('video', product?.video?.[0])
      }
      product?.fotos?.forEach((photo: string[]) => {
        if(photo?.[0]){
          formData.append('fotos', photo[0])
        }
      })
      formData.append('produtosVariacoes', JSON.stringify(product.produtosVariacoes))
      delete product.produtosVariacoes
      delete product.fotos
      delete product.video
      Object.entries(product).forEach(([key, value]) => {
        if(!value || value === 'undefined' || value === 'null') return
        formData.append(key, value)
      })
      await ApiService.Product.update(formData, params.id)
    },
    onSuccess: (_data, product) => {
      queryClient.invalidateQueries<ProductRequestApi>()

      toast.success(`A marca ${product.nome} foi atualizado com sucesso!`)

      navigation.push(ROUTES.PRODUCTS.LIST)
    },
    onError: (_error, product) => {
      toast.error(`Erro ao editar ${product.nome}!`)
    },
  })

  if (isLoading || !product) {
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
      <Form product={product} isEditMode onSave={async product => {
        updateProduct.mutate(product)
      }} />
    </div>
  )
}