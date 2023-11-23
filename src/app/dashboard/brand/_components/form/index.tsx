import { Input } from '@/components/input'
import './styles.css'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSchema } from './form-validation';
import { useMutation } from '@tanstack/react-query';
import { ApiService } from '@/services';
import { toast } from 'react-toastify';
import { ROUTES } from '@/constants/routes';
import { ApiError } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

type FormProps = {
  isEditMode?: boolean
  onSave?: (brand: BrandRequestApi) => Promise<void>
  brand?: BrandResponseApi
}

export function Form({ onSave, brand, isEditMode }: FormProps) {
  const navigation = useRouter()
  const reactHookForm = useForm<BrandRequestApi>({
    resolver: zodResolver(createSchema),
  });

  
  const addNewBrand = useMutation({
    mutationFn: async (brand: BrandRequestApi) => {
      await ApiService.Brand.create(brand)
    },
    onSuccess: (_data, brand: BrandRequestApi) => {
      toast.success(`A marca ${brand.nome} foi adicionada com sucesso!`,)

      navigation.push(ROUTES.BRANDS.LIST)
    },
    onError: (error: ApiError, brand: BrandRequestApi) => {
      toast.error(error.message || `Erro ao adicionar ${brand.nome}!`)
    },
  })


  useEffect(() => {
    if(brand && isEditMode) {
      reactHookForm.reset({
        nome: brand.nome
      })
    }
  }, [brand, isEditMode, reactHookForm])
  
  return (
    <form
    role='form text-left'
    onSubmit={reactHookForm.handleSubmit((brand => {
      if(isEditMode) {
        onSave?.(brand)
        return
      }
      addNewBrand.mutate(brand)
    }))}
  >
    <div className='mb-4'>
      <Input
        placeholder='Nome'
        errors={reactHookForm.formState.errors.nome?.message}
        {...reactHookForm.register('nome')}
        
      />
    </div>
    <div className='mb-5 text-center container-footer'>
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