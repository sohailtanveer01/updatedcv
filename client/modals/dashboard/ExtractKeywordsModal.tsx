// const ExtractKeywordsModal: React.FC = () =>{
//     return(
//         <main>
//         <div className="max-w-md border rounded-md shadow-md p-4">
//           {/* Input field for job description */}
//           <h2 className="text-center  font-semibold mb-4">
//             Get Keywords from Job Description
//           </h2>

//           <textarea
//             // type="text"
//             placeholder="Enter job description"
//             value={jobDescription}
//             onChange={(e) => setJobDescription(e.target.value)}
//             className="w-full text-gray-800 px-4 py-2 border rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-300"
//           />

//           <button
//             onClick={getKeywords}
//             className="mt-2 block px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
//           >
//             Get Keywords
//           </button>
//           {loading && <Loader />}
//           {/* Display extracted keywords */}
//           {keywords.length > 0 && (
//             <div className="mt-4">
//               <h3 className="text-lg font-semibold">Extracted Keywords:</h3>
//               <ul className="mt-2">
//                 {keywords.map((keyword, index) => (
//                   <li key={index} className="text-gray-100">
//                     {keyword}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* ... */}
//         </div>
//       </main>
//     )
// }

// export default ExtractKeywordsModal