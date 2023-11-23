import { Input } from '@/components/input'
import './styles.css'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSchema } from './form-validation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services';
import { toast } from 'react-toastify';
import { ROUTES } from '@/constants/routes';
import { ApiError } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation'
import { Select } from '@/components/select';
import { QUERY_KEYS } from '@/constants/keys';
import { Loading } from '@/components/loading';
import { useCallback, useEffect, useState } from 'react';

type FormProps = {
  isEditMode?: boolean
  onSave?: (color: ColorRequestApi) => Promise<void>
  color?: ColorResponseApi
}

export function Form({ onSave, color, isEditMode }: FormProps) {
  const navigation = useRouter()

  const [formUpdated, setFormUpdated] = useState<boolean>(false)
  const reactHookForm = useForm<ColorRequestApi>({
    resolver: zodResolver(createSchema),
  });

  
  const { data: products, isLoading: isLoadingProducts } = useQuery<{ items: ProductResponseApi[] }>(
    QUERY_KEYS.PRODUCTS.LIST,
    async () => ApiService.Product.getAll()
  );

  
  const addNewColor = useMutation({
    mutationFn: async (color: ColorRequestApi) => {
      await ApiService.Color.create(color)
    },
    onSuccess: (_data, color: ColorRequestApi) => {
      toast.success(`A cor ${color.nome} foi adicionada com sucesso!`,)

      navigation.push(ROUTES.COLORS.LIST)
    },
    onError: (error: ApiError, color: ColorRequestApi) => {
      toast.error(error.message || `Erro ao adicionar ${color.nome}!`)
    },
  })

  useEffect(() => {
    if(color && isEditMode && !formUpdated) {
      reactHookForm.reset({
        ...color
      })
      reactHookForm.setValue('product_id', color.product_id?.toString())
      setFormUpdated(true)
    }
  }, [color, formUpdated, isEditMode, reactHookForm])

  
const handleCLoseModal = useCallback(() => {
  navigation.replace(ROUTES.COLORS.EDIT(color?.id?.toString() as string))
}, [navigation, color?.id])

const handleOpenModal = useCallback(() => {
  navigation.replace(`?modal=true`)
}, [navigation])

const handleRemoveImage = useCallback(async () => {
  if(!color?.id) return
  try {
    await ApiService.Color.remove({ id: color.id })
    toast.success('Cor removida com sucesso', {
      toastId: 'toast-removed'
    })
    navigation.push(ROUTES.COLORS.LIST)
  } catch (error: unknown) {
    toast.error((error as ApiError).message || 'Ocorreu um erro ao excluir sua cor')
  }
  handleCLoseModal()
}, [color?.id, handleCLoseModal, navigation])

  if(isLoadingProducts) {
    return <Loading/>
  }
  
  return (
      <form
    role='form text-left'
    onSubmit={reactHookForm.handleSubmit((color => {
      if(isEditMode) {
        onSave?.(color)
        return
      }
      addNewColor.mutate(color)
    }))}
  >
    <div className='mb-4 color-container-grid-row-first'>
      <Input
        placeholder='Nome'
        errors={reactHookForm.formState.errors.nome?.message}
        {...reactHookForm.register('nome')}
      />
      <Input
        placeholder='Código Hexadecimal'
        errors={reactHookForm.formState.errors.hex_code?.message}
        {...reactHookForm.register('hex_code')}
      />
      <Select
        placeholder='Produto'
        errors={reactHookForm.formState.errors.product_id?.message}
        {...reactHookForm.register('product_id')}
        options={products?.items?.map(product => ({ label: product.nome, value: product.id })) || []}
        />
    </div>
    <div className='mb-5 text-center color-container-footer'>
      <button
        type='submit'
        className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
      >
        Salvar
      </button>
    </div>
  </form>
  )
}