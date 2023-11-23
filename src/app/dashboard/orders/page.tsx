"use client"
import InfiniteScroll from 'react-infinite-scroll-component'
import './styles.css'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Loading } from '@/components/loading'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { ApiService } from '@/services'
import { currencyMask } from '@/utils/mask'
import { useRouter, useSearchParams } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import { Input } from '@/components/input'
import { useForm } from 'react-hook-form'
import { Select } from '@/components/select'
import { ORDER_SITUATIONS, ORDER_SITUATIONS_OPTIONS } from '@/constants/types'
import { MASKS } from '@/constants/mask'
import moment, { ISO_8601 } from 'moment'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/keys'


const TAKE_ORDERS = 20



export default function OrdersList() {
  const navigation = useRouter()
  const query = useSearchParams()
  const start_date = query.get('start_date')
  const end_date = query.get('end_date')
  const status = query.get('status')
  const user_id = query.get('user_id')
  const [orders, setOrders] = useState<OrderResponseApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const filterReactHookForm = useForm<FilterProps>()

  
  const { data = { items: []}, isLoading: isLoadingUsers } = useQuery<{ items: ProductResponseApi[]}>(
    QUERY_KEYS.USERS.LIST,
    async () => ApiService.User.getAll({})
  );

  const { data: statusOptions, isLoading: isLoadingStatus } = useQuery<{ items: StatusResponseApi[] }>(
    QUERY_KEYS.STATUS.LIST,
    async () => ApiService.Status.getAll()
  );

  const handleLoadOrders = useCallback(async (data?: { reset?: boolean }) => {
    try {
      const responseOrders = await ApiService.Order.getAll({
        skip: data?.reset ? 0 : TAKE_ORDERS * (page - 1),
        take: TAKE_ORDERS,
        status,
        start_date,
        end_date,
        user_id,
      })
      setHasMore(!!responseOrders.items.length)
      setOrders(oldOrders => (data?.reset ? [...responseOrders.items] : [...oldOrders, ...responseOrders.items]))
      if(!responseOrders?.items.length) {
        toast.info('Você chegou ao final', {
          toastId: 'toast-id-end-data'
        })
        return
      }
      setPage(oldPage => oldPage + 1)

    } catch (error: any) {
      toast.error(error?.message || 'Ocorreu um erro ao carregar os pedidos')
    }
  }, [end_date, page, start_date, status, user_id])


  
  useEffect(() => {
    if(status || start_date || end_date || user_id) {
      handleLoadOrders({ reset: true })
      setIsLoading(false)  
    }
    if(!status && !start_date && !end_date && !user_id) {
      handleLoadOrders({ reset: true })
      setIsLoading(false)  
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end_date, start_date, status, user_id])



  const handleSubmit = useCallback(async (data: FilterProps) => {
    const user_id = data?.user_id?.split(' ')[0];
    let url = ''
    if(data.start_date) {
      url = `start_date=${data.start_date}`
    }
    if(data.end_date) {
      url += `&end_date=${data.end_date}`
    }
    if(data.status) {
      url += `&status=${data.status}`
    }
    if(data.user_id) {
      url += `&user_id=${user_id}`
    }
    if(url){
      navigation.replace(`${ROUTES.ORDERS.LIST}?${url}`)
    }
  }, [navigation])


  if(isLoading || isLoadingUsers || isLoadingStatus) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl orders-container'>
      <div className='orders-wrapper-filter'>
        <h3 className='px-3 pt-2 page-title'>Pedidos</h3>
      </div>
      <div className='order-container-filter-container'>
          <form className='' onSubmit={filterReactHookForm.handleSubmit(handleSubmit)}>
            <div className='order-filter-form-container'>
              <Input
                placeholder='Data de inicio'
                {...filterReactHookForm.register('start_date')}
                type='date'
              />
              <Input
                placeholder='Data de fim'
                {...filterReactHookForm.register('end_date')}
                type='date'
              />
              <Select
                placeholder='Status'
                {...filterReactHookForm.register('status')}
                options={[...ORDER_SITUATIONS_OPTIONS, ...(statusOptions?.items?.map(option => ({
                  label: option.nome,
                  value: option.nome,
                })) || [])]}
                />
              <Input
                placeholder='Usuário'
                list="users"
                {...filterReactHookForm.register('user_id')}
              />

              <datalist id="users">
                {data.items.map(product => {
                  return (
                    <option value={`${product.id} - ${product.nome}`} key={product.id}/>
                  )
                })}
              </datalist>
            </div>
          <div className='order-container-button-filter'>
            <button type='reset' onClick={async () => {
              filterReactHookForm.reset()
              navigation.replace(ROUTES.ORDERS.LIST)
            }} className=' cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
              Limpar
            </button>
            <button type='submit' className=' cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
              Filtrar
            </button>
          </div>
          </form>
          <div>
          </div>
        </div>
            <InfiniteScroll
            dataLength={orders.length}
            next={handleLoadOrders}
            hasMore={hasMore}
            loader={<Loading />}
            className='orders-container-list'
          >
          <></>
          <Table>
        <Thead>
          <Tr>
          <Th>Cod.</Th>
          <Th>Cliente</Th>
            <Th>Preço total</Th>
            <Th>Qtd. Produtos</Th>
            <Th>Status</Th>
            <Th>Reservado</Th>
            <Th>Pago</Th>
            <Th>Pago em</Th>
            <Th>Criado em</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
            <Tbody>
              {orders.length ? orders?.map(order => (
              <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{order.user?.nome}</Td>
                <Td>R$ {currencyMask(Number(order.preco_total))}</Td>
                <Td>{order.vendaProdutos?.length}</Td>
                <Td>{ORDER_SITUATIONS[order.status] || order.status}</Td>
                <Td>{order.isreservado ? 'Sim' : 'Não'}</Td>
                <Td data-paid={order.ispago}>{order.ispago ? 'Sim' : 'Não'}</Td>
                <Td>{order.pagamentos?.[order.pagamentos?.length - 1]?.data_pagamento ? moment(order.pagamentos?.[order.pagamentos?.length - 1]?.data_pagamento).format(MASKS.DATE.LOCALE_WITHOUT_TIME): 'Pagamento Pendente'}</Td>
                <Td>{order.criado_em ? moment(order.criado_em, ISO_8601).format(MASKS.DATE.LOCALE_WITHOUT_TIME) : ''}</Td>
                <Td data-last-item={true}>
                  <button onClick={() => {
                    navigation.push(ROUTES.ORDERS.VIEW(order.id))
                  }} className='btn-payment w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Visualizar
                  </button>
                  {/* <button onClick={() => {
                    navigation.push(ROUTES.ORDERS.EDIT(order.id))
                  }} className='btn-payment w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Editar
                  </button> */}
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