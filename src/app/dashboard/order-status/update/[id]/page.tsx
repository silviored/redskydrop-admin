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
  const { data: status, isLoading } = useQuery<StatusResponseApi>(
    QUERY_KEYS.STATUS.GET(params.id),
    async () => ApiService.Status.get({ id: params.id })
  );

  const updateStatus = useMutation({
    mutationFn: async (status: StatusRequestApi) => {
      await ApiService.Status.update({ ...status, id: Number(params.id)  })
    },
    onSuccess: (_data, status) => {
      queryClient.setQueryData<StatusRequestApi>(
        QUERY_KEYS.STATUS.UPDATE(params.id),
        (oldStatus) => {
          if (!oldStatus) return
          return status
        },
      )

      toast.success(`O status ${status.nome} foi atualizado com sucesso!`)

      navigation.push(ROUTES.STATUS.LIST)
    },
    onError: (_error, status) => {
      toast.error(`Erro ao editar ${status.nome}!`)
    },
  })

  if (isLoading || !status) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl container-details-product'>
      <div className='container-header'>
        <div className='container-button'>
        <button onClick={() => { navigation.push(ROUTES.STATUS.LIST)}} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
          Listar
        </button>
        </div>
      </div>
      <Form status={status} isEditMode onSave={async status => {
        updateStatus.mutate(status)
      }} />
    </div>
  )
}