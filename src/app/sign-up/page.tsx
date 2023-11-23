'use client';
import Image from 'next/image';
import { Footer } from '@/components/without-login/footer';
import { Input } from '@/components/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { createUserSchema } from './form-validation';
import { ApiService } from '@/services';
import { toast } from 'react-toastify';
import { CacheService } from '@/services/cache';
import { useGlobalState } from '@/contexts/global-state';
import './styles.css';
import { ROUTES } from '@/constants/routes';


export default function SignUp() {
  const navigation = useRouter();
  const { saveUser } = useGlobalState();
  const reactHookForm = useForm<UserRequestApi>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = useCallback(
    async (data: UserRequestApi) => {
      try {
        const responseUserLogin = await ApiService.Login.signUp({
          ...data,
          tipo: '2'
        });
        ApiService.persistToken(responseUserLogin.token as string);
        CacheService.user.saveCurrentUser(responseUserLogin);
        saveUser(responseUserLogin);
        toast.success('Usuário cadastrado com sucesso');
        navigation.push(ROUTES.DASHBOARD)
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [navigation, saveUser]
  );

  return (
    <div className='bg-gradient'>
      <div className='flex h-full flex-col'>
        <div className='flex h-full flex-col justify-center'>
          <div className='container-logo flex items-center justify-center'>
            <div className='bg-white rounded-2xl shadow-2xl container-logo flex items-center justify-center'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/logos/logo.png" alt="" width={250} style={{ margin: '0 auto' }} />
          </div>
          </div>

          <div className='container-form container'>
            <div className='flex flex-wrap '>
              <div className='lg:5/12 mx-auto mt-0 w-full max-w-full shrink-0 px-3 md:w-7/12 md:flex-0'>
                <div className='relative z-0 flex min-w-0 flex-col break-words rounded-2xl border-0 bg-black bg-clip-border shadow-xl'>
                  <div className='mb-0 rounded-t-2xl border-b-0 bg-black p-6 text-center'>
                    <h5 className='text-white'>Cadastrar-se</h5>
                  </div>
                  <div className='px-l-5 flex-auto pb-5'>
                    <form
                      role='form text-left'
                      onSubmit={reactHookForm.handleSubmit(onSubmit)}
                    >
                      <div className='mb-4'>
                        <Input
                          placeholder='Nome'
                          icon={<i className='ni ni-badge'></i>}
                          errors={reactHookForm.formState.errors.nome?.message}
                          {...reactHookForm.register('nome')}
                        />
                      </div>
                      <div className='mb-4'>
                        <Input
                          type='email'
                          placeholder='Email'
                          icon={<i className='ni ni-email-83'></i>}
                          errors={reactHookForm.formState.errors.email?.message}
                          {...reactHookForm.register('email')}
                        />
                      </div>
                      <div className='mb-4'>
                        <Input
                          type='password'
                          placeholder='Senha'
                          icon={<i className='ni ni-lock-circle-open'></i>}
                          errors={
                            reactHookForm.formState.errors.password?.message
                          }
                          {...reactHookForm.register('password')}
                        />
                      </div>
                      <div className='mb-4'>
                        <Input
                          type='password'
                          placeholder='Confirmar senha'
                          icon={<i className='ni ni-lock-circle-open'></i>}
                          errors={
                            reactHookForm.formState.errors.password_confirmation
                              ?.message
                          }
                          {...reactHookForm.register('password_confirmation')}
                        />
                      </div>
                      <div className='mb-5 text-center'>
                        <button
                          type='submit'
                          className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
                        >
                          Cadastrar
                        </button>
                      </div>
                      <div className='flex flex-col items-center justify-end lg:flex-row'>
                        <p className='mb-0 mt-4 leading-normal text-white'>
                          Já tem conta?{' '}
                          <Link href='/' className='text-red-600'>
                            Login
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
