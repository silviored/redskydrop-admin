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
import { Select } from '@/components/select';
import { DEFAULT_YES_NOT_OPTIONS } from '@/constants/types';

type FormProps = {
  isEditMode?: boolean
  onSave?: (status: StatusRequestApi) => Promise<void>
  status?: StatusResponseApi
}

export function Form({ onSave, status, isEditMode }: FormProps) {
  const navigation = useRouter()
  const reactHookForm = useForm<StatusRequestApi>({
    resolver: zodResolver(createSchema),
  });

  
  const addNewStatus = useMutation({
    mutationFn: async (status: StatusRequestApi) => {
      await ApiService.Status.create({...status})
    },
    onSuccess: (_data, status: StatusRequestApi) => {
      toast.success(`O status ${status.nome} foi adicionada com sucesso!`,)

      navigation.push(ROUTES.STATUS.LIST)
    },
    onError: (error: ApiError, status: StatusRequestApi) => {
      toast.error(error.message || `Erro ao adicionar ${status.nome}!`)
    },
  })


  useEffect(() => {
    if(status && isEditMode) {
      reactHookForm.reset({
        nome: status.nome,
        ativo: status.ativo ? 1 : 0,
      })
    }
  }, [status, isEditMode, reactHookForm])
  
  return (
    <form
    role='form text-left'
    onSubmit={reactHookForm.handleSubmit((status => {
      if(isEditMode) {
        onSave?.(status)
        return
      }
      addNewStatus.mutate(status)
    }))}
  >
    <div className='row'>
    <div className='mb-4'>
      <Input
        placeholder='Nome'
        errors={reactHookForm.formState.errors.nome?.message}
        {...reactHookForm.register('nome')}
        
      />
    </div>
    <div className='mb-4'>
      <Select
        placeholder='Ativo'
        errors={reactHookForm.formState.errors.ativo?.message}
        {...reactHookForm.register('ativo')}
        defaultValue={1}
        options={DEFAULT_YES_NOT_OPTIONS}
        
      />
    </div>
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