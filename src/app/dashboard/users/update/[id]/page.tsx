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



export default function UserView({ params }: { params: { id: string}}) {
  const queryClient = useQueryClient()
  const navigation = useRouter()
  const { data: user, isLoading } = useQuery<UserResponseApi>(
    QUERY_KEYS.USERS.GET(params.id),
    async () => ApiService.User.get({ id: params.id })
  );

  const updateUser = useMutation({
    mutationFn: async (user: UserRequestApi) => {
      await ApiService.User.update({ ...user, ativado: user?.plano_id ? '1' : '0', id: params.id})
    },
    onSuccess: (_data, user) => {
      queryClient.invalidateQueries<UserRequestApi>()

      toast.success(`O usuário ${user.nome} foi atualizado com sucesso!`)

      navigation.push(ROUTES.USERS.LIST)
    },
    onError: (_error, user) => {
      toast.error(`Erro ao editar ${user.nome}!`)
    },
  })

  if (isLoading || !user) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl container-details-user'>
      <div className='container-header'>
        <div className='container-button'>
        <button onClick={() => { navigation.push(ROUTES.USERS.LIST)}} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
          Listar
        </button>
        </div>
      </div>
      <Form user={user} isEditMode onSave={async user => {
        updateUser.mutate(user)
      }} />
    </div>
  )
}