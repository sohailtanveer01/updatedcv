"use client"

import { DarkMode, LightMode, Link as LinkIcon } from '@mui/icons-material';
import { Masonry } from '@mui/lab';
import { Button, IconButton, NoSsr } from '@mui/material';
import { Buttonpre } from '../components/ui/button';
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress';
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { UserButton } from "@clerk/nextjs";
import Testimony from '@/components/home/Testimony';
import Footer from '@/components/shared/Footer';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import Logo from '@/components/shared/Logo';
import { screenshots } from '@/config/screenshots';
import { FLAG_DISABLE_SIGNUPS } from '@/constants/flags';
import testimonials from '@/data/testimonials';
import { logout, setSubscriber } from '@/store/auth/authSlice';
import { setTheme } from '@/store/build/buildSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';
import styles from '@/styles/pages/Home.module.scss';
import { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { setAccessToken, setCount, setUser } from '@/store/auth/authSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import store from '../store';
import { useEffect } from 'react';
import { stripeFun } from '@/services/auth';
import { User } from 'schema';
import axios from '@/services/axios';
import { number } from 'joi';
export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'modals', 'landing'])),
  },
});
// export type AuthDTO = {
//   user: User;
//   accessToken: string;
// };

const Home: NextPage = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const theme = useAppSelector((state) => state.build.theme);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const { isLoaded, isSignedIn, user } = useUser();
  const { userId, sessionId, getToken } = useAuth();
  const handleLogin = () => dispatch(setModalState({ modal: 'auth.login', state: { open: true } }));
  const handleRegister = () => dispatch(setModalState({ modal: 'auth.register', state: { open: true } }));
  const handleToggle = () => dispatch(setTheme({ theme: theme === 'light' ? 'dark' : 'light' }));
  const handleLogout = () => dispatch(logout());
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const count = useAppSelector((state)=>state.auth.user?.count)
  const isSubscriber = useAppSelector((state)=>state.auth.user?.isSubscriber)
  const existing = useAppSelector((state)=>state.auth.user)

  useEffect(() => {
    if(!isSignedIn &&(existing!==null)){
      handleLogout()
    }
    if (isSignedIn && (existing==null)) {
      // console.log(user.primaryEmailAddress?.emailAddress)
      // console.log(user)
      const newUserObject = {
        // id: 5, // Assuming 'id' is a number
        name: user.firstName,
        username: user.fullName, // Default to an empty string if 'username' is missing
        email: `${user.primaryEmailAddress?.emailAddress}`,
      
        // password: user.passwordEnabled
        // count: 0,
        // resumes: [],
        // provider:'google', // Default to 'email' if provider is missing
        // createdAt: '2023-09-13 14:54:23.28273',
        // updatedAt: '2023-09-17 13:47:39.241453'
      };
      const loginclerk = async()=>{
        const apiUrl:string = process.env.NEXT_PUBLIC_API_URL!;

        const loginUrl = `${apiUrl}/auth/clerklogin`;
        const {
          data: { user, accessToken },
        }= await axios.post(loginUrl,newUserObject)
      //  const tokenresstr = String(tokenres.data)
      //  console.log(tokenresstr)
      console.log(user,accessToken)
      store.dispatch(setUser(user));
      store.dispatch(setAccessToken(accessToken))
      }
      loginclerk()
      // console.log(loginclerk())
      
      // (async () => {
      //   const {accessToken, user} = await loginclerk();
      //   store.dispatch(setUser(user));
      //   store.dispatch(setAccessToken(accessToken));
      // })();
      // console.log(userId)
      // console.log(sessionId)
      // const fetchDataFromExternalResource = async () => {

        // const token: string | null = await getToken();
        // console.log(token)
        // store.dispatch(setAccessToken(token ?? ''));
      // }
      // fetchDataFromExternalResource()
      // store.dispatch(setUser(user));
      // <AuthDTO, user<AuthDTO>>
      
      
    }
  })
  const handleupgradeClick = () => {
    setIsProModalOpen(true) // Set openPro to true when Upgrade is clicked
  };

  const onSubscribe = async () => {
    stripeFun()
  }
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className='flex'>
            <Logo size={256} />
          </div>


          <div>
            {/* <h1>{t('common.title')}</h1> */}
            {/* <h2>{t('common.subtitle')}</h2> */}


            <NoSsr>

              <div className={styles.buttonWrapper}>
                {isSignedIn ? (
                  <>
                    {/* <Link href="/dashboard" passHref>
                       <Button>{t('landing.actions.app')}</Button>
                     </Link>

                     <Button variant="outlined" onClick={handleLogout}>
                       {t('landing.actions.logout')}
                     </Button> */}
                     
                     <div className='flex w-max justify-between gap-20'>
                     <Link href="/dashboard" passHref>
                      <Button>Go To App</Button>
                      {/* <p>{existing}</p> */}
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                     </div>
               

                  </>
                ) : (
                  <>
                    {/* <Button onClick={handleLogin}>{t('landing.actions.login')}</Button> */}
                    <Link href="/sign-in">
                      <Button className="rounded-full">
                        Get Started
                      </Button>
                    </Link>
                    {/* <Button variant="outlined" onClick={handleRegister} disabled={FLAG_DISABLE_SIGNUPS}>
                    {t('landing.actions.register')}
                  </Button> */}
                    {/* <Link href="/sign-up">
                      <Button className="rounded-full">
                        Register
                      </Button>
                    </Link> */}
                  </>

                )}
              </div>
              {isSignedIn && isSubscriber===false &&(
                <>
                  <div className='py-6'>
                    <Card className="bg-white/10 border-0">
                      <CardContent className='py-3'>
                        <div className="text-center text-sm text-white mb-4 space-y-2">
                          <p>
                          {5 - Math.min(count ?? 0, 5)}  Free Updations left
                          </p>
                          <div className="bg-gray-300 h-3 rounded-full">
                          <div
                            className="bg-red-400 h-3 rounded-full"
                            style={{ width: count ? `${Math.min(count, 5) * 42}px` : '0' }}
                          ></div>
                        </div>
                        </div>
                       
                        <Buttonpre className="w-full" variant="premium" onClick={handleupgradeClick}>
                          Upgrade To Pro
                        </Buttonpre>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

            </NoSsr>
          </div>
        </div>
      </div>
      <Dialog open={isProModalOpen}>
        <DialogContent>
          <button
            onClick={() => setIsProModalOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <DialogHeader>
            <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
              <div className="flex items-center gap-x-2 font-bold text-xl">
                Upgrade to updated cv
                <Badge variant="premium" className="uppercase text-sm py-1">
                  pro
                </Badge>
              </div>
            </DialogTitle>

          </DialogHeader>
          <DialogFooter>
            <Buttonpre disabled={loading} onClick={onSubscribe} size="lg" variant="premium" className="w-full">
              Upgrade
              {/* <Zap className="w-4 h-4 ml-2 fill-white" /> */}
            </Buttonpre>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section className={styles.section}>
        <h6>{t('landing.summary.heading')}</h6>

        <p>{t('landing.summary.body')}</p>
      </section>

      <section className={styles.section}>
        <h6>{t('landing.features.heading')}</h6>

        <ul className="list-inside list-disc leading-loose">
          <li>{t('landing.features.list.free')}</li>
          <li>{t('landing.features.list.ads')}</li>
          <li>{t('landing.features.list.tracking')}</li>
          <li>{t('landing.features.list.languages')}</li>
          <li>{t('landing.features.list.import')}</li>
          <li>{t('landing.features.list.export')}</li>
          <li>
            <Trans t={t} i18nKey="landing.features.list.more">
              And a lot of exciting features,
              {/* <a href={`${GITHUB_URL}#features`} target="_blank" rel="noreferrer">
                click here to know more
              </a> */}
            </Trans>
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h6>{t('landing.screenshots.heading')}</h6>

        <div className={styles.screenshots}>
          {screenshots.map(({ src, alt }) => (
            <a key={src} href={src} className={styles.image} target="_blank" rel="noreferrer">
              <Image
                fill
                src={src}
                alt={alt}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </a>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h6>{t('landing.testimonials.heading')}</h6>

        <p className="my-3">
          <Trans t={t} i18nKey="landing.testimonials.body">
            Good or bad, I would love to hear your opinion on Reactive Resume and how the experience has been for you.
            <br />
            Here are some of the messages sent in by users across the world.
          </Trans>
        </p>

        <p className="my-3">
          <Trans t={t} i18nKey="landing.testimonials.contact">
            You can reach out to me through <a href="mailto:im.amruth@gmail.com">my email</a> or through the contact
            form on <a href="https://www.amruthpillai.com">my website</a>.
          </Trans>
        </p>

        <Masonry columns={{ xs: 1, sm: 2, lg: 4 }} spacing={2}>
          {testimonials.map(({ name, message }, index) => (
            <Testimony key={index} name={name} message={message} />
          ))}
        </Masonry>
      </section>

      <section className={styles.section}>
        <h6>{t('landing.links.heading')}</h6>

        <div>
          <Link href="/meta/privacy" passHref>
            <Button variant="text" startIcon={<LinkIcon />}>
              {t('landing.links.links.privacy')}
            </Button>
          </Link>

          <Link href="/meta/service" passHref>
            <Button variant="text" startIcon={<LinkIcon />}>
              {t('landing.links.links.service')}
            </Button>
          </Link>
       
        </div>
      </section>


      <footer>
        <div className={styles.version}>
          <Footer className="font-semibold leading-5 opacity-50" />

          <div>v{process.env.appVersion}</div>
        </div>

        <div className={styles.actions}>
          <IconButton onClick={handleToggle}>{theme === 'dark' ? <DarkMode /> : <LightMode />}</IconButton>

          <LanguageSwitcher />
        </div>
      </footer>
    </main>
  );
};

export default Home;
