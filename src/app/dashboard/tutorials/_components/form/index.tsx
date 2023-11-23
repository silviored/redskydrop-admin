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
import { Textarea } from '@/components/textarea';

type FormProps = {
  isEditMode?: boolean
  onSave?: (tutorial: TutorialRequestApi) => Promise<void>
  tutorial?: TutorialResponseApi
}

export function Form({ onSave, tutorial, isEditMode }: FormProps) {
  const navigation = useRouter()
  const reactHookForm = useForm<TutorialRequestApi>({
    resolver: zodResolver(createSchema),
  });

  
  const addNewTutorial = useMutation({
    mutationFn: async (tutorial: TutorialRequestApi) => {
      await ApiService.Tutorial.create(tutorial)
    },
    onSuccess: (_data, tutorial: TutorialRequestApi) => {
      toast.success(`A marca ${tutorial.nome} foi adicionada com sucesso!`,)

      navigation.push(ROUTES.TUTORIALS.LIST)
    },
    onError: (error: ApiError, tutorial: TutorialRequestApi) => {
      toast.error(error.message || `Erro ao adicionar ${tutorial.nome}!`)
    },
  })


  useEffect(() => {
    if(tutorial && isEditMode) {
      reactHookForm.reset({
        ...tutorial,
      })
    }
  }, [tutorial, isEditMode, reactHookForm])
  
  return (
    <form
    role='form text-left'
    onSubmit={reactHookForm.handleSubmit((tutorial => {
      if(isEditMode) {
        onSave?.(tutorial)
        return
      }
      addNewTutorial.mutate(tutorial)
    }))}
  >
    <div className='mb-4'>
      <Input
        placeholder='Nome'
        errors={reactHookForm.formState.errors.nome?.message}
        {...reactHookForm.register('nome')}
        
      />

    </div>
    <div className='mb-4'>
    <Input
        placeholder='Link'
        errors={reactHookForm.formState.errors.link?.message}
        {...reactHookForm.register('link')}
        
      />
    </div>
    <div className='mb-4'>
      <Textarea
        placeholder='Descrição'
        errors={reactHookForm.formState.errors.descricao?.message}
        {...reactHookForm.register('descricao')}
        style={{ minHeight: 100 }}
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