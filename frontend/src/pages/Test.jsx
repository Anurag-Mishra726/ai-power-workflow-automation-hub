// import React, { useState } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { 
//   X, 
//   Link as LinkIcon, 
//   FileText, 
//   RefreshCw,
//   Search,
//   Check,
//   ChevronDown,
//   Info
// } from 'lucide-react';

// // --- Components ---

// const CloseBtn = ({ onClose }) => (
//   <button 
//     onClick={onClose}
//     className="absolute right-4 top-4 p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
//   >
//     <X size={20} />
//   </button>
// );

// // --- Main Application ---

// const App = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  
//   // Dummy Data for Google Forms
//   const dummyForms = [
//     { id: 'form_01', name: 'Customer Feedback Survey 2024', responses: 124, lastModified: '2 hours ago' },
//     { id: 'form_02', name: 'Event Registration - Product Launch', responses: 45, lastModified: 'Yesterday' },
//     { id: 'form_03', name: 'Newsletter Signup Form', responses: 890, lastModified: '3 days ago' },
//     { id: 'form_04', name: 'Employee Satisfaction Poll', responses: 12, lastModified: '1 week ago' },
//   ];

//   // React Hook Form Setup
//   const { register, handleSubmit, control, watch, formState: { errors, isValid } } = useForm({
//     defaultValues: {
//       selectedFormId: '',
//       variableName: 'googleFormData',
//       fetchMethod: 'webhook'
//     },
//     mode: 'onChange'
//   });

//   const selectedFormId = watch('selectedFormId');

//   const handleConnect = () => {
//     setIsLoading(true);
//     // Simulate OAuth Delay
//     setTimeout(() => {
//       setIsConnected(true);
//       setIsLoading(false);
//     }, 1200);
//   };

//   const onSubmit = (data) => {
//     console.log("Configuration Saved:", data);
//     // Here you would typically send data to your backend
//   };

//   const onClose = () => {
//     console.log("Panel closed");
//   };

//   return (
//     <div className="min-h-screen bg-zinc-950 p-8 flex justify-end relative font-sans">
//       {/* Background Simulation of Workflow Canvas */}
//       <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
//         <div className="p-10 border-2 border-dashed border-zinc-700 rounded-3xl text-zinc-500 text-2xl font-mono">
//           Workflow Canvas Area
//         </div>
//       </div>

//       <aside className="absolute top-0 right-0 h-full w-full md:w-1/3 m-0 md:m-1 bg-[#000000] border-l md:border border-zinc-700 md:rounded-lg text-white z-50 flex flex-col shadow-2xl overflow-hidden">
        
//         {/* Header */}
//         <div className="flex px-4 py-5 border-b border-zinc-800 relative bg-zinc-900/50">
//           <div className="flex items-start gap-4">
//             <span className="p-2.5 border border-zinc-700 rounded-xl bg-zinc-900 shadow-inner flex items-center justify-center">
//                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" fill="#7248B9"/>
//                   <path d="M14 2V8H20L14 2Z" fill="#9061F9"/>
//                   <path d="M9 13H15M9 17H15M9 9H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                </svg>
//             </span>
//             <div>
//               <h2 className="text-2xl font-bold text-zinc-100">
//                 Google Form
//               </h2>
//               <p className="text-xs text-zinc-400 uppercase tracking-widest mt-0.5 font-medium">
//                 Trigger Configuration
//               </p>
//             </div>
//           </div>
//           <CloseBtn onClose={onClose} />
//         </div>

//         <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 scrollbar-thin scrollbar-thumb-zinc-700">
          
//           {/* Connection Section */}
//           <section className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Account</h3>
//               {isConnected && (
//                 <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
//                   <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
//                   Authenticated
//                 </span>
//               )}
//             </div>
            
//             {!isConnected ? (
//               <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center space-y-4 shadow-sm">
//                 <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto border border-zinc-700">
//                   <LinkIcon size={20} className="text-zinc-400" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-zinc-200">Connect Google Workspace</h4>
//                   <p className="text-sm text-zinc-500 mt-1 px-4">Grant permission to access your forms for automated triggers.</p>
//                 </div>
//                 <button 
//                   onClick={handleConnect}
//                   disabled={isLoading}
//                   className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? <RefreshCw size={18} className="animate-spin" /> : "Connect Google Form"}
//                 </button>
//               </div>
//             ) : (
//               <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between border-l-4 border-l-indigo-500">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">
//                     JD
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-zinc-200">John Doe</p>
//                     <p className="text-xs text-zinc-500">j.doe@company.com</p>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => setIsConnected(false)}
//                   className="text-xs text-zinc-500 hover:text-red-400 transition-colors font-medium underline"
//                 >
//                   Switch Account
//                 </button>
//               </div>
//             )}
//           </section>

//           {isConnected && (
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              
//               {/* Form Picker */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Select Form</label>
//                   {errors.selectedFormId && <span className="text-[10px] text-red-400">Required</span>}
//                 </div>
                
//                 <Controller
//                   name="selectedFormId"
//                   control={control}
//                   rules={{ required: true }}
//                   render={({ field }) => (
//                     <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
//                       {dummyForms.map((form) => (
//                         <div 
//                           key={form.id}
//                           onClick={() => field.onChange(form.id)}
//                           className={`p-3 border rounded-xl cursor-pointer transition-all flex items-center justify-between group ${
//                             field.value === form.id 
//                               ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
//                               : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900'
//                           }`}
//                         >
//                           <div className="flex items-center gap-3">
//                             <FileText size={18} className={field.value === form.id ? 'text-indigo-400' : 'text-zinc-500'} />
//                             <div>
//                               <p className="text-sm font-medium text-zinc-200">{form.name}</p>
//                               <p className="text-[10px] text-zinc-500 mt-0.5">{form.responses} responses • {form.lastModified}</p>
//                             </div>
//                           </div>
//                           {field.value === form.id && (
//                             <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center animate-in zoom-in duration-300">
//                               <Check size={12} strokeWidth={3} />
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 />
//               </div>

//               {/* Variable Assignment */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Output Variable</label>
//                   <Info size={14} className="text-zinc-500" />
//                 </div>
//                 <div className="relative group">
//                   <input 
//                     {...register('variableName', { 
//                       required: true,
//                       pattern: /^[a-zA-Z0-9_]+$/
//                     })}
//                     placeholder="e.g. registrationForm"
//                     className={`w-full bg-zinc-900 border ${errors.variableName ? 'border-red-500' : 'border-zinc-800'} rounded-lg py-3 px-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
//                   />
//                   {errors.variableName && (
//                     <p className="text-[10px] text-red-400 mt-1">Use only letters, numbers, and underscores.</p>
//                   )}
//                 </div>
//                 <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50">
//                   Reference this node's data in subsequent steps using: <br/>
//                   <code className="text-indigo-400 mt-1 block font-mono">
//                     {`{{${watch('variableName') || 'variableName'}.response.data}}`}
//                   </code>
//                 </p>
//               </div>

//               {/* Extra Configuration Toggle (Dummy) */}
//               <div className="space-y-3 pt-2">
//                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/20 border border-zinc-800/50">
//                     <span className="text-sm text-zinc-300">Auto-refresh responses</span>
//                     <div className="w-10 h-5 bg-indigo-600 rounded-full relative flex items-center px-1">
//                       <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-1" />
//                     </div>
//                  </div>
//               </div>
//             </form>
//           )}
//         </div>

//         {/* Footer Actions */}
//         <div className="p-4 border-t border-zinc-800 bg-zinc-950 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
//            <button 
//              type="button"
//              form="config-form"
//              onClick={handleSubmit(onSubmit)}
//              className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
//                isConnected && isValid && selectedFormId
//                  ? 'bg-white text-black hover:bg-zinc-200 active:scale-[0.98]' 
//                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
//              }`}
//              disabled={!isConnected || !isValid || !selectedFormId}
//            >
//              Save Node Configuration
//            </button>
//         </div>
//       </aside>
//     </div>
//   );
// };

// export default App;

import React from 'react';
import { HardDrive, User, ChevronDown, FolderOpen, FileText, Settings2 } from 'lucide-react';

const DriveConfigPanel = () => {
  return (
    <div className="w-64 h-full bg-[#0a0a0a]/80 backdrop-blur-xl border-l border-white/10 p-4 flex flex-col gap-6 text-white shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-white/5">
        <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <HardDrive size={18} className="text-blue-400" />
        </div>
        <h3 className="font-semibold text-sm tracking-tight text-white/90">Google Drive</h3>
      </div>

      {/* Connection Section */}
      <section className="space-y-3">
        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Connected Account</label>
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/20 flex items-center justify-center overflow-hidden">
             <User size={14} className="text-white/60" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">johndoe@gmail.com</p>
            <p className="text-[10px] text-green-400">Active</p>
          </div>
        </div>
      </section>

      {/* Action Selection */}
      <section className="space-y-3">
        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Action</label>
        <div className="relative">
          <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all">
            <option>Upload File</option>
            <option>Create Folder</option>
            <option>Find File by ID</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-2.5 text-white/30 pointer-events-none" />
        </div>
      </section>

      {/* Folder Destination (The "Where") */}
      <section className="space-y-3">
        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
          <FolderOpen size={10} /> Destination Folder
        </label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Select folder..."
            className="w-full bg-black/20 border border-white/5 rounded-md p-2 text-xs text-white/60 focus:border-blue-500/50"
          />
          <button className="px-2 bg-white/10 rounded-md hover:bg-white/20 border border-white/10 transition-colors text-[10px]">
            Browse
          </button>
        </div>
      </section>

      {/* File Name (The "What") */}
      <section className="space-y-3">
        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
          <FileText size={10} /> File Name
        </label>
        <div className="space-y-2">
          <input 
            type="text" 
            defaultValue="report_{{date}}.pdf"
            className="w-full bg-black/20 border border-white/5 rounded-md p-2 text-xs font-mono text-blue-300 focus:border-blue-400/50 transition-all shadow-inner"
          />
          <p className="text-[9px] text-white/30 italic">Supports dynamic variables</p>
        </div>
      </section>

      {/* Advanced Toggle */}
      <section className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[11px] text-white/50 flex items-center gap-2">
          <Settings2 size={12} /> Advanced
        </span>
        <div className="w-8 h-4 bg-white/10 rounded-full relative cursor-pointer border border-white/5">
          <div className="absolute left-1 top-0.5 w-2.5 h-2.5 bg-white/40 rounded-full" />
        </div>
      </section>
      
    </div>
  );
};

export default DriveConfigPanel;