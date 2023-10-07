import { SvgIconComponent } from '@mui/icons-material';
import { ButtonBase } from '@mui/material';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ModalName, setModalState } from '@/store/modal/modalSlice';
import { toast } from "react-hot-toast";
import styles from './ResumeCard.module.scss';
import { useSelector } from 'react-redux';
import { setCount, setSubscriber } from '@/store/auth/authSlice';
import { useState } from 'react';
import { useProModal } from 'hooks/use-pro-modal';
// import { ProModal } from './pro-modal';
// import { FreeCounter } from './free-counter';
import axios from 'axios';
import { updateProfile } from '@/services/auth';
import { stripeFun } from '@/services/auth';

import { useMutation } from 'react-query';
import { ServerError } from '@/services/axios';
import { UpdateProfileParams } from '@/services/auth';
import { Card, CardContent } from "../ui/card";
import { Buttonpre } from "../ui/button";
import { Progress } from "../ui/progress";
import store from '@/store/index';


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../ui/dialog";

import { Badge } from "../ui/badge";

type Props = {
  modal: ModalName;
  icon: SvgIconComponent;
  title: string;
  subtitle: string;
};

const ResumeCard: React.FC<Props> = ({ modal, icon: Icon, title, subtitle }) => {
  const dispatch = useAppDispatch();
  const proModal = useProModal();
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { mutateAsync: updateProfileMutation } = useMutation<void, ServerError, UpdateProfileParams>(updateProfile);
  const isSubscriber = useAppSelector((state) => state.auth.user?.isSubscriber)

  const count: any = useAppSelector(((state) => state.auth.user))
  console.log(count.count)
  const updatedCount: number = count.count + 1;
  console.log(updatedCount)
  console.log("in in resume", isSubscriber)
  // const updatedCount = 4
  let handleClick
  if(!isSubscriber && updatedCount>5){
     handleClick = () => {setIsProModalOpen(true) };
  }else{
   handleClick = () => { dispatch(setModalState({ modal, state: { open: true } })), updateProfileMutation({ count: updatedCount }) };
  }
  const handleupgradeClick = () => {
    setIsProModalOpen(true) // Set openPro to true when Upgrade is clicked
  };

  const onSubscribe = async () => {
    stripeFun()
  }


  return (
    <section className={styles.resume}>
      {/* {((isSubscriber === true) ? */}
        {/* <> */}
          <ButtonBase className={styles.preview} onClick={handleClick}>
            <Icon sx={{ fontSize: 64 }} />
          </ButtonBase>
        {/* </>  */}
       



          
       {/* )} */}

      <footer>
        <div className={styles.meta}>
          <p>{title}</p>
          <p>{subtitle}</p>
        </div>
      </footer>

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
    </section>

  );
};

export default ResumeCard;
