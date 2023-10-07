import { Divider, IconButton, Menu, MenuItem } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { UserButton } from "@clerk/nextjs";

import { logout } from '@/store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalState } from '@/store/modal/modalSlice';
import getGravatarUrl from '@/utils/getGravatarUrl';

import styles from './Avatar.module.scss';

type Props = {
  size?: number;
  interactive?: boolean;
};

const Avatar: React.FC<Props> = ({ size = 64, interactive = true }) => {
  const router = useRouter();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const user = useAppSelector((state) => state.auth.user);
  const email = user?.email || '';

  const handleOpen = (event: React.MouseEvent<Element>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenProfile = () => {
    dispatch(setModalState({ modal: 'auth.profile', state: { open: true } }));
    handleClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();

    router.push('/');
  };

  return (
    <>
  
        <UserButton afterSignOutUrl="/" />
    </>
  );
};

export default Avatar;
