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


const TAKE_BRANDS = 20

export default function BrandsList() {
  const query = useSearchParams()
  const status = query.get('status')
  const navigation = useRouter()
  const [brands, setBrands] = useState<BrandResponseApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const handleLoadBrands = useCallback(async () => {
    try {
      const responseBrands = await ApiService.Brand.getAll({
        skip: TAKE_BRANDS * (page - 1),
        take: TAKE_BRANDS,
      })
      setHasMore(!!responseBrands.items.length)
      if(!responseBrands?.items.length) {
        toast.info('Você chegou ao final', {
          toastId: 'toast-id-end-data'
        })
        return
      }
      setPage(oldPage => oldPage + 1)
      setBrands(oldBrands => ([...oldBrands, ...responseBrands.items]))
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [page])


  useEffect(() => {
    async function loadData() {
      await handleLoadBrands()
      setIsLoading(false)      
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[status])


  if(isLoading) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl brands-container'>
      <div className='brands-container-tools'>
        <h3 className='px-3 pt-2 page-title'>Produtos</h3>
        <div className='brand-container-button-tools'>
          <button onClick={() => {
            navigation.push(ROUTES.BRANDS.CREATE)
          }} className='btn-container btn-add w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Adicionar</button>
        </div>
      </div>
            <InfiniteScroll
            dataLength={brands.length}
            next={handleLoadBrands}
            hasMore={hasMore}
            loader={<Loading />}
            className='brands-container-list'
          >
          <></>
          <Table>
        <Thead>
          <Tr>
            <Th>Cod.</Th>
            <Th>Nome</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
            <Tbody>
              {brands.length ? brands?.map(brand => (
              <Tr key={brand.id}>
                <Td>{brand.id}</Td>
                <Td>{brand.nome}</Td>
                <Td data-last-item={true}>
                  <button onClick={() => {
                    navigation.push(ROUTES.BRANDS.EDIT(brand.id))
                  }} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Editar
                  </button>
                  {/* <button onClick={() => {
                    navigation.push(ROUTES.BRANDS.VIEW(brand.id))
                  }} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Visualizar
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