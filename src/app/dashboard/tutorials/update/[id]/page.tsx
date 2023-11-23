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
import { useCallback } from 'react';



export default function ProductView({ params }: { params: { id: string}}) {
  const queryClient = useQueryClient()
  const navigation = useRouter()
  const { data: tutorial, isLoading } = useQuery<TutorialResponseApi>(
    QUERY_KEYS.TUTORIALS.GET(params.id),
    async () => ApiService.Tutorial.get({ id: params.id })
  );

  const updateTutorial = useMutation({
    mutationFn: async (tutorial: TutorialRequestApi) => {
      await ApiService.Tutorial.update({ ...tutorial, id: Number(params.id)  })
    },
    onSuccess: (_data, tutorial) => {
      queryClient.setQueryData<TutorialRequestApi>(
        QUERY_KEYS.TUTORIALS.UPDATE(params.id),
        (oldTutorial) => {
          if (!oldTutorial) return
          return tutorial
        },
      )

      toast.success(`O tutorial ${tutorial.nome} foi atualizado com sucesso!`)

      navigation.push(ROUTES.TUTORIALS.LIST)
    },
    onError: (_error, tutorial) => {
      toast.error(`Erro ao editar ${tutorial.nome}!`)
    },
  })

  const handleDeleteTutorial = useCallback(async () => {
    try {
      await ApiService.Tutorial.remove({ id: Number(params?.id) })
      toast.success('Registro removido com sucesso')
      navigation.push(ROUTES.TUTORIALS.LIST)
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro ao excluir o registro')
    }
  }, [navigation, params?.id])

  if (isLoading || !tutorial) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl container-details-product'>
      <div className='container-header'>
        <div className='container-button'>
        <button onClick={() => { navigation.push(ROUTES.TUTORIALS.LIST)}} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
          Listar
        </button>
        <button style={{ marginLeft: '1rem' }} onClick={handleDeleteTutorial} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
          Excluir
        </button>
        </div>
      </div>
      <Form tutorial={tutorial} isEditMode onSave={async tutorial => {
        updateTutorial.mutate(tutorial)
      }} />
    </div>
  )
}