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


const TAKE_SUPPLIERS = 20

export default function SuppliersList() {
  const query = useSearchParams()
  const status = query.get('status')
  const navigation = useRouter()
  const [suppliers, setSuppliers] = useState<SupplierResponseApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const handleLoadSuppliers = useCallback(async () => {
    try {
      const responseSuppliers = await ApiService.Supplier.getAll({
        skip: TAKE_SUPPLIERS * (page - 1),
        take: TAKE_SUPPLIERS,
      })
      setHasMore(!!responseSuppliers.items.length)
      if(!responseSuppliers?.items.length) {
        toast.info('Você chegou ao final', {
          toastId: 'toast-id-end-data'
        })
        return
      }
      setPage(oldPage => oldPage + 1)
      setSuppliers(oldSuppliers => ([...oldSuppliers, ...responseSuppliers.items]))
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [page])


  useEffect(() => {
    async function loadData() {
      await handleLoadSuppliers()
      setIsLoading(false)      
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[status])


  if(isLoading) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl supplier-container'>
      <div className='supplier-wrapper-filter'>
        <h3 className='px-3 pt-2 page-title'>Fornecedores</h3>
        <div className='supplier-container-button-tools'>
          <button onClick={() => {
            navigation.push(ROUTES.SUPPLIERS.CREATE)
          }} className='btn-container btn-add w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Adicionar</button>
        </div>
      </div>
            <InfiniteScroll
            dataLength={suppliers.length}
            next={handleLoadSuppliers}
            hasMore={hasMore}
            loader={<Loading />}
            className='supplier-container-list'
          >
          <></>
          <Table>
        <Thead>
          <Tr>
            <Th>Cod.</Th>
            <Th>Nome</Th>
            <Th>Telefone</Th>
            <Th>Ativo</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
            <Tbody>
              {suppliers.length ? suppliers?.map(supplier => (
              <Tr key={supplier.id}>
                <Td>{supplier.id}</Td>
                <Td>{supplier.nome}</Td>
                <Td>{supplier.telefone}</Td>
                <Td>{supplier.ativado ? 'Sim' : 'Não'}</Td>
                <Td data-last-item={true}>
                  <button onClick={() => {
                    navigation.push(ROUTES.SUPPLIERS.EDIT(supplier.id))
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