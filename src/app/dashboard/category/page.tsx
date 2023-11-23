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


const TAKE_CATEGORIES = 20

export default function CATEGORIESList() {
  const query = useSearchParams()
  const status = query.get('status')
  const navigation = useRouter()
  const [categories, setCATEGORIES] = useState<CategoryResponseApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const handleLoadCATEGORIES = useCallback(async () => {
    try {
      const responseCATEGORIES = await ApiService.Category.getAll({
        skip: TAKE_CATEGORIES * (page - 1),
        take: TAKE_CATEGORIES,
      })
      setHasMore(!!responseCATEGORIES.items.length)
      if(!responseCATEGORIES?.items.length) {
        toast.info('Você chegou ao final', {
          toastId: 'toast-id-end-data'
        })
        return
      }
      setPage(oldPage => oldPage + 1)
      setCATEGORIES(oldCategories => ([...oldCategories, ...responseCATEGORIES.items]))
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [page])


  useEffect(() => {
    async function loadData() {
      await handleLoadCATEGORIES()
      setIsLoading(false)      
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[status])


  if(isLoading) {
    return <Loading />
  }
  return (
    <div style={{ paddingBottom: '1rem' }}>
      <div className='bg-white rounded-2xl shadow-2xl category-container'>
      <div className='category-wrapper-filter'>
        <h3 className='px-3 pt-2 page-title'>Categorias</h3>
        <div className='category-container-button-tools'>
          <button onClick={() => {
            navigation.push(ROUTES.CATEGORIES.CREATE)
          }} className='btn-container btn-add w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Adicionar</button>
        </div>
      </div>
            <InfiniteScroll
            dataLength={categories.length}
            next={handleLoadCATEGORIES}
            hasMore={hasMore}
            loader={<Loading />}
            className='category-container-list'
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
              {categories.length ? categories?.map(category => (
              <Tr key={category.id}>
                <Td>{category.id}</Td>
                <Td>{category.nome}</Td>
                <Td data-last-item={true}>
                  <button onClick={() => {
                    navigation.push(ROUTES.CATEGORIES.EDIT(category.id))
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
    </div>
  )
}