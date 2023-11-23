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



export default function ProductView({ params }: { params: { id: string}}) {
  const navigation = useRouter()
  const queryClient = useQueryClient()
  const { data: supplier, isLoading } = useQuery<SupplierResponseApi>(
    QUERY_KEYS.SUPPLIERS.GET(params.id),
    async () => ApiService.Supplier.get({ id: params.id })
  );

  const updateSupplier = useMutation({
    mutationFn: async (supplier: SupplierRequestApi) => {
      await ApiService.Supplier.update({ ...supplier, id: Number(params.id) })
    },
    onSuccess: (_data, supplier) => {
      queryClient.invalidateQueries<SupplierRequestApi>(
        QUERY_KEYS.SUPPLIERS.UPDATE(params.id)
      )

      toast.success(`o fornecedor ${supplier.nome} foi atualizado com sucesso!`)

      navigation.push(ROUTES.SUPPLIERS.LIST)
    },
    onError: (_error, supplier) => {
      toast.error(`Erro ao editar ${supplier.nome}!`)
    },
  })

  if (isLoading || !supplier) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl container-details-product'>
      <div className='container-header'>
        <div className='container-button'>
        <button style={{ margin: 0 }} onClick={() => {
          navigation.push(ROUTES.SUPPLIERS.LIST)
        }} className='btn-container w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
          Listar
        </button>
        </div>
      </div>
      <Form supplier={supplier} isEditMode onSave={async supplier => {
        updateSupplier.mutate(supplier)
      }} />
    </div>
  )
}