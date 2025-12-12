
import React, { useRef } from 'react';
import { Download, X } from 'lucide-react';

interface CertificateModalProps {
    userName: string;
    courseName: string;
    completedAt: string;
    duration: number;
    onClose: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ userName, courseName, completedAt, duration, onClose }) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = certificateRef.current;
        if (printContent) {
            const printContents = printContent.innerHTML;

            // Create a temporary container for printing
            const printContainer = document.createElement('div');
            printContainer.innerHTML = printContents;
            printContainer.style.padding = '40px';
            printContainer.style.height = '100vh';
            printContainer.style.display = 'flex';
            printContainer.style.flexDirection = 'column';
            printContainer.style.justifyContent = 'center';
            printContainer.style.textAlign = 'center';

            // This method of swapping body HTML is a bit destructive in SPA. 
            // Better way for SPA: use a print-specific CSS class or a library.
            // For this MVP, we will use a simple window.print() and CSS media query if possible, 
            // BUT simpler: Open new window.

            const win = window.open('', '', 'height=700,width=900');
            if (win) {
                win.document.write('<html><head><title>Certificate</title>');
                win.document.write('<script src="https://cdn.tailwindcss.com"></script>'); // Quick styling for print window
                win.document.write('</head><body class="bg-white p-10 flex flex-col items-center justify-center h-screen">');
                win.document.write(printContents);
                win.document.write('</body></html>');
                win.document.close();
                win.print();
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-center">
            <div className="relative max-w-4xl w-full">
                {/* Controls */}
                <div className="absolute -top-12 right-0 flex gap-4">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg font-bold hover:bg-slate-100 transition-colors"
                    >
                        <Download size={20} /> Download / Print
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Certificate Area */}
                <div
                    ref={certificateRef}
                    className="bg-white text-slate-900 p-12 rounded-lg shadow-2xl relative overflow-hidden text-center border-[20px] border-double border-slate-200"
                    style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-900 rounded-br-full opacity-20"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-900 rounded-tl-full opacity-20"></div>

                    {/* Content */}
                    <div className="mb-8">
                        <h1 className="text-5xl font-serif font-bold text-indigo-900 mb-2 uppercase tracking-widest">Certificate</h1>
                        <p className="text-xl text-indigo-700 font-serif italic">of Completion</p>
                    </div>

                    <div className="mb-8 w-full max-w-2xl mx-auto border-b border-indigo-100 pb-8">
                        <p className="text-slate-500 mb-4">This certifies that</p>
                        <h2 className="text-4xl font-bold text-slate-800 mb-6 font-serif underline decoration-indigo-200 decoration-4 underline-offset-8">
                            {userName}
                        </h2>
                        <p className="text-slate-500 mb-4">has successfully completed the course</p>
                        <h3 className="text-3xl font-bold text-indigo-600 mb-2">
                            {courseName}
                        </h3>
                        <p className="text-slate-500">
                            Duration: {duration} Hours
                        </p>
                    </div>

                    <div className="flex justify-between items-end w-full max-w-2xl px-8 mt-8">
                        <div className="text-center">
                            <div className="w-40 border-b-2 border-slate-300 mb-2"></div>
                            <p className="text-sm font-bold text-slate-400 uppercase">Date</p>
                            <p className="font-serif">{new Date(completedAt).toLocaleDateString()}</p>
                        </div>

                        {/* Seal */}
                        <div className="relative">
                            <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-600 text-yellow-800 font-bold text-center text-xs p-2 rotate-12">
                                <span className="uppercase tracking-widest">Official<br />Certified<br />Excellence</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="w-40 border-b-2 border-slate-300 mb-2 mx-auto">
                                <span className="font-dancing-script text-2xl text-indigo-800">L&D Portal</span>
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase">Instructor / Platform</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateModal;
