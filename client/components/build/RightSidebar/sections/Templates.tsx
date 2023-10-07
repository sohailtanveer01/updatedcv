import { Button, ButtonBase } from '@mui/material';
import { Input, TextField, TextareaAutosize, Modal } from '@mui/material';
import { Add, AlternateEmail, DriveFileRenameOutline } from '@mui/icons-material';

import axios from 'axios';
import clsx from 'clsx';
import get from 'lodash/get';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import BaseModal from '@/components/shared/BaseModal';

import Heading from '@/components/shared/Heading';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setResumeState } from '@/store/resume/resumeSlice';
import templateMap, { TemplateMeta } from '@/templates/templateMap';
import { useEffect } from 'react';
import { addItem, editItem, setSummaryState } from '@/store/resume/resumeSlice';
import store from '@/store/index';
import { setModalState } from '@/store/modal/modalSlice';
import { useState } from 'react';
import styles from './Templates.module.scss';
import MyModal from '@/components/shared/MyModal';

const Templates = () => {
  const { t } = useTranslation();



  const dispatch = useAppDispatch();

  // console.log("im in des")


  const addText = t('builder.common.actions.add', {
    token: t('builder.leftSidebar.sections.profiles.heading', { count: 1 }),
  });
  const editText = t('builder.common.actions.edit', {
    token: t('builder.leftSidebar.sections.profiles.heading', { count: 1 }),
  });

  const [descModal, setdescModal] = useState(false)
  const currentTemplate: string = useAppSelector((state) => get(state.resume.present, 'metadata.template'));

  const handleChange = (template: TemplateMeta) => {
    dispatch(setResumeState({ path: 'metadata.template', value: template.id }));
  };

  const handleAdd = () => {
    setdescModal(true)
    console.log('descmodal', descModal)
  };

  // const handleClose = () => {
  //   setdescModal(false)
  // }


  const [loading, setLoading] = useState(false);
  const [buttontxt, setButtontxt] = useState('Get Keywords')
  const [btnaction, setBtnaction] = useState('getkeys')
  const [jobDescription, setJobDescription] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [summary, setSummary] = useState('')
  const OPEN_API_KEY = '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'
  const getKeywords = async () => {
    setLoading(true)
    if (btnaction == 'getkeys') {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/engines/davinci/completions', // Your API endpoint
          {
            prompt: `extract unique and single keywords from this job description (do not write sentences) and list them in order jobdescription :${jobDescription}`, // Job description as input
            max_tokens: 1500, // Adjust as needed
          },
          {
            headers: {
              Authorization: `Bearer ${OPEN_API_KEY}`, // Replace with your OpenAI API key
            },
          }
        );

        // Extract keywords from the OpenAI response
        const extractedKeywords = response.data.choices[0].text.split(',');
        setLoading(false)
        setKeywords(extractedKeywords);
        console.log(extractedKeywords)
        setButtontxt('Update My Summary Accordingly')
        setBtnaction('getSummary')

      } catch (error) {
        setLoading(false)
        console.error('Error sending request to OpenAI:', error);
      }
    } else {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/engines/davinci/completions', // Your API endpoint
          {
            prompt: `write a new job summary for my resume based on these keyworkds :${keywords}`,
            max_tokens: 500, // Adjust as needed
          },
          {
            headers: {
              Authorization: `Bearer ${OPEN_API_KEY}`, // Replace with your OpenAI API key
            },
          }
        );

        // Extract keywords from the OpenAI response
        const summaryfrmres = response.data.choices[0].text.split(',');
        setSummary(summaryfrmres)
        setLoading(false)
        store.dispatch(setSummaryState(summaryfrmres))

      } catch (error) {
        setLoading(false)
        console.error('Error sending request to OpenAI:', error);
      }
    }
  };

  // useEffect(() => {
  //   store.dispatch(setSummaryState(summary))
  // });


  return (
    <>
      <Button onClick={handleAdd}>Update by job desc</Button>
      <Heading path="metadata.templates" name={t('builder.rightSidebar.sections.templates.heading')} />

      <div className={styles.container}>
        {Object.values(templateMap).map((template) => (
          <div key={template.id} className={styles.template}>
            <div className={clsx(styles.preview, { [styles.selected]: template.id === currentTemplate })}>
              <ButtonBase onClick={() => handleChange(template)}>
                <Image
                  fill
                  priority
                  alt={template.name}
                  src={template.preview}
                  className="rounded-sm"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </ButtonBase>
            </div>

            <p className={styles.label}>{template.name}</p>
          </div>
        ))}



        <MyModal
         isOpen={descModal}
         heading='update summary' 
         // handleClose={function (): void {
         // }}                 
       >
         <div>
         <button
            onClick={() => setdescModal(false)}
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
           <form className="my-2 grid grid-cols-2 gap-4">
             <TextField
               required
               autoFocus
               label="add new description"
               onChange={(e) => setJobDescription(e.target.value)}
             />
             <Button onClick={getKeywords}>{buttontxt}</Button>
           </form>
           <div>
             {keywords.map((keyword, index) => (
               <li key={index}>{keyword}</li>
             ))}
             <p>summary:</p>
             {summary}
           </div>
         </div>
       </MyModal>

        {/* <Dialog open={descModal}>
          <DialogContent>
            <button
              onClick={() => setdescModal(false)}
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
              Upgrade

            </DialogFooter>
          </DialogContent>
        </Dialog> */}


      </div>
    </>
  );
};

export default Templates;
