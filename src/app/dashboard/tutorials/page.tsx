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

export default function TutorialsList() {
  const query = useSearchParams()
  const status = query.get('status')
  const navigation = useRouter()
  const [tutorials, setTutorials] = useState<TutorialResponseApi[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadTutorials = useCallback(async () => {
    try {
      const responseTutorials = await ApiService.Tutorial.getAll()
      setTutorials(responseTutorials)
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [])


  useEffect(() => {
    async function loadData() {
      await handleLoadTutorials()
      setIsLoading(false)      
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[status])


  if(isLoading) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl tutorials-container'>
      <div className='tutorials-container-tools'>
        <h3 className='px-3 pt-2 page-title'>Passo a passo</h3>
        <div className='tutorial-container-button-tools'>
          <button onClick={() => {
            navigation.push(ROUTES.TUTORIALS.CREATE)
          }} className='btn-container btn-add w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Adicionar</button>
        </div>
      </div>
            <InfiniteScroll
            dataLength={tutorials.length}
            next={handleLoadTutorials}
            hasMore={false}
            loader={<Loading />}
            className='tutorials-container-list'
          >
          <></>
          <Table>
        <Thead>
          <Tr>
            <Th>Cod.</Th>
            <Th>Nome</Th>
            <Th>Link</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
            <Tbody>
              {tutorials.length ? tutorials?.map(tutorial => (
              <Tr key={tutorial.id}>
                <Td>{tutorial.id}</Td>
                <Td>{tutorial.nome}</Td>
                <Td>{tutorial.link}</Td>
                <Td data-last-item={true}>
                  <button onClick={() => {
                    navigation.push(ROUTES.TUTORIALS.EDIT(tutorial.id))
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