import { Add, ImportExport, ArrowDownward } from '@mui/icons-material';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { ActionCreators } from 'redux-undo';
import { UserButton } from "@clerk/nextjs";
import { useState } from 'react';
import axios from 'axios'
import { Loader } from '@/components/ui/loader';
import ResumeCard from '@/components/dashboard/ResumeCard';
import ResumePreview from '@/components/dashboard/ResumePreview';
import Avatar from '@/components/shared/Avatar';
import Logo from '@/components/shared/Logo';
import { RESUMES_QUERY } from '@/constants/index';
import { fetchResumes } from '@/services/resume';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import styles from '@/styles/pages/Dashboard.module.scss';
import { setSubscriber } from '@/store/auth/authSlice';
// import store from '../store';
import { stripeFun } from '@/services/auth';

import { Card, CardContent } from "../components/ui/card";
import { Buttonpre } from "../components/ui/button";
// import ExtractCard from '@/components/dashboard/ExtractCard';

import { UpdateSubscriberParams, updateSubscriberfun } from '@/services/auth';
import { updateProfile } from '@/services/auth';
import { ServerError } from '@/services/axios';

import { useMutation } from 'react-query';

import store from '../store';
import { useRouter } from 'next/router';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../components/ui/dialog";

import { Badge } from "../components/ui/badge";

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'modals', 'dashboard'])),
  },
});


// Check if the 'sessionid' query parameter exists

const Dashboard: NextPage = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();


  const { data } = useQuery(RESUMES_QUERY, fetchResumes);

  const [loading, setLoading] = useState(false)
  const user: any = useAppSelector(((state) => state.auth.user))
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  const [jobDescription, setJobDescription] = useState('');
  const [keywords, setKeywords] = useState([]);
  // store.dispatch(setSubscriber(true))
  const router = useRouter();
  const hasSessionId = router.query?.session_id !== undefined;

  const count: any = useAppSelector(((state) => state.auth.user))
  const updatedCount: number = count.count;
  const isSubscriberredux = useAppSelector((state)=>state.auth.user?.isSubscriber)

  const handleupgradeClick = () => {
    setIsProModalOpen(true) // Set openPro to true when Upgrade is clicked
  };
  //check the db for isSubscrieber varible and change the redux state
  // const isSubscriber: any = useAppSelector(((state) => state.auth.user?.isSubscriber))

  // const { mutateAsync: updateProfileMutation } = useMutation<void, ServerError, UpdateSubscriberParams>(updateSubscriberfun);

  const onSubscribe = async () => {
    stripeFun()
  }
  useEffect(() => {
    dispatch(ActionCreators.clearHistory());
    checkuser()
  }, []);
  const checkuser = async () => {
    const id: number = user.id
    const apiUrl: string = process.env.NEXT_PUBLIC_API_URL!;

    const checkURL = 'api/auth/knowcustomer';
    const isSubscriber: any = await axios.post(checkURL, { id })
    //  const tokenresstr = String(tokenres.data)
    //  console.log(tokenresstr)
    // console.log("im in dashbord",isSubscriber.data)
    store.dispatch(setSubscriber(isSubscriber.data));

  }
  if (!data) return null;


  return (
    <div className={styles.container}>
      <Head>
        <title>
          {t('dashboard.title')} | {t('common.title')}
        </title>
      </Head>

      <header>
        <div className='flex gap-10'>
        <Link href="/">
          <Logo size={256} />
        </Link>
        {!isSubscriberredux &&(
             <div>
             {/* <Card className="bg-white/10 border-0">
               <CardContent className='py-3'>
                 <div className="text-center text-sm text-white mb-4 space-y-2">
                   <p>
                     {5 - Math.min(updatedCount ?? 0, 5)}  Free Updations left
                   </p>
   
                   <div className="bg-gray-300 h-3 rounded-full">
                     <div
                       className="bg-red-400 h-3 rounded-full"
                       style={{ width: updatedCount ? `${Math.min(updatedCount, 5) * 42}px` : '0' }}
                     ></div>
                   </div>
                 </div> */}
   
                 <Buttonpre className="w-full" variant="premium" onClick={handleupgradeClick}>
                   Upgrade To Pro
                 </Buttonpre>
               {/* </CardContent> */}
              {/* </Card> */}
           </div>
      )}
      </div>

        {/* <Avatar size={40} /> */}
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className={styles.resumes}>
        <ResumeCard
          icon={Add}
          modal="dashboard.create-resume"
          title={t('dashboard.create-resume.title')}
          subtitle={t('dashboard.create-resume.subtitle')}
        />

        <ResumeCard
          icon={ImportExport}
          modal="dashboard.import-external"
          title={t('dashboard.import-external.title')}
          subtitle={t('dashboard.import-external.subtitle')}
        />

        {/* <ExtractCard
          icon={ArrowDownward}
          // modal="dashboard.import-external"

        /> */}

        {data.map((resume) => (
          <ResumePreview key={resume.id} resume={resume} />
        ))}
        {/* {hasSessionId && (
          <div>
            <p className='text-gray-500'>Session ID: {router.query?.sessionid} your payment has been successful</p>
          </div>
        )} */}


     
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

        
     
      </main>
  
    </div>
  );
};

export default Dashboard;
