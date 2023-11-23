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
import moment, { ISO_8601 } from 'moment'
import { MASKS } from '@/constants/mask'


const TAKE_STATUS = 20

export default function StatusList() {
  const navigation = useRouter()
  const [status, setStatus] = useState<StatusResponseApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const handleLoadStatus = useCallback(async () => {
    try {
      const responseStatus = await ApiService.Status.getAll({
        skip: TAKE_STATUS * (page - 1),
        take: TAKE_STATUS,
      })
      setHasMore(!!responseStatus.items.length)
      if(!responseStatus?.items.length) {
        toast.info('Você chegou ao final', {
          toastId: 'toast-id-end-data'
        })
        return
      }
      setPage(oldPage => oldPage + 1)
      setStatus(oldStatus => ([...oldStatus, ...responseStatus.items]))
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [page])


  useEffect(() => {
    async function loadData() {
      await handleLoadStatus()
      setIsLoading(false)      
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[status])


  if(isLoading) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl status-container'>
      <div className='status-container-tools'>
        <h3 className='px-3 pt-2 page-title'>Status</h3>
        <div className='status-container-button-tools'>
          <button onClick={() => {
            navigation.push(ROUTES.STATUS.CREATE)
          }} className='btn-container btn-add w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Adicionar</button>
        </div>
      </div>
            <InfiniteScroll
            dataLength={status.length}
            next={handleLoadStatus}
            hasMore={hasMore}
            loader={<Loading />}
            className='status-container-list'
          >
          <></>
          <Table>
        <Thead>
          <Tr>
            <Th>Cod.</Th>
            <Th>Nome</Th>
            <Th>Ativo</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
            <Tbody>
              {status.length ? status?.map(status => (
              <Tr key={status.id}>
                <Td>{status.id}</Td>
                <Td>{status.nome}</Td>
                <Td>{status.ativo ? 'Sim' : 'Não'}</Td>
                <Td data-last-item={true}>
                  <button onClick={() => {
                    navigation.push(ROUTES.STATUS.EDIT(status.id))
                  }} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Editar
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