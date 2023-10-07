// import { SvgIconComponent } from '@mui/icons-material';
// import { ButtonBase } from '@mui/material';

// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { ModalName, setModalState } from '@/store/modal/modalSlice';
// import { toast } from "react-hot-toast";
// import styles from './ResumeCard.module.scss';
// import { useSelector } from 'react-redux';
// import { setCount } from '@/store/auth/authSlice';
// import { useState } from 'react';
// import { useProModal } from 'hooks/use-pro-modal';
// import { ProModal } from './pro-modal';
// import { FreeCounter } from './free-counter';
// import axios from 'axios';
// import { updateCount } from '@/services/auth';
// import { stripeFun } from '@/services/auth';

// import { Loader } from '../ui/loader';
// import { Card, CardContent } from "../ui/card";
// import { Button } from "../ui/button";
// import { Progress } from "../ui/progress";



// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogFooter
// } from "../ui/dialog";

// import { Badge } from "../ui/badge";

// type Props = {
//     // modal: ModalName;
//     icon: SvgIconComponent;
//     // title: string;
//     // subtitle: string;

// };

// const ExtractCard: React.FC<Props> = ({ icon: Icon, }) => {
//     const [loading, setLoading] = useState(false);
//     const [showmodal, setShowmodal] = useState(false)


//     const [jobDescription, setJobDescription] = useState('');
//     const [keywords, setKeywords] = useState([]);
//     const OPEN_API_KEY = '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'

//     const handleClick = () => {
//         console.log("extract key is clicked")
//         setShowmodal(true)
//     }
//     const getKeywords = async () => {
//         setLoading(true)
//         try {
//             const response = await axios.post(
//                 'https://api.openai.com/v1/engines/davinci/completions', // Your API endpoint
//                 {
//                     prompt: `extract key words from this job description ${jobDescription}`, // Job description as input
//                     max_tokens: 200, // Adjust as needed
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

//         } catch (error) {
//             setLoading(false)
//             console.error('Error sending request to OpenAI:', error);
//         }
//     };


//     return (

//         <section className={styles.resume}>
//             <ButtonBase className={styles.preview} onClick={handleClick}>
//                 <Icon sx={{ fontSize: 64 }} />
//             </ButtonBase>
//             <footer>
//                 <div className={styles.meta}>
//                     <p>Get Keywords</p>
//                     <p>extract keywords from job description</p>
//                 </div>
//             </footer>

//             <Dialog open={showmodal}>
//                 <DialogContent>
//                     <button
//                         onClick={() => setShowmodal(false)}
//                         className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                     >
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-6 w-6"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M6 18L18 6M6 6l12 12"
//                             />
//                         </svg>
//                     </button>
//                     <DialogHeader>
//                         <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
//                             <div className="flex items-center gap-x-2 font-bold text-xl">
//                                 Get Keywords from Job Description

//                             </div>
//                         </DialogTitle>
//                         <textarea
//                             // type="text"
//                             placeholder="Enter job description"
//                             value={jobDescription}
//                             onChange={(e) => setJobDescription(e.target.value)}
//                             className="w-full text-gray-800 px-4 py-2 border rounded-md shadow-md focus:outline-none  focus:border-gray-300"
//                         />
//                     </DialogHeader>
//                     <button
//                         onClick={getKeywords}
//                         className="mt-2 block px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring focus:border-blue-300"
//                     >
//                         Get Keywords
//                     </button>
//                     <DialogFooter>
//                         {loading && <Loader />}
//                         {keywords.length > 0 && (
//                             <div className="mt-4">
//                                 <h3 className="text-lg font-semibold">Extracted Keywords:</h3>
//                                 <ul className="mt-2">
//                                     {keywords.map((keyword, index) => (
//                                         <li key={index} className="text-gray-100">
//                                             {keyword}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         )}
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>


//         </section>


//     );
// };

// export default ExtractCard;
