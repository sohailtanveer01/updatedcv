import { Close as CloseIcon } from '@mui/icons-material';
import { Fade, IconButton, Modal } from '@mui/material';
import { useRouter } from 'next/router';

import styles from './BaseModal.module.scss';
import { useState } from 'react';

type Props = {
  isOpen: boolean;
  heading: string;
  children?: React.ReactNode;
  footerChildren?: React.ReactNode;
};

const MyModal: React.FC<Props> = ({isOpen, heading, children, footerChildren}) => {
 
  
    return (
        
        <Modal
        open={isOpen}
        closeAfterTransition
        aria-labelledby={heading}
        classes={{ root: 'flex items-center justify-center' }}
      >
        <Fade in={isOpen}>
          <div className={styles.content}>
            <header className={styles.header}>
              <div>
                <h1>{heading}</h1>
              </div>
  
             
            </header>
  
            <div className={styles.body}>{children}</div>
  
            {footerChildren ? <footer className={styles.footer}>{footerChildren}</footer> : null}
          </div>
        </Fade>
      </Modal>
    ) 
    }
  
  
export default MyModal;
