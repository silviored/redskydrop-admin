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
  const { data: category, isLoading } = useQuery<CategoryResponseApi>(
    QUERY_KEYS.CATEGORIES.GET(params.id),
    async () => ApiService.Category.get({ id: params.id })
  );

  const updateCategory = useMutation({
    mutationFn: async (category: CategoryRequestApi) => {
      await ApiService.Category.update({ ...category, id: Number(params.id) })
    },
    onSuccess: (_data, category) => {
      queryClient.invalidateQueries(QUERY_KEYS.CATEGORIES.UPDATE(params.id))

      toast.success(`A categoria ${category.nome} foi atualizado com sucesso!`)

      navigation.push(ROUTES.CATEGORIES.LIST)
    },
    onError: (_error, category) => {
      toast.error(`Erro ao editar ${category.nome}!`)
    },
  })

  if (isLoading || !category) {
    return <Loading />
  }
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
      <Form category={category} isEditMode onSave={async category => {
        updateCategory.mutate(category)
      }} />
    </div>
  )
}