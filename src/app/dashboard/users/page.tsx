"use client"
import InfiniteScroll from 'react-infinite-scroll-component'
import './styles.css'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Loading } from '@/components/loading'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { ApiService } from '@/services'
import { useRouter, useSearchParams } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import { useForm } from 'react-hook-form'
import { Info } from '@/components/info'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/keys'
import { Select } from '@/components/select'
import { SITUATIONS_USER_OPTIONS } from '@/constants/types'
import moment from 'moment'
import { MASKS } from '@/constants/mask'


type ResponseReportUserDashboard = {
  total_users: string
  total_users_not_subscribe: string
  total_users_subscribe: string
}


const TAKE_USERS = 20

export default function UsersList() {
  const navigation = useRouter()
  const query = useSearchParams()
  const ativado = query.get('ativado')
  const [users, setUsers] = useState<UserResponseApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const filterReactHookForm = useForm<FilterUserReportProps>()
const pathname = window.location.href
  
  const { data: reportUser, isLoading: isLoadingReportUser, refetch: refetchReportUser } = useQuery<ResponseReportUserDashboard>(
    QUERY_KEYS.USERS.REPORT_DASHBOARD,
    async () => ApiService.User.reportDashboard()
  );


  const handleLoadUsers = useCallback(async (data?: { reset: boolean }) => {
    try {
      const responseUsers = await ApiService.User.getAll({
        skip: data?.reset ? 0 : TAKE_USERS * (page - 1),
        take: TAKE_USERS,
        ativado,
      })
      setHasMore(!!responseUsers.items.length)
      setUsers(oldUsers => (data?.reset ? [...responseUsers.items] : [...oldUsers, ...responseUsers.items]))
      if(!responseUsers?.items.length) {
        toast.info('Você chegou ao final', {
          toastId: 'toast-id-end-data'
        })
        return
      }
      setPage(oldPage => oldPage + 1)
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [ativado, page])

  useEffect(() => {
    async function loadData() {
      await handleLoadUsers()
      setIsLoading(false)      
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  
  useEffect(() => {
    if(ativado) {
      setPage(0)
      handleLoadUsers({ reset: true })
    }
    if(pathname.includes('ativado')) {
      if(!ativado) {
        setPage(0)
        handleLoadUsers({ reset: true })
      }
    } else {
      setPage(0)
      handleLoadUsers({ reset: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativado, pathname])

  
  const handleSubmit = useCallback(async (data?: FilterUserReportProps) => {
    let url = ''
    if(data?.ativado) {
      url = `ativado=${data?.ativado}`
    }
    if(url){
      navigation.replace(`${ROUTES.USERS.LIST}?${url}`)
    }
  }, [navigation])
  
  const handleRemoveUser = useCallback(async (userData: UserResponseApi) => {
    setIsLoading(true)
    try {
      await ApiService.User.update({
        id: userData.id,
        deleted_at: moment().format(MASKS.DATE.EUA_WITHOUT_TIME)
      })
      refetchReportUser()
      setUsers(oldUsers => oldUsers.filter(oldUser => oldUser.id !== userData.id))
      toast.success(`Usuário ${userData.nome} removido com sucesso`)
    } catch (error) {
      toast.error('Ocorreu um erro ao excluir o usuário')
    } finally {
      setIsLoading(false)
    }
  }, [])

  if(isLoading || isLoadingReportUser) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl users-container'>
      <div className='users-wrapper-filter'>
        <h3 className='px-3 pt-2 page-title'>Usuários</h3>
        <div className='users-container-button-tools'>
          <button onClick={() => {
            navigation.push(ROUTES.USERS.CREATE)

          }} className='btn-container btn-add w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Adicionar</button>
        </div>
      </div>
      <div className='container-report-users'>
          <Info 
            label='Total de usuários'
            content={reportUser?.total_users || 0}
          />
          <Info 
            label='Total de usuários sem assinatura'
            content={reportUser?.total_users_not_subscribe || 0}
          />
          <Info 
            label='Total de assinantes'
            content={reportUser?.total_users_subscribe || 0}
          />
        </div>
        <div className='order-container-filter-container'>
          <form className='' onSubmit={filterReactHookForm.handleSubmit(handleSubmit)}>
            <div className='order-filter-form-container'>
              <Select
                placeholder='Ativado'
                {...filterReactHookForm.register('ativado')}
                options={SITUATIONS_USER_OPTIONS}
                />
            </div>
          <div className='order-container-button-filter'>
            <button type='reset' onClick={async () => {
              filterReactHookForm.reset()
              navigation.replace(ROUTES.USERS.LIST)
            }} className=' cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
              Limpar
            </button>
            <button type='submit' className=' cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
              Filtrar
            </button>
          </div>
          </form>
          </div>
            <InfiniteScroll
            dataLength={users.length}
            next={handleLoadUsers}
            hasMore={hasMore}
            loader={<Loading />}
            className='users-container-list'
          >
          <></>
          <Table>
        <Thead>
          <Tr>
            <Th>Cod.</Th>
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th>CPF/CNPJ</Th>
            <Th>Telefone</Th>
            <Th>Ativo</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
            <Tbody>
              {users.length ? users?.map(user => (
              <Tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.nome}</Td>
                <Td>{user.email}</Td>
                <Td>{user.cpf}</Td>
                <Td>{user.telefone}</Td>
                <Td>{Number(user.ativado) ? 'Sim' : 'Não'}</Td>
                <Td data-last-item={true}>
                  <button onClick={() => {
                    navigation.push(ROUTES.USERS.EDIT(user.id))
                  }} className='btn-payment w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Editar
                  </button>
                  <button onClick={() => handleRemoveUser(user)} className='btn-payment w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Excluir
                  </button>
                </Td>
              </Tr>
            )): (
              <Tr >
                  <Td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum resultado encontrado</Td>
                  </Tr>
            )}
          </Tbody>
          </Table>
        </InfiniteScroll> 

    </div>
  )
}