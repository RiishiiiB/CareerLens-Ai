import { FileText } from "lucide-react";

export default function EmptyResumeState() {

    return (

        <div className="rounded-2xl border border-dashed border-slate-700 p-16 text-center">

            <FileText
                className="mx-auto h-16 w-16 text-slate-500"
            />

            <h2 className="mt-6 text-2xl font-bold text-white">

                No Resume Found

            </h2>

            <p className="mt-2 text-slate-400">

                Upload a resume first to receive AI-powered analysis.

            </p>

        </div>

    );

}