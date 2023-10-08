import {
  ContentCopy,
  DeleteOutline,
  DriveFileRenameOutline,
  Link as LinkIcon,
  MoreVert,
  OpenInNew,
} from '@mui/icons-material';
import { ButtonBase, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { Resume } from 'schema';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { stripeFun } from '@/services/auth';
import { RESUMES_QUERY } from '@/constants/index';
import { ServerError } from '@/services/axios';
import queryClient from '@/services/react-query';
import { deleteResume, DeleteResumeParams, duplicateResume, DuplicateResumeParams } from '@/services/resume';
import { setModalState } from '@/store/modal/modalSlice';
import { getRelativeTime } from '@/utils/date';
import getResumeUrl from '@/utils/getResumeUrl';

import styles from './ResumePreview.module.scss';

import { Buttonpre } from "../ui/button";

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
  resume: Resume;
};

const ResumePreview: React.FC<Props> = ({ resume }) => {
  const router = useRouter();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const { mutateAsync: duplicateMutation } = useMutation<Resume, ServerError, DuplicateResumeParams>(duplicateResume);

  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutateAsync: deleteMutation } = useMutation<void, ServerError, DeleteResumeParams>(deleteResume);
  const isSubscriber:any = useAppSelector((state) => state.auth.user?.isSubscriber)

  const count: any = useAppSelector(((state) => state.auth.user))
  const handleOpen = () => {
    handleClose();
    if(!isSubscriber && count.count>5){
      setIsProModalOpen(true)
    }else{
      router.push({
        pathname: '/[username]/[slug]/build',
        query: { username: resume.user.username, slug: resume.slug },
      });
    }
   
  };

  const handleOpenMenu = (event: React.MouseEvent<Element>) => {
    
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const onSubscribe = async () => {
    stripeFun()
  }

  const handleRename = () => {
    handleClose();

    dispatch(
      setModalState({
        modal: 'dashboard.rename-resume',
        state: {
          open: true,
          payload: {
            item: resume,
            onComplete: () => {
              queryClient.invalidateQueries(RESUMES_QUERY);
            },
          },
        },
      }),
    );
  };

  const handleDuplicate = async () => {
    handleClose();

    await duplicateMutation({ id: resume.id });

    queryClient.invalidateQueries(RESUMES_QUERY);
  };

  const handleShareLink = async () => {
    handleClose();

    const url = getResumeUrl(resume, { withHost: true });
    await navigator.clipboard.writeText(url);

    toast.success(t('common.toast.success.resume-link-copied'));
  };

  const handleDelete = async () => {
    handleClose();

    await deleteMutation({ id: resume.id });

    queryClient.invalidateQueries(RESUMES_QUERY);
  };

  return (
    <section className={styles.resume}>
      <Link
        passHref
        href={{
          pathname: '/[username]/[slug]/build',
          query: { username: resume.user.username, slug: resume.slug },
        }}
      >
        <ButtonBase className={styles.preview}>
          {resume.image ? <Image src={resume.image} alt={resume.name} priority width={400} height={0} /> : null}
        </ButtonBase>
      </Link>

      <footer>
        <div className={styles.meta}>
          <p>{resume.name}</p>
          <p>{t('dashboard.resume.timestamp', { timestamp: getRelativeTime(resume.updatedAt) })}</p>
        </div>

        <ButtonBase className={styles.menu} onClick={handleOpenMenu}>
          <MoreVert />
        </ButtonBase>

        <Menu anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
          <MenuItem onClick={handleOpen}>
            <ListItemIcon>
              <OpenInNew className="scale-90" />
            </ListItemIcon>
            <ListItemText>{t('dashboard.resume.menu.open')}</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleRename}>
            <ListItemIcon>
              <DriveFileRenameOutline className="scale-90" />
            </ListItemIcon>
            <ListItemText>{t('dashboard.resume.menu.rename')}</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleDuplicate}>
            <ListItemIcon>
              <ContentCopy className="scale-90" />
            </ListItemIcon>
            <ListItemText>{t('dashboard.resume.menu.duplicate')}</ListItemText>
          </MenuItem>

          {resume.public ? (
            <MenuItem onClick={handleShareLink}>
              <ListItemIcon>
                <LinkIcon className="scale-90" />
              </ListItemIcon>
              <ListItemText>{t('dashboard.resume.menu.share-link')}</ListItemText>
            </MenuItem>
          ) : (
            <Tooltip arrow placement="right" title={t('dashboard.resume.menu.tooltips.share-link')}>
              <div>
                <MenuItem>
                  <ListItemIcon>
                    <LinkIcon className="scale-90" />
                  </ListItemIcon>
                  <ListItemText>{t('dashboard.resume.menu.share-link')}</ListItemText>
                </MenuItem>
              </div>
            </Tooltip>
          )}

          <Tooltip arrow placement="right" title={t('dashboard.resume.menu.tooltips.delete')}>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteOutline className="scale-90" />
              </ListItemIcon>
              <ListItemText>{t('dashboard.resume.menu.delete')}</ListItemText>
            </MenuItem>
          </Tooltip>
        </Menu>
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

export default ResumePreview;
