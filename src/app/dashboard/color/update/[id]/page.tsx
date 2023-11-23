"use client"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import './styles.css'
import { QUERY_KEYS } from '@/constants/keys';
import { ApiService } from '@/services';
import { Loading } from '@/components/loading';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Form } from '../../_components/form';
import { toast } from 'react-toastify';
import { Modal } from '@/components/modal';
import { useCallback } from 'react';
import { ApiError } from 'next/dist/server/api-utils';



export default function ProductView({ params }: { params: { id: string}}) {
  const navigation = useRouter()
  const queryClient = useQueryClient()
  const query = useSearchParams()
  const openModal = query.get('modal')
  const { data: color, isLoading } = useQuery<ColorResponseApi>(
    QUERY_KEYS.COLORS.GET(params.id),
    async () => ApiService.Color.get({ id: params.id })
  );

  const updateColor = useMutation({
    mutationFn: async (color: ColorRequestApi) => {
      await ApiService.Color.update({ ...color, id: Number(params.id) })
    },
    onSuccess: (_data, color) => {
      queryClient.invalidateQueries<ColorRequestApi>(
        QUERY_KEYS.COLORS.UPDATE(params.id),
      )

      toast.success(`A cor ${color.nome} foi atualizado com sucesso!`)

      navigation.push(ROUTES.COLORS.LIST)
    },
    onError: (_error, color) => {
      toast.error(`Erro ao editar ${color.nome}!`)
    },
  })

  const handleCLoseModal = useCallback(() => {
    navigation.replace(ROUTES.COLORS.EDIT(color?.id?.toString() as string))
  }, [navigation, color?.id])
  
  const handleOpenModal = useCallback(() => {
    navigation.replace(`?modal=true`)
  }, [navigation])
  
  const handleRemove = useCallback(async () => {
    if(!color?.id) return
    try {
      await ApiService.Color.remove({ id: color.id })
      navigation.push(ROUTES.COLORS.LIST)
      toast.success('Cor removida com sucesso', {
        toastId: 'toast-removed'
      })

    } catch (error: unknown) {
      toast.error((error as ApiError).message || 'Ocorreu um erro ao excluir sua cor')
    }
  }, [color?.id, navigation])

  if (isLoading || !color) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl container-details-product'>
      <div className='container-header'>
        <div className='container-button'>
        <button onClick={handleOpenModal} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
          Remover
        </button>
        </div>
      </div>
      <Form color={color} isEditMode onSave={async color => {
        updateColor.mutate(color)
      }} />

<Modal 
    onClose={handleCLoseModal}
    visible={openModal === 'true'}
   >
    <div className='mt-4 color-container-modal-content'>
    <strong>Realmente deseja excluir o registro {color?.nome} ?</strong>
      <div className='color-container-button-modal-action'>
      <button
          type='button'
          onClick={handleCLoseModal}
          className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
        >
          Não
        </button>
        <button
          type='button'
          className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
          onClick={handleRemove}
        >
          Sim
        </button>
      </div>
    </div>
   </Modal>
    </div>
  )
}