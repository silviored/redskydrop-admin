"use client"
import './styles.css';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CacheService } from '@/services/cache';
import { Loading } from '@/components/loading';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false)
  const triggerSideNavRef = useRef<HTMLAnchorElement>(null)
  const navigation = useRouter()
  const pathname = usePathname()

  const handleGetActiveMenu = useCallback(({
    route
  }: { route: string }) => {
    return route === pathname ? ' link-active ' : ''
  },[pathname])


  const handleNavigate = useCallback(({ route }: { route: string}) => {
    if(triggerSideNavRef.current){
      triggerSideNavRef.current.click()
    }
    navigation.push(route)
  }, [navigation])


  const handleLogout = useCallback(() => {
    setIsLoading(true)
    CacheService.user.clear()
    setTimeout(() => {
      navigation.push(ROUTES.SIGN_IN)
    }, 1000)
  }, [navigation])

  return (
    <>
        {isLoading && (
      <Loading  />
    )}
    <div className='container-layout-dashboard'>
      <div className='grid-page-title header m-0 font-sans text-base font-normal leading-default'>
        <aside
          className='container-sidenav ease-nav-brand fixed inset-y-0 z-990 block w-full  -translate-x-full flex-wrap items-center justify-between overflow-y-auto border-0 bg-white p-0 antialiased shadow-xl transition-transform duration-200 l:left-0 xl:translate-x-0'
          aria-expanded='false'
        >
          <div className='h-19'>
            <i
              className='button-close-sidenav fas fa-times absolute right-0 top-0 cursor-pointer p-4 text-slate-400 opacity-50 dark:text-white xl:hidden'
              sidenav-close="true"
            ></i>
            <button
              className='m-0 block whitespace-nowrap px-8 py-6 text-sm text-slate-700 dark:text-white'
            onClick={() => handleNavigate({ route: ROUTES.DASHBOARD })}
            style={{ margin: '0 auto' }}
            >
              <img src="/assets/img/logos/logo.png" alt="" width={100} style={{ margin: '0 auto' }} />
              {/* <Image src="/assets/img/logos/logo.png" alt='Logo red sky' width={100} height={100} className='ease-nav-brand inline h-full max-h-8 max-w-full transition-all duration-200 dark:hidden' /> */}
              {/* <Image src={logoa} alt='Logo red sky' width={100} height={100} className='ease-nav-brand hidden h-full max-h-8 max-w-full transition-all duration-200 dark:inline' /> */}
              {/* <img
                src='./assets/img/logo-ct-dark.png'
                className='ease-nav-brand inline h-full max-h-8 max-w-full transition-all duration-200 dark:hidden'
                alt='main_logo'
              /> */}
              {/* <img
                src='./assets/img/logo-ct.png'
                className='ease-nav-brand hidden h-full max-h-8 max-w-full transition-all duration-200 dark:inline'
                alt='main_logo'
              /> */}
            </button>
          </div>

          <hr className='mt-0 h-px bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent' />

          <div className='block max-h-screen w-auto grow basis-full items-center overflow-auto'>
            <ul className='mb-0 flex flex-col pl-0'>
              <li className='mt-0.5 w-full p-2'>
                <button
                  className={'w-full ease-nav-brand flex items-center whitespace-nowrap rounded-lg px-4 py-2.7 text-sm font-semibold text-slate-700 transition-colors dark:text-white dark:opacity-80' + handleGetActiveMenu({ route: ROUTES.DASHBOARD })}
                  onClick={() => handleNavigate({ route: ROUTES.DASHBOARD })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='fas fa-home text-blue-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Tela inicial
                  </span>
                </button>
              </li>

              {/* <li className='mt-0.5 w-full p-2'>
                <button
                  className={handleGetActiveMenu({ route: ROUTES.SALE.ROOT }) + 'w-full  ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  onClick={() => handleNavigate({ route: ROUTES.SALE.ROOT })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='fas fa-box text-red-600'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Pedidos
                  </span>
                </button>
              </li> */}

              {/* <li className='mt-0.5 w-full'>
                <a
                  className=' ease-nav-brand mx-2 my-0 flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'
                  href='./pages/billing.html'
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center fill-current stroke-0 text-center xl:p-2.5'>
                    <i className='ni ni-credit-card relative top-0 text-sm leading-normal text-emerald-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Pedidos
                  </span>
                </a>
              </li> */}

              {/* <li className='mt-0.5 w-full'>
                <a
                  className=' ease-nav-brand mx-2 my-0 flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'
                  href='./pages/virtual-reality.html'
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='ni ni-app relative top-0 text-sm leading-normal text-cyan-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Reembolso
                  </span>
                </a>
              </li> */}
              <li className='mt-0.5 w-full p-2'>
                <button
                  className={handleGetActiveMenu({ route: ROUTES.TUTORIALS.LIST }) + ' w-full  rounded-lg ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  onClick={() => handleNavigate({ route: ROUTES.TUTORIALS.LIST })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                  <i className="fas fa-chalkboard-teacher"></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Passo a passo
                  </span>
                </button>
              </li>
              <li className='mt-0.5 w-full p-2'>
                <button
                  className={handleGetActiveMenu({ route: ROUTES.STATUS.LIST }) + ' w-full  rounded-lg ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  onClick={() => handleNavigate({ route: ROUTES.STATUS.LIST })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='fas fa-list'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Status
                  </span>
                </button>
              </li>
              <li className='mt-0.5 w-full p-2'>
                <button
                  className={handleGetActiveMenu({ route: ROUTES.USERS.LIST }) + ' w-full  rounded-lg ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  onClick={() => handleNavigate({ route: ROUTES.USERS.LIST })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='fas fa-users'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Usuários
                  </span>
                </button>
              </li>

              <li className='mt-0.5 w-full p-2'>
                <button
                  className={handleGetActiveMenu({ route: ROUTES.ORDERS.LIST }) + ' w-full  rounded-lg ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  onClick={() => handleNavigate({ route: ROUTES.ORDERS.LIST })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='fas fa-boxes text-emerald-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Pedidos
                  </span>
                </button>
              </li>
              {/* 
                            <li className='mt-0.5 w-full p-2'>
                <button
                  className={handleGetActiveMenu({ route: ROUTES.BRANDS.LIST }) + ' w-full  rounded-lg ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  onClick={() => handleNavigate({ route: ROUTES.BRANDS.LIST })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='fas fa-tag text-gray-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Marcas
                  </span>
                </button>
              </li> */}

              
              {/* <li className='mt-0.5 w-full p-2'>
                <button
                  className={handleGetActiveMenu({ route: ROUTES.SUPPLIERS.LIST }) + ' w-full  rounded-lg ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  onClick={() => handleNavigate({ route: ROUTES.SUPPLIERS.LIST })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='fas fa-users text-gray-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Fornecedores
                  </span>
                </button>
              </li> */}

              
              <li className='mt-0.5 w-full p-2'>
                <button
                  className={handleGetActiveMenu({ route: ROUTES.CATEGORIES.LIST }) + ' w-full  rounded-lg ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  onClick={() => handleNavigate({ route: ROUTES.CATEGORIES.LIST })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='fas fa-edit text-gray-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Categorias
                  </span>
                </button>
              </li>

              <li className='mt-0.5 w-full p-2'>
                <button
                  className={handleGetActiveMenu({ route: ROUTES.PRODUCTS.LIST }) + ' w-full rounded-lg  ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  onClick={() => handleNavigate({ route: ROUTES.PRODUCTS.LIST })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='fas fa-store text-orange-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Produtos
                  </span>
                </button>
              </li>

{/*               
              <li className='mt-0.5 w-full p-2'>
                <button
                  className={handleGetActiveMenu({ route: ROUTES.COLORS.LIST }) + ' w-full  ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  onClick={() => handleNavigate({ route: ROUTES.COLORS.LIST })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='fas fa-fill text-gray-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Cores
                  </span>
                </button>
              </li> */}

              {/* <li className='mt-4 w-full'>
                <h6 className='ml-2 pl-6 text-xs font-bold uppercase leading-tight opacity-60 dark:text-white'>
                  Simulador de frete
                </h6>
              </li> */}

              {/* <li className='mt-0.5 w-full p-2'>
                <button
                  className={handleGetActiveMenu({ route: '/dashboard/my-profile' }) + ' w-full  ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  onClick={() => handleNavigate({ route: ROUTES.MY_PROFILE.ROOT(getTypeDocument(user?.cpf || '')) })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='fas fa-user-cog text-gray-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Meu perfil
                  </span>
                </button>
              </li>

              <li className='mt-0.5 w-full p-2'>
                <button
                  className={handleGetActiveMenu({ route: ROUTES.SUBSCRIPTION.ROOT }) + ' w-full  ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  onClick={() => handleNavigate({ route: ROUTES.SUBSCRIPTION.ROOT })}
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='ni ni-ui-04 text-emerald-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Assinatura
                  </span>
                </button>
              </li> */}
              {/* <li className='mt-0.5 w-full p-2'>
                <a
                  className={' w-full  ease-nav-brand flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'}
                  href='mailto:hebertryann40@gmail.com'
                  target='_blank'
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='ni ni-email-83 text-gray-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Suporte
                  </span>
                </a>
              </li> */}

              {/* <li className='mt-0.5 w-full'>
                <a
                  className=' ease-nav-brand mx-2 my-0 flex items-center whitespace-nowrap px-4 py-2.7 text-sm transition-colors dark:text-white dark:opacity-80'
                  href='./pages/sign-up.html'
                >
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5'>
                    <i className='ni ni-collection relative top-0 text-sm leading-normal text-cyan-500'></i>
                  </div>
                  <span className='ease pointer-events-none ml-1 opacity-100 duration-300'>
                    Integrações
                  </span>
                </a>
              </li> */}

            </ul>
          </div>

         
        </aside>

        <main className='rounded-xl transition-all duration-200 ease-in-out xl:ml-68'>
          <nav
            className='container-wrapper-nav-items flex flex-wrap items-center justify-between rounded-2xl px-0 py-2 shadow-none transition-all duration-250 ease-in lg:flex-nowrap lg:justify-start'
            navbar-main="true"
            navbar-scroll='false'
          >
            <div className='container-wrapper-content-items flex w-full items-center justify-between py-1 flex-wrap-inherit'>
              {/* <nav>
                <ol className='mr-12 flex flex-wrap rounded-lg bg-transparent pt-1 sm:mr-16'>
                  <li className='text-sm leading-normal'>
                    <a className='text-white opacity-50' href='javascript:;'>
                      Pages
                    </a>
                  </li>
                  <li
                    className="pl-2 text-sm capitalize leading-normal text-white before:float-left before:pr-2 before:text-white before:content-['/']"
                    aria-current='page'
                  >
                    Dashboard
                  </li>
                </ol>
                <h6 className='mb-0 font-bold capitalize text-white'>
                  Dashboard
                </h6>
              </nav> */}

              <div className='mt-2 flex grow items-center sm:mr-6 sm:mt-0 md:mr-0 lg:flex lg:basis-auto'>
                <ul className='container-header-nav mb-0 flex list-none flex-row justify-end pl-0 w-full'>
                  <li className='flex items-center xl:hidden'>
                    <a
                      href='javascript:;'
                      className='ease-nav-brand block p-0 text-white transition-all'
                      sidenav-trigger="true"
                      ref={triggerSideNavRef}
                    >
                      <div className='container-burger-menu overflow-hidden'>
                        <i className='ease relative block h-0.5 rounded-sm bg-white transition-all'></i>
                        <i className='ease relative block h-0.5 rounded-sm bg-white transition-all'></i>
                        <i className='ease relative block h-0.5 rounded-sm bg-white transition-all'></i>
                      </div>
                    </a>
                  </li>

                  <div className='container-nav-user'>
                    <li className='relative flex items-center pr-2'>
                      <p className='hidden transform-dropdown-show'></p>
                      <a
                        href='javascript:;'
                        className='ease-nav-brand block p-0 text-sm text-white transition-all'
                        dropdown-trigger="true"
                        aria-expanded='false'
                      >
                        {/* <i className='fa fa-bell cursor-pointer text-lg'></i> */}
                        <div style={{ width: '1rem' }}></div>
                      </a>
                    </li>
                    <button onClick={handleLogout} className='w-full cursor-pointer rounded-lg border-0 bg-white px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    {/* <i className='fa fa-power-off cursor-pointer text-black'></i> */}
                    <span className='text-black'>Sair</span>
                  </button>
                  </div>
                </ul>
              </div>
            </div>
          </nav>

          
        </main>
      </div>

      <div className='grid-content'>
        {children}
      </div>
    </div>
    </>
  )
}