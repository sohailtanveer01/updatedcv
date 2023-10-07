// import { joiResolver } from '@hookform/resolvers/joi';
// import { Add, AlternateEmail, DriveFileRenameOutline } from '@mui/icons-material';
// import { Button, Input, TextField, TextareaAutosize } from '@mui/material';
// import { Description, Profile } from 'schema';
// import Joi from 'joi';
// import get from 'lodash/get';
// import isEmpty from 'lodash/isEmpty';
// import { useTranslation } from 'next-i18next';
// import { useEffect, useMemo } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { useState } from 'react';
// import axios from 'axios';

// import BaseModal from '@/components/shared/BaseModal';
// import { VALID_URL_REGEX } from '@/constants/index';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { setModalState } from '@/store/modal/modalSlice';
// import { addItem, editItem, setSummaryState } from '@/store/resume/resumeSlice';
// import store from '@/store/index';

// type FormData = Description;

// const path = 'sections.description';

// const defaultState: FormData = {

//     description: '',
// };

// const schema = Joi.object<FormData>({
//     //   id: Joi.string(),
//     //   network: Joi.string().required(),
//     //   username: Joi.string().required(),
//     //   url: Joi.string().pattern(VALID_URL_REGEX, { name: 'valid URL' }).allow(''),
//     description: Joi.string()
// });

// const DescriptionModal: React.FC = () => {
//     const { t } = useTranslation();

//     const dispatch = useAppDispatch();

//     const { open: isOpen, payload } = useAppSelector((state) => state.modal[`builder.${path}`]);
//     // console.log("im in des")

//     const item: FormData = get(payload, 'item', null);
//     const isEditMode = useMemo(() => !!item, [item]);

//     const addText = t('builder.common.actions.add', {
//         token: t('builder.leftSidebar.sections.profiles.heading', { count: 1 }),
//     });
//     const editText = t('builder.common.actions.edit', {
//         token: t('builder.leftSidebar.sections.profiles.heading', { count: 1 }),
//     });

//     const { reset, control, handleSubmit } = useForm<FormData>({
//         defaultValues: defaultState,
//         resolver: joiResolver(schema),
//     });

//     //   const onSubmit = (formData: FormData) => {
//     //     if (isEditMode) {
//     //       dispatch(editItem({ path: 'basics.description', value: formData }));
//     //     } else {
//     //       dispatch(addItem({ path: 'basics.description', value: formData }));
//     //     }

//     //     handleClose();
//     //   };

//     const handleClose = () => {
//         dispatch(
//             setModalState({
//                 modal: `builder.${path}`,
//                 state: { open: false },
//             }),
//         );

//     };

//     //getting keywords
//     const [loading, setLoading] = useState(false);
//     const [buttontxt, setButtontxt] = useState('Get Keywords')
//     const [btnaction, setBtnaction] = useState('getkeys')
//     const [jobDescription, setJobDescription] = useState('');
//     const [keywords, setKeywords] = useState([]);
//     const [summary, setSummary] = useState('')
//     const OPEN_API_KEY = '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'
//     const getKeywords = async () => {
//         setLoading(true)
//         if(btnaction=='getkeys'){
//         try {
//             const response = await axios.post(
//                 'https://api.openai.com/v1/engines/davinci/completions', // Your API endpoint
//                 {
//                     prompt: `extract unique and single keywords from this job description (do not write sentences) and list them in order jobdescription :${jobDescription}`, // Job description as input
//                     max_tokens: 1500, // Adjust as needed
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${OPEN_API_KEY}`, // Replace with your OpenAI API key
//                     },
//                 }
//             );

//             // Extract keywords from the OpenAI response
//             const extractedKeywords = response.data.choices[0].text.split(',');
//             setLoading(false)
//             setKeywords(extractedKeywords);
//             console.log(extractedKeywords)
//             setButtontxt('Update My Summary Accordingly')
//             setBtnaction('getSummary')

//         } catch (error) {
//             setLoading(false)
//             console.error('Error sending request to OpenAI:', error);
//         }
//     }else{
//         try {
//             const response = await axios.post(
//                 'https://api.openai.com/v1/engines/davinci/completions', // Your API endpoint
//                 {
//                     prompt: `write a new job summary for my resume based on these keyworkds :${keywords}`,
//                     max_tokens: 500, // Adjust as needed
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${OPEN_API_KEY}`, // Replace with your OpenAI API key
//                     },
//                 }
//             );

//             // Extract keywords from the OpenAI response
//             const summaryfrmres = response.data.choices[0].text.split(',');
//             setSummary(summaryfrmres)
//             setLoading(false)
//            store.dispatch(setSummaryState(summaryfrmres))

//         } catch (error) {
//             setLoading(false)
//             console.error('Error sending request to OpenAI:', error);
//         }
//     }
//     };

//     useEffect(() => {
//         if (!isEmpty(item)) {
//             reset(item);
//         }
//     }, [item, reset]);

//     return (
//         // <BaseModal
//         //     icon={isEditMode ? <DriveFileRenameOutline /> : <Add />}
//         //     isOpen={isOpen}
//         //     heading={isEditMode ? editText : addText}
//         //     handleClose={handleClose}
//         // //   footerChildren={<Button onClick={handleSubmit(onSubmit)}>{isEditMode ? editText : addText}</Button>}
//         // >
//         //     <form className="my-2 grid grid-cols-2 gap-4" >
               
//         //                 <TextField
//         //                     required
//         //                     autoFocus
//         //                     label="add new description"
//         //                     onChange={(e) => setJobDescription(e.target.value)}
//         //                 />
                
//         //         <Button onClick={getKeywords}>{buttontxt}</Button>

//         //     </form>
//         //     <div>
//         //         {keywords.map((keyword, index) => (
//         //             <li key={index}>{keyword}</li>
//         //         ))}
//         //         <p>summary:</p>
//         //         {summary}
//         //     </div>
//         //. </BaseModal>
//         // <p>hi</p>
//     );
// };

// export default DescriptionModal;
